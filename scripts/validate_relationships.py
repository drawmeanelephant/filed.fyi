#!/usr/bin/env python3
"""validate_relationships.py — Audit the relationship export for integrity.

Checks the exported relationship fields (``related`` in the RAG export,
``relations`` in the context bundle) against the source of record and writes a
Markdown report to ``reports/relationship-integrity.md``.

Two layers of checking are performed.

Shape checks — the exported values themselves:
1. **Missing targets** — relationship values that resolve to no known record,
   including source declarations that resolve to nothing.
2. **Duplicate relationships** — repeated identical values inside one record.
3. **Self-links** — a record related to itself.
4. **Malformed IDs** — values that are neither stable entity IDs nor
   source-relative paths (e.g. export-internal ``content/pages/...`` paths).

Parity checks — source vs. export:
5. **Missing from RAG export** — expected source relationships absent from the
   RAG ``related`` field.  An empty export field is a finding, not a pass.
6. **Missing from context export** — expected source relationships absent from
   the context ``relations`` field.
7. **Unexpected in RAG export** — ``related`` values not supported by source.
8. **Unexpected in context export** — ``relations`` values not supported by
   source.
9. **RAG/context disagreement** — RAG and context exports name different
   target sets for the same record.
10. **Bundle membership loss** — bundle-container paths (``parts/...``,
    ``bundle/...``, export-internal RAG paths) found inside ``related``: the
    membership belongs in ``bundle_parts`` and must never live in ``related``.

The audit fails (exit status 1) whenever any expected source relationship is
missing from an export, even when the exported field is empty.

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
    parse_frontmatter,
    resolve_target,
    scalar,
    semantic_relationships,
)

MAX_ROWS = 25

RELATION_KIND = re.compile(r"^[a-z_]+=(.*)$")

# Finding categories in report order.
CATEGORIES = [
    ("missing", "Missing targets"),
    ("duplicates", "Duplicate relationships"),
    ("self_links", "Self-links"),
    ("malformed", "Malformed IDs"),
    ("missing_rag", "Missing from RAG export"),
    ("missing_context", "Missing from context export"),
    ("unexpected_rag", "Unexpected in RAG export"),
    ("unexpected_context", "Unexpected in context export"),
    ("rag_context_disagreement", "RAG/context disagreement"),
    ("bundle_membership_loss", "Bundle membership loss"),
]
CATEGORY_KEYS = [key for key, _ in CATEGORIES]

COUNT_LABELS = [
    ("source_supported", "Source-supported relationships"),
    ("source_records", "Records with source-supported relationships"),
    ("rag_exported", "RAG relationships exported"),
    ("context_exported", "Context relationships exported"),
    ("bundle_preserved", "Bundle memberships preserved"),
    ("unresolved", "Unresolved source declarations"),
]


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


def strip_kind(value: str) -> str:
    """Strip a ``relates_to=``-style kind prefix, leaving the target value."""
    match = RELATION_KIND.match(value)
    return match.group(1) if match else value


def audit(by_id: dict, by_source: dict, semantic_by_id: dict[str, list[str]],
          unresolved: list[tuple[str, str]], rag_dir: Path,
          context_dir: Path
          ) -> tuple[dict[str, list[tuple[str, str, str]]], dict[str, int]]:
    """Run shape and parity checks over the exported artifacts.

    Returns (findings, counts) where findings maps category key to
    (artifact_or_source, entity_id, value) rows and counts holds the report
    numbers (source-supported relationships, exported edges, preserved bundle
    memberships, unresolved declarations).
    """
    findings: dict[str, list[tuple[str, str, str]]] = {key: [] for key in CATEGORY_KEYS}
    counts: dict[str, int] = {key: 0 for key, _ in COUNT_LABELS}

    rag_targets: dict[str, list[str]] = {}      # entity_id -> non-container targets
    rag_paths: dict[str, str] = {}              # entity_id -> artifact-relative path
    context_targets: dict[str, list[str]] = {}
    context_paths: dict[str, str] = {}

    def shape_checks(artifact: str, entity_id: str, values: list[str]) -> None:
        """Report malformed, duplicate, self-link, and unresolved values."""
        seen: set[str] = set()
        for raw in values:
            value = strip_kind(raw)
            shape = canonical_shape(value)
            if shape == "malformed":
                findings["malformed"].append((artifact, entity_id, raw))
            if value in seen:
                findings["duplicates"].append((artifact, entity_id, raw))
            seen.add(value)
            if value == entity_id:
                findings["self_links"].append((artifact, entity_id, raw))
            if resolve_target(value, by_id, by_source) is None and shape not in (
                    "container-path", "rag-path"):
                findings["missing"].append((artifact, entity_id, raw))

    if rag_dir.is_dir():
        for path in sorted(rag_dir.glob("content/pages/**/*.md")):
            fields, blocks = parse_frontmatter(path.read_text(encoding="utf-8"))
            entity_id = scalar(fields.get("entity_id"))
            if not entity_id:
                continue
            rel = str(path.relative_to(rag_dir))
            values = [item if isinstance(item, str) else ""
                      for item in blocks.get("related", [])]
            shape_checks(rel, entity_id, values)
            targets: list[str] = []
            for raw in values:
                value = strip_kind(raw)
                if is_container(value):
                    # Membership belongs in bundle_parts, never in related.
                    findings["bundle_membership_loss"].append((rel, entity_id, raw))
                else:
                    targets.append(value)
            rag_targets[entity_id] = targets
            rag_paths[entity_id] = rel
            counts["rag_exported"] += len(targets)
            counts["bundle_preserved"] += len(
                [item for item in blocks.get("bundle_parts", [])
                 if isinstance(item, str) and item.strip()])
            # Container paths are stripped from the RAG target set: they are
            # reported as bundle membership loss above (they belong in
            # bundle_parts).  The context scan keeps them so a container in
            # `relations` surfaces as unexpected_context instead.

    if context_dir.is_dir():
        for path in sorted(context_dir.glob("pages/**/*.md")):
            fields, blocks = parse_frontmatter(path.read_text(encoding="utf-8"))
            entity_id = scalar(fields.get("entity_id"))
            if not entity_id:
                continue
            rel = str(path.relative_to(context_dir))
            values = [item if isinstance(item, str) else ""
                      for item in blocks.get("relations", [])]
            shape_checks(rel, entity_id, values)
            targets = [strip_kind(value) for value in values]
            context_targets[entity_id] = targets
            context_paths[entity_id] = rel
            counts["context_exported"] += len(targets)

    # Source-level unresolved declarations (shared with the repair tool).
    counts["unresolved"] = len(unresolved)
    for source, target in unresolved:
        entity = by_source.get(source)
        entity_id = entity.entity_id if entity else source.split("/")[0]
        findings["missing"].append(("content/" + source, entity_id, target))

    # Parity: every expected source relationship must reach both exports, and
    # neither export may carry relationships the source does not support.
    for entity_id in sorted(set(rag_targets) | set(context_targets) | set(semantic_by_id)):
        entity = by_id.get(entity_id)
        source = "content/" + entity.source if entity else entity_id
        expected = semantic_by_id.get(entity_id, [])
        rag = rag_targets.get(entity_id, [])
        ctx = context_targets.get(entity_id, [])
        for value in expected:
            if value not in rag:
                findings["missing_rag"].append((source, entity_id, value))
            if value not in ctx:
                findings["missing_context"].append((source, entity_id, value))
        for value in rag:
            if value not in expected:
                findings["unexpected_rag"].append(
                    (rag_paths.get(entity_id, source), entity_id, value))
        for value in ctx:
            if value not in expected:
                findings["unexpected_context"].append(
                    (context_paths.get(entity_id, source), entity_id, value))
        if set(rag) != set(ctx):
            findings["rag_context_disagreement"].append(
                (source, entity_id, f"RAG {sorted(rag)!r} != context {sorted(ctx)!r}"))

    counts["source_supported"] = sum(len(v) for v in semantic_by_id.values())
    counts["source_records"] = len(semantic_by_id)
    return findings, counts


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

    semantic_by_id, unresolved = semantic_relationships(by_id, by_source, args.content)
    findings, counts = audit(by_id, by_source, semantic_by_id, unresolved,
                             args.rag_dir, args.context_dir)

    total = sum(len(rows) for rows in findings.values())
    status = "PASS" if total == 0 else "FINDINGS"

    labels = {key: label for key, label in CATEGORIES}
    lines: list[str] = []
    lines.append("# Relationship Integrity — Export Audit")
    lines.append("")
    lines.append(f"**Status:** {status}  ")
    lines.append("**Surface:** RAG export (`related`), context bundle (`relations`), source of record (`content/`)  ")
    lines.append("**Repair:** `scripts/repair_relationships.py`  ")
    lines.append("**Validation:** `scripts/validate_relationships.py`  ")
    lines.append(f"**Generated:** {datetime.date.today().isoformat()}")
    lines.append("")
    lines.append("## Relationship export")
    lines.append("")
    lines.append("| metric | value |")
    lines.append("|---|---|")
    for key, label in COUNT_LABELS:
        if key == "source_records":
            continue  # folded into the "N across N records" source row
        if key == "source_supported":
            lines.append(f"| {label} | {counts['source_supported']} across {counts['source_records']} records |")
        else:
            lines.append(f"| {label} | {counts[key]} |")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    lines.append("| check | findings |")
    lines.append("|---|---|")
    for key, label in CATEGORIES:
        lines.append(f"| {label} | {len(findings[key])} |")
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
    lines.append("- Parity: every source-supported relationship must appear in both the RAG and")
    lines.append("  context exports; an empty export field for a relationship-bearing record is a finding.")
    lines.append("")
    lines.append("## Findings")
    lines.append("")
    for key, label in CATEGORIES:
        lines.append(f"### {label}")
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

    print(f"relationship integrity: {status} — {total} finding(s); "
          f"{counts['source_supported']} source-supported relationship(s) across "
          f"{counts['source_records']} record(s); report written to {args.report}")
    return 1 if total else 0


if __name__ == "__main__":
    raise SystemExit(main())
