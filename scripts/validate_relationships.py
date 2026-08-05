#!/usr/bin/env python3
"""validate_relationships.py — Audit the relationship export for integrity.

Checks the exported relationship fields (``related`` in the RAG export,
``relations`` in the context bundle) against the source of record and writes a
Markdown report to ``reports/relationship-integrity.md``.

Reported categories
-------------------
1. **Missing targets** — relationship values that resolve to no known record.
2. **Duplicate relationships** — repeated identical values inside one record.
3. **Self-links** — a record related to itself.
4. **Container-only relationships** — ``related`` entries pointing at bundle
   containers (``parts/...``) or at structural trunk pages, especially records
   whose ``related`` is *only* container paths.
5. **Malformed IDs** — values that are neither stable entity IDs nor
   source-relative paths (e.g. export-internal ``content/pages/...`` paths).

Usage
-----
    python3 scripts/validate_relationships.py \
        --content content \
        --rag-dir publish/rag \
        --context-dir publish/context \
        [--report reports/relationship-integrity.md]

Exit status is 1 when any finding is present, 0 otherwise. The report is
always written.
"""

from __future__ import annotations

import argparse
import datetime
import re
import sys
from pathlib import Path

from repair_relationships import (
    ENTITY_ID,
    PART_PATH,
    RAG_PATH,
    SOURCE_PATH,
    TRUNK_ID,
    build_index,
    extract_relations,
    parse_frontmatter,
    resolve_target,
    scalar,
    split_frontmatter,
)

MAX_ROWS = 25


def canonical_shape(value: str) -> str:
    """Classify a relationship value's shape for the malformed-ID check."""
    if ENTITY_ID.match(value) or TRUNK_ID.match(value):
        return "entity-id"
    if SOURCE_PATH.match(value):
        return "source-path"
    if RAG_PATH.match(value):
        return "rag-path"
    if PART_PATH.match(value):
        return "container-path"
    return "malformed"


def is_container(value: str) -> bool:
    """True when a value points at a bundle container or export-internal path.

    Stable entity IDs of real records (including trunk nodes, e.g. the home
    page linking to its collections) are legitimate relationship values and
    are deliberately not treated as containers here.
    """
    return bool(PART_PATH.match(value) or RAG_PATH.match(value))


RELATION_KIND = re.compile(r"^[a-z_]+=(.*)$")


def check_exports(by_id: dict, by_source: dict, rag_dir: Path,
                  context_dir: Path) -> dict[str, list[tuple[str, str, str]]]:
    """Run the five checks over exported artifacts.

    Returns {category: [(source, entity_id, value)]} findings.  ``source`` is
    the artifact-relative path, ``entity_id`` the owning record, ``value`` the
    offending relationship value (or detail text).
    """
    findings: dict[str, list[tuple[str, str, str]]] = {
        "missing": [], "duplicates": [], "self_links": [],
        "container_only": [], "malformed": [],
    }
    container_records: set[str] = set()

    def check_values(artifact_path: Path, entity_id: str, values: list[str]) -> None:
        seen: set[str] = set()
        container_hits: list[str] = []
        for value in values:
            # Context `relations` items are typed (relates_to=<id>); validate
            # the target, not the kind prefix.
            kind_match = RELATION_KIND.match(value)
            value = kind_match.group(1) if kind_match else value
            shape = canonical_shape(value)
            if shape == "malformed":
                findings["malformed"].append((str(artifact_path), entity_id, value))
            if shape in ("container-path", "rag-path") or is_container(value):
                container_hits.append(value)
                findings["container_only"].append((str(artifact_path), entity_id, value))
            if value in seen:
                findings["duplicates"].append((str(artifact_path), entity_id, value))
            seen.add(value)
            if value == entity_id:
                findings["self_links"].append((str(artifact_path), entity_id, value))
            if resolve_target(value, by_id, by_source) is None and shape != "container-path":
                findings["missing"].append((str(artifact_path), entity_id, value))
        if values and container_hits and len(container_hits) == len(values):
            container_records.add(entity_id)

    if rag_dir.is_dir():
        for path in sorted(rag_dir.glob("content/pages/**/*.md")):
            fields, blocks = parse_frontmatter(path.read_text(encoding="utf-8"))
            entity_id = scalar(fields.get("entity_id"))
            if not entity_id:
                continue
            values = [item if isinstance(item, str) else "" for item in blocks.get("related", [])]
            check_values(path.relative_to(rag_dir), entity_id, values)

    if context_dir.is_dir():
        for path in sorted(context_dir.glob("pages/**/*.md")):
            fields, blocks = parse_frontmatter(path.read_text(encoding="utf-8"))
            entity_id = scalar(fields.get("entity_id"))
            if not entity_id:
                continue
            values = [item if isinstance(item, str) else "" for item in blocks.get("relations", [])]
            if not values:
                values = []
            check_values(path.relative_to(context_dir), entity_id, values)

    # Records whose related is exclusively container paths (nothing survives).
    container_only: list[tuple[str, str, str]] = []
    for entity_id in sorted(container_records):
        container_only.append(("", entity_id, "related is entirely bundle-container paths"))
    findings["container_only"] = container_only + findings["container_only"]
    return findings


