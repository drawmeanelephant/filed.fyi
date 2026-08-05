#!/usr/bin/env python3
"""recover_relationships.py — Recover explicit pre-migration relationship ground truth.

The Astro->Boris migration (commit 8e7db007) dropped nearly all legacy
``relatedEntries`` metadata: the current source tree carries zero frontmatter
``relations`` and zero frontmatter ``relatedEntries`` declarations, while the
pre-migration relationship audit (scripts/audit-relationships.mjs at
6abe4416) counted 4,293 declared relationships across 2,238 entries.

This script recovers those declarations from the immutable migration ground
truth — commit 6abe4416 (src/content/ + src/content-residue/) — and writes a
committed, reproducible manifest:

    metadata/relationship-map.jsonl     one row per recovered declaration
    metadata/relationship-recovery.json summary counts + provenance

It follows the provenance approach of the tag repair (fix_tag_truncation.py):
the Astro-era tree at 6abe4416 is the source of record for metadata the
migration mapper lost, and metadata/id-map.jsonl supplies the exact
legacy->current correspondence.  The manifest is committed so the publish
pipeline never needs an untracked scratch directory; this script reproduces
the manifest byte-for-byte whenever repository history is available.

Recovered legacy fields (the explicit semantic relationship surface the
legacy audit counted): ``relatedEntries``, ``mascotRef``, ``relatedMascots``,
``relatedHaiku``, ``relatedLimerick`` (``relatedLorelog`` is counted when
truthy; every observed value at 6abe4416 is null).  Structural
``parentEntry`` declarations are deliberately excluded and counted separately:
parent/collection membership is structural, never a semantic edge.

Resolution mirrors the legacy canonical identity module
(src/lib/archive-identity.ts at 6abe4416): strict exact matching against
stable identity aliases with precedence

    1. exact collection + id
    2. caseNumber / mascotId
    3. slug / basename
    4. explicit legacy alias
    5. unresolved (fuzzy is never canonical)

Legacy collection aliases are handled explicitly: the legacy world placed
``reference``, ``guides``, ``posts`` (and changelog/releases) under ``docs``,
and id-map.jsonl already renames those legacy_id prefixes to current
collection names.  Ambiguous and missing targets are reported in the manifest
(status ``ambiguous`` / ``missing``), never silently dropped.

Usage
-----
    python3 scripts/recover_relationships.py --generate   # writes the manifest (needs git history)
    python3 scripts/recover_relationships.py --verify     # regenerate in a temp dir, diff committed outputs
    python3 scripts/recover_relationships.py --check      # validate the committed manifest against content/

--verify exits 0 when the committed manifest reproduces byte-for-byte, 1 on
mismatch, and 0 with a warning when the ground-truth commit is not available
in repository history (shallow clones) — the committed manifest is the
pipeline ground truth either way.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROVENANCE_COMMIT = "6abe4416"
MANIFEST = ROOT / "metadata" / "relationship-map.jsonl"
SUMMARY = ROOT / "metadata" / "relationship-recovery.json"
ID_MAP = ROOT / "metadata" / "id-map.jsonl"

# Legacy semantic relationship fields, in declaration order (mirrors the
# order the legacy audit scanned them).
FIELD_ORDER = [
    "relatedEntries",
    "mascotRef",
    "relatedMascots",
    "relatedLorelog",
    "relatedHaiku",
    "relatedLimerick",
]

# Legacy fields that are structural (excluded from the semantic manifest).
STRUCTURAL_FIELDS = ["parentEntry"]

# normalizeToken() from src/lib/archive-identity.ts (6abe4416).
_KNOWN_COLLECTIONS = (
    "lorelog|mascots|releases|changelog|haikus|limericks|aphorisms|reference|guides|posts"
)
_NORM_PREFIX = re.compile(
    r"^/?(docs/)?(%s)/" % _KNOWN_COLLECTIONS, re.IGNORECASE
)
_NORM_EXT = re.compile(r"\.mdx?$", re.IGNORECASE)


def normalize_token(token: object) -> str:
    """Mirror archive-identity.normalizeToken: strip ext/folder prefixes, lowercase."""
    if token is None:
        return ""
    value = str(token).strip()
    value = _NORM_EXT.sub("", value)
    value = _NORM_PREFIX.sub("", value, count=1)
    return value.lower()


def canonical_key(collection: str, ident: str) -> str:
    """Mirror archive-identity.canonicalKey: '<coll>:<normalized-id>'."""
    coll = (collection or "docs").lower().strip()
    return f"{coll}:{normalize_token(ident)}"


def derive_collection_id(rel: str) -> tuple[str, str]:
    """Mirror archive-identity.deriveCollectionAndId for a src/content path.

    docs/mascots/... and docs/lorelog/... keep their collection; everything
    else under docs/ is collection ``docs`` with the subpath as the id.
    """
    parts = rel.split("/")
    if parts[0] == "docs":
        if parts[1] in ("mascots", "lorelog"):
            return parts[1], "/".join(parts[2:])
        return "docs", "/".join(parts[1:])
    return parts[0], "/".join(parts[1:])


def derive_legacy_id(rel: str) -> str:
    """Map a src/content-relative legacy path to its id-map ``legacy_id``.

    The migration stripped the ``docs/`` segment and the extension, e.g.
    ``docs/reference/forms/fref-0870-qthr.mdx`` -> ``reference/forms/fref-0870-qthr``.
    """
    stem = _NORM_EXT.sub("", rel)
    if stem.startswith("docs/"):
        stem = stem[len("docs/"):]
    return stem


class Entry:
    """One legacy entry from the ground-truth tree (src/content only)."""

    __slots__ = ("source", "collection", "raw_id", "data", "legacy_id", "current")

    def __init__(self, source: str, collection: str, raw_id: str,
                 data: dict, legacy_id: str):
        self.source = source
        self.collection = collection
        self.raw_id = raw_id
        self.data = data or {}
        self.legacy_id = legacy_id
        self.current: dict | None = None  # id-map row, when a counterpart exists

    def aliases(self) -> tuple[str, list[str], list[str], list[str], list[str]]:
        """Mirror archive-identity.entryAliases precedence tiers."""
        data = self.data
        exact = canonical_key(self.collection, self.raw_id)

        case_number_keys: list[str] = []
        if data.get("caseNumber"):
            case_number_keys.append(normalize_token(data["caseNumber"]))

        mascot_id_keys: list[str] = []
        raw_mascot_id = data.get("mascotId")
        if raw_mascot_id not in (None, "", "???"):
            raw = str(raw_mascot_id).strip()
            mascot_id_keys.append(raw.lower())
            if raw.isdigit():
                padded = raw.zfill(3)
                if padded not in mascot_id_keys:
                    mascot_id_keys.append(padded)
                plain = str(int(raw))
                if plain not in mascot_id_keys:
                    mascot_id_keys.append(plain)

        slug_keys: list[str] = []
        basename = normalize_token(self.raw_id.split("/")[-1])
        if basename:
            slug_keys.append(basename)
        if data.get("slug"):
            norm_slug = normalize_token(data["slug"])
            if norm_slug and norm_slug not in slug_keys:
                slug_keys.append(norm_slug)

        alias_keys: list[str] = []
        raw_aliases: list[object] = []
        for key in ("legacyAliases", "aliases", "alias"):
            value = data.get(key)
            if isinstance(value, list):
                raw_aliases.extend(value)
            elif isinstance(value, str):
                raw_aliases.append(value)
        if data.get("formNumber"):
            raw_aliases.append(data["formNumber"])
        for alias in raw_aliases:
            norm = normalize_token(alias)
            if norm and norm not in alias_keys:
                alias_keys.append(norm)

        return exact, case_number_keys, mascot_id_keys, slug_keys, alias_keys


def _yaml():
    """Return the YAML module, failing with a clear dependency message.

    The legacy tree parsed frontmatter with gray-matter (full YAML), so the
    recovery generator needs PyYAML.  Imported lazily so the --check path
    (which never parses frontmatter) works without it.
    """
    try:
        import yaml
        return yaml
    except ImportError:
        sys.exit("error: PyYAML is required to parse the legacy ground truth — "
                 "install it with: python3 -m pip install pyyaml")


def parse_frontmatter_yaml(text: str) -> dict:
    """Parse the frontmatter block with a full YAML loader (gray-matter parity)."""
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    yaml = _yaml()
    try:
        data = yaml.safe_load(parts[1])
    except yaml.YAMLError:
        return {}
    return data if isinstance(data, dict) else {}


def extract_declarations(fm: dict) -> tuple[list[tuple[str, object]], int]:
    """Extract (field, ref) semantic declarations and count structural fields.

    Mirrors the field handling of scripts/audit-relationships.mjs at 6abe4416
    so the recovered declaration counts reconcile exactly with the 4,293
    pre-migration audit scope.
    """
    declarations: list[tuple[str, object]] = []
    structural = 0

    for item in fm.get("relatedEntries") or []:
        if isinstance(item, str):
            declarations.append(("relatedEntries", item))
        elif isinstance(item, dict) and item.get("id"):
            declarations.append(("relatedEntries", item))

    if fm.get("mascotRef"):
        declarations.append(("mascotRef", {"collection": "mascots",
                                           "id": str(fm["mascotRef"])}))

    for mascot in fm.get("relatedMascots") or []:
        if mascot:
            declarations.append(("relatedMascots", {"collection": "mascots",
                                                    "id": str(mascot)}))

    if fm.get("relatedLorelog"):
        declarations.append(("relatedLorelog", {"collection": "lorelog",
                                                "id": str(fm["relatedLorelog"])}))

    for item in fm.get("relatedHaiku") or []:
        if isinstance(item, dict) and item.get("slug"):
            declarations.append(("relatedHaiku", {"collection": "haikus",
                                                  "id": str(item["slug"])}))

    for item in fm.get("relatedLimerick") or []:
        if isinstance(item, dict) and item.get("slug"):
            declarations.append(("relatedLimerick", {"collection": "limericks",
                                                     "id": str(item["slug"])}))

    if fm.get("parentEntry"):
        structural += 1

    return declarations, structural


def resolve_exact_alias(ref, entries: list[Entry], processed: dict[Entry, tuple]
                        ) -> tuple[bool, str | None, Entry | None, list[Entry]]:
    """Mirror archive-identity.resolveExactAlias strict precedence.

    Returns (resolved, match_type, matched_entry, ambiguous_matches).
    """
    if isinstance(ref, str):
        target_ref = ref.strip()
        first = target_ref.split("/")[0].lower()
        known = {"lorelog", "mascots", "haikus", "limericks", "aphorisms",
                 "releases", "changelog", "docs"}
        target_coll = first if first in known else None
    else:
        target_coll = ref.get("collection")
        target_ref = str(ref.get("id") or "")

    if target_coll and target_coll.lower() in ("reference", "guides", "posts"):
        target_coll = "docs"

    clean_token = normalize_token(target_ref)
    if not clean_token:
        return False, None, None, []

    # Tier 1: exact collection + id.
    if target_coll:
        target_key = canonical_key(target_coll, target_ref)
        tier1 = [e for e in entries if processed[e][0] == target_key]
        if len(tier1) == 1:
            return True, "exact", tier1[0], []
        if len(tier1) > 1:
            return True, "exact", tier1[0], tier1

    # Tier 2: caseNumber or mascotId (global, exact).
    tier2: list[Entry] = []
    seen_t2: set[int] = set()
    for entry in entries:
        _exact, case_keys, mascot_keys, _slug, _alias = processed[entry]
        if clean_token in case_keys or clean_token in mascot_keys:
            if id(entry) not in seen_t2:
                tier2.append(entry)
                seen_t2.add(id(entry))
    if len(tier2) == 1:
        return True, "caseNumber", tier2[0], []
    if len(tier2) > 1:
        return True, "caseNumber", tier2[0], tier2

    # Tier 3: slug / basename (global, exact).
    tier3 = [e for e in entries if clean_token in processed[e][3]]
    if len(tier3) == 1:
        return True, "slug", tier3[0], []
    if len(tier3) > 1:
        return True, "slug", tier3[0], tier3

    # Tier 4: explicit legacy alias (global, exact).
    tier4 = [e for e in entries if clean_token in processed[e][4]]
    if len(tier4) == 1:
        return True, "alias", tier4[0], []
    if len(tier4) > 1:
        return True, "alias", tier4[0], tier4

    return False, None, None, []


def load_id_map(id_map_path: Path) -> tuple[dict[str, dict], dict[str, dict]]:
    """Return (legacy_id -> row, current_source -> row) for satellites."""
    by_legacy: dict[str, dict] = {}
    by_source: dict[str, dict] = {}
    for line in id_map_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        row = json.loads(line)
        if row.get("role") == "satellite":
            legacy = row.get("legacy_id") or ""
            if legacy:
                by_legacy[legacy] = row
            by_source[row["source"]] = row
    return by_legacy, by_source


def collect_ground_truth(gt_root: Path) -> list[Entry]:
    """Index every src/content file at the ground-truth commit."""
    content_dir = gt_root / "src" / "content"
    entries: list[Entry] = []
    for path in sorted(content_dir.rglob("*")):
        if path.suffix not in (".md", ".mdx") or not path.is_file():
            continue
        rel = path.relative_to(content_dir).as_posix()
        text = path.read_text(encoding="utf-8", errors="replace")
        fm = parse_frontmatter_yaml(text)
        collection, raw_id = derive_collection_id(rel)
        entries.append(Entry(rel, collection, raw_id, fm, derive_legacy_id(rel)))
    return entries


def build_rows(entries: list[Entry], by_legacy: dict[str, dict]
               ) -> tuple[list[dict], dict[str, int], int]:
    """Resolve every declaration and build manifest rows.

    Returns (rows, status_counts, structural_only).  Rows are ordered by
    (current_id, legacy_source) with declaration order preserved inside a
    source, so the repair's first-seen merge order is deterministic.
    """
    # Attach current counterparts.
    for entry in entries:
        entry.current = by_legacy.get(entry.legacy_id)

    processed = {entry: entry.aliases() for entry in entries}
    rows: list[dict] = []
    status_counts = {"resolved": 0, "missing": 0, "ambiguous": 0,
                     "self": 0, "source_unmigrated": 0}
    structural_only = 0

    for entry in entries:
        declarations, structural = extract_declarations(entry.data)
        structural_only += structural
        for field, ref in declarations:
            current = entry.current
            if current is None:
                status_counts["source_unmigrated"] += 1
                rows.append(_row(field, ref, entry, current=None,
                                 status="source_unmigrated"))
                continue
            resolved, match_type, matched, ambiguous = resolve_exact_alias(
                ref, entries, processed)
            if not resolved:
                status_counts["missing"] += 1
                rows.append(_row(field, ref, entry, current=current,
                                 status="missing"))
                continue
            if len(ambiguous) > 1:
                status_counts["ambiguous"] += 1
                rows.append(_row(field, ref, entry, current=current,
                                 status="ambiguous"))
                continue
            resolved_current = matched.current if matched else None
            if resolved_current is None:
                # Resolved to a legacy entry with no current counterpart.
                status_counts["missing"] += 1
                rows.append(_row(field, ref, entry, current=current,
                                 status="missing"))
                continue
            if resolved_current["id"] == current["id"]:
                status_counts["self"] += 1
                rows.append(_row(field, ref, entry, current=current,
                                 status="self",
                                 resolved=resolved_current, match_type=match_type))
                continue
            status_counts["resolved"] += 1
            rows.append(_row(field, ref, entry, current=current,
                             status="resolved", resolved=resolved_current,
                             match_type=match_type))

    # Stable sort by (current_id, legacy_source) only: Python's sort is stable,
    # so declaration order is preserved inside each source (legacy field order,
    # then declaration index) — the repair consumes the manifest in this
    # first-seen order.
    rows.sort(key=lambda r: (r.get("current_id") or "",
                             r.get("legacy_source") or ""))
    return rows, status_counts, structural_only


def _row(field: str, ref, entry: Entry, current: dict | None, status: str,
         resolved: dict | None = None, match_type: str | None = None) -> dict:
    if isinstance(ref, str):
        legacy_collection = None
        legacy_target = ref
    else:
        legacy_collection = ref.get("collection")
        legacy_target = str(ref.get("id") or "")
    row = {
        "current_id": current["id"] if current else None,
        "current_source": current["source"] if current else None,
        "legacy_source": entry.source,
        "legacy_field": field,
        "legacy_collection": legacy_collection,
        "legacy_target": legacy_target,
        "status": status,
        "resolved_id": resolved["id"] if resolved else None,
        "resolved_source": resolved["source"] if resolved else None,
        "match_type": match_type,
        "provenance": PROVENANCE_COMMIT,
    }
    return row


def content_residue_declarations(gt_root: Path) -> tuple[int, int]:
    """Count quarantined/other content-residue relationship declarations.

    These are real pre-migration declarations but fall outside the legacy
    audit scope (src/content only); they are reported as an intentional
    exclusion, not recovered into the manifest.
    """
    residue = gt_root / "src" / "content-residue"
    if not residue.is_dir():
        return 0, 0
    files = 0
    declarations = 0
    for path in sorted(residue.rglob("*")):
        if path.suffix not in (".md", ".mdx") or not path.is_file():
            continue
        files += 1
        fm = parse_frontmatter_yaml(path.read_text(encoding="utf-8", errors="replace"))
        decls, _structural = extract_declarations(fm)
        declarations += len(decls)
    return files, declarations


def write_manifest(rows: list[dict], summary: dict, manifest: Path,
                   summary_path: Path) -> None:
    lines = [json.dumps(row, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
             for row in rows]
    manifest.write_text("\n".join(lines) + ("\n" if lines else ""), encoding="utf-8")
    summary_path.write_text(
        json.dumps(summary, sort_keys=True, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")


def extract_ground_truth(tmp: Path) -> Path | None:
    """Materialise commit 6abe4416's src/content + src/content-residue."""
    target = tmp / "gt"
    target.mkdir(parents=True, exist_ok=True)
    archive = subprocess.run(
        ["git", "archive", PROVENANCE_COMMIT, "src/content", "src/content-residue"],
        cwd=ROOT, capture_output=True, check=False)
    if archive.returncode != 0:
        return None  # history unavailable
    subprocess.run(["tar", "-x", "-C", str(target)], input=archive.stdout, check=True)
    return target


def generate(gt_root: Path, id_map_path: Path) -> tuple[list[dict], dict]:
    """Build manifest rows and the summary from a ground-truth tree."""
    entries = collect_ground_truth(gt_root)
    by_legacy, _by_source = load_id_map(id_map_path)
    rows, status_counts, structural_only = build_rows(entries, by_legacy)

    declared_by_field: dict[str, int] = {}
    for row in rows:
        declared_by_field[row["legacy_field"]] = (
            declared_by_field.get(row["legacy_field"], 0) + 1)
    declared_total = sum(declared_by_field.values())

    residue_files, residue_decls = content_residue_declarations(gt_root)
    unmigrated = sorted({
        row["legacy_source"] for row in rows
        if row["status"] == "source_unmigrated"
    })

    summary = {
        "artifact": "relationship-recovery-manifest",
        "provenance_commit": PROVENANCE_COMMIT,
        "ground_truth": ["src/content", "src/content-residue"],
        "entries_scanned": len(entries),
        "audit_scope_total": declared_total + structural_only,
        "declared_by_field": declared_by_field,
        "declared_total": declared_total,
        "structural_only": {"parentEntry": structural_only},
        "status_counts": status_counts,
        "manifest_rows": len(rows),
        "content_residue_excluded": {
            "files": residue_files,
            "related_declarations": residue_decls,
        },
        "unmigrated_sources": unmigrated,
    }
    return rows, summary