def render_table(rows: list[tuple[str, str, str]]) -> str:
    if not rows:
        return "_none_"
    lines = ["| artifact / source | entity | value |", "|---|---|---|"]
    for source, entity_id, value in rows[:MAX_ROWS]:
        lines.append(f"| `{source}` | `{entity_id}` | `{value}` |")
    if len(rows) > MAX_ROWS:
        lines.append(f"| … and {len(rows) - MAX_ROWS} more | | |")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--content", type=Path, default=Path("content"))
    parser.add_argument("--rag-dir", type=Path, default=Path("publish/rag"))
    parser.add_argument("--context-dir", type=Path, default=Path("publish/context"))
    parser.add_argument("--report", type=Path, default=Path("reports/relationship-integrity.md"))
    args = parser.parse_args()

    try:
        by_id, by_source, _warnings = build_index(args.content)
    except OSError as error:
        print(f"relationship integrity: error: {error}", file=sys.stderr)
        return 2

    raw_targets, _unresolved = extract_relations(by_id, by_source, args.content)

    findings = check_exports(by_id, by_source, args.rag_dir, args.context_dir)

    # Source-declared relationship targets that resolve to nothing.
    source_missing: list[tuple[str, str, str]] = []
    for entity_id, targets in raw_targets.items():
        for target in targets:
            if resolve_target(target, by_id, by_source) is None:
                source_missing.append(("content/" + by_id[entity_id].source, entity_id, target))
    findings["missing"] = source_missing + findings["missing"]

    labels = {
        "missing": "Missing targets",
        "duplicates": "Duplicate relationships",
        "self_links": "Self-links",
        "container_only": "Relationships pointing only to bundle containers",
        "malformed": "Malformed IDs",
    }
    total = sum(len(values) for values in findings.values())
    status = "PASS" if total == 0 else "FINDINGS"

    lines: list[str] = []
    lines.append("# Relationship Integrity — Export Audit")
    lines.append("")
    lines.append(f"**Status:** {status}  ")
    lines.append("**Surface:** RAG export (`related`), context bundle (`relations`), source of record (`content/`)  ")
    lines.append("**Repair:** `scripts/repair_relationships.py`  ")
    lines.append("**Validation:** `scripts/validate_relationships.py`  ")
    lines.append(f"**Generated:** {datetime.date.today().isoformat()}")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append("| check | findings |")
    lines.append("|---|---|")
    for key in ("missing", "duplicates", "self_links", "container_only", "malformed"):
        lines.append(f"| {labels[key]} | {len(findings[key])} |")
    lines.append(f"| **total** | **{total}** |")
    lines.append("")
    lines.append("## Relationship model")
    lines.append("")
    lines.append("- `parent_entry` is the repository parent (structural), never a bundle container.")
    lines.append("- `related` / `relations` carry source-supported semantic relationships only:")
    lines.append("  frontmatter `relations`, legacy `relatedEntries`, and explicit Markdown")
    lines.append("  cross-references that resolve to another record.")
    lines.append("- Bundle-part membership is stored separately (`bundle_parts`), never in `related`.")
    lines.append("- Repeated identical values are deduplicated per record.")
    lines.append("- Unresolved targets are reported here instead of being silently discarded.")
    lines.append("")
    lines.append("## Findings")
    lines.append("")
    for key in ("missing", "duplicates", "self_links", "container_only", "malformed"):
        lines.append(f"### {labels[key]}")
        lines.append("")
        lines.append(render_table(findings[key]))
        lines.append("")
    lines.append("## Validation commands")
    lines.append("")
    lines.append("```bash")
    lines.append("python3 scripts/repair_relationships.py --content content --rag-dir publish/rag --context-dir publish/context")
    lines.append("python3 scripts/validate_relationships.py --content content --rag-dir publish/rag --context-dir publish/context")
    lines.append("```")
    lines.append("")

    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text("\n".join(lines), encoding="utf-8")

    print(f"relationship integrity: {status} — {total} finding(s); report written to {args.report}")
    return 1 if total else 0


if __name__ == "__main__":
    raise SystemExit(main())