def run_verify(manifest: Path, summary_path: Path) -> int:
    """Regenerate in a temp dir and diff byte-for-byte against committed outputs."""
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        gt_root = extract_ground_truth(tmp_path)
        if gt_root is None:
            print("WARNING: ground-truth commit %s not found in repository history; "
                  "committed manifest not re-verified." % PROVENANCE_COMMIT)
            return 0
        rows, summary = generate(gt_root, ID_MAP)
        write_manifest(rows, summary, tmp_path / "relationship-map.jsonl",
                       tmp_path / "relationship-recovery.json")
        mismatches = []
        for name, committed in (("relationship-map.jsonl", manifest),
                                ("relationship-recovery.json", summary_path)):
            fresh = tmp_path / name
            if not committed.is_file():
                mismatches.append(f"{name}: committed file missing")
                continue
            if committed.read_bytes() != fresh.read_bytes():
                mismatches.append(f"{name}: regenerated bytes differ from committed")
        if mismatches:
            print("relationship recovery verify: FAIL")
            for message in mismatches:
                print(f"  - {message}")
            return 1
        print("relationship recovery verify: PASS — manifest and summary "
              "reproduce byte-for-byte from commit %s" % PROVENANCE_COMMIT)
        return 0


def run_check(manifest: Path, summary_path: Path, content_root: Path) -> int:
    """Validate the committed manifest against the current source of record."""
    errors: list[str] = []
    rows = []
    if not manifest.is_file():
        errors.append(f"manifest missing: {manifest}")
    else:
        for lineno, line in enumerate(manifest.read_text(encoding="utf-8").splitlines()):
            if not line.strip():
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError as error:
                errors.append(f"{manifest}:{lineno + 1}: invalid JSON — {error}")
        for row in rows:
            status = row.get("status")
            if status not in ("resolved", "missing", "ambiguous", "self",
                              "source_unmigrated"):
                errors.append(f"row {row.get('legacy_source')}: bad status {status!r}")
            if row.get("provenance") != PROVENANCE_COMMIT:
                errors.append(f"row {row.get('legacy_source')}: provenance != {PROVENANCE_COMMIT}")
            if status in ("resolved", "self"):
                if not row.get("resolved_id") or not row.get("current_id"):
                    errors.append(f"row {row.get('legacy_source')}: {status} without ids")
                if not (content_root / (row.get("resolved_source") or "")).is_file():
                    errors.append(f"row {row.get('legacy_source')}: resolved_source "
                                  f"{row.get('resolved_source')} missing from content/")
                if not (content_root / (row.get("current_source") or "")).is_file():
                    errors.append(f"row {row.get('legacy_source')}: current_source "
                                  f"{row.get('current_source')} missing from content/")

    if not summary_path.is_file():
        errors.append(f"summary missing: {summary_path}")
    else:
        try:
            summary = json.loads(summary_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            errors.append(f"{summary_path}: invalid JSON — {error}")
            summary = {}
        if summary.get("manifest_rows") != len(rows):
            errors.append(f"summary manifest_rows {summary.get('manifest_rows')} "
                          f"!= manifest rows {len(rows)}")
        if summary.get("provenance_commit") != PROVENANCE_COMMIT:
            errors.append("summary provenance mismatch")
        status_counts = summary.get("status_counts") or {}
        actual_counts: dict[str, int] = {status: 0 for status in (
            "resolved", "missing", "ambiguous", "self", "source_unmigrated")}
        for row in rows:
            status = row.get("status", "")
            actual_counts[status] = actual_counts.get(status, 0) + 1
        if status_counts != actual_counts:
            errors.append(
                f"summary status_counts {status_counts} != manifest rows {actual_counts}")

    if errors:
        print("relationship recovery check: FAIL")
        for error in errors:
            print(f"  - {error}")
        return 1
    print(f"relationship recovery check: PASS — {len(rows)} manifest row(s) "
          f"consistent with content/")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--generate", action="store_true",
                       help="regenerate the committed manifest from ground truth")
    group.add_argument("--verify", action="store_true",
                       help="regenerate in a temp dir and diff against committed outputs")
    group.add_argument("--check", action="store_true",
                       help="validate the committed manifest against content/")
    parser.add_argument("--content", type=Path, default=ROOT / "content")
    args = parser.parse_args()

    if args.generate:
        with tempfile.TemporaryDirectory() as tmp:
            gt_root = extract_ground_truth(Path(tmp))
            if gt_root is None:
                print("ERROR: ground-truth commit %s not found in repository history; "
                      "cannot generate the manifest." % PROVENANCE_COMMIT, file=sys.stderr)
                return 2
            rows, summary = generate(gt_root, ID_MAP)
            write_manifest(rows, summary, MANIFEST, SUMMARY)
            print(f"wrote {len(rows)} manifest row(s) to {MANIFEST}")
            print(f"wrote summary to {SUMMARY}")
            print(f"audit scope total: {summary['audit_scope_total']} "
                  f"(declared {summary['declared_total']} + "
                  f"structural-only {summary['structural_only']['parentEntry']})")
            print(f"status: {summary['status_counts']}")
        return 0
    if args.verify:
        return run_verify(MANIFEST, SUMMARY)
    if args.check:
        return run_check(MANIFEST, SUMMARY, args.content)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
