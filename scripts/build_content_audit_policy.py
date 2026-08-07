#!/usr/bin/env python3
"""build_content_audit_policy.py — Derive the reviewed Boris poetry-audit
ownership policy from committed canonical relationship evidence.

Answer to one question only: can Filed deterministically derive a
trustworthy ``boris-content-audit --mode=poetry`` ownership policy from
``metadata/relationship-map.jsonl`` without filename guessing and without
manually maintaining thousands of mappings?

Design rules
------------

1. **Evidence is canonical IDs only.** The generator consumes the committed
   recovery manifest (``metadata/relationship-map.jsonl``) and the committed
   identity map (``metadata/id-map.jsonl``). It never reads filenames, numeric
   prefixes, titles, tags, or fuzzy/similarity signals. ``match_type`` is
   provenance bookkeeping from the recovery step and is never used as
   evidence.

2. **A relationship may become ``exact_mappings[poetry_id] = source_id`` only
   when all of the following hold:**

   - the relationship category is explicitly accepted as ownership evidence
     (``metadata/content-audit-policy/categories.json``);
   - the row is ``resolved`` with canonical ``current_id``/``resolved_id``;
   - one endpoint resolves to an existing canonical poetry record;
   - the other endpoint resolves to an existing eligible source record;
   - the poetry record resolves to exactly one owner across all accepted
     evidence.

3. **Fail closed.** Malformed or contested accepted evidence is reported as a
   structured finding and is never silently dropped, never guessed, and never
   used to pick a winner. Findings cover: unresolved accepted rows, missing
   endpoints, noncanonical endpoints, impossible endpoint roles, ineligible
   source endpoints, self-references, stale content records, multiple distinct
   owners for one poetry id, and unknown relationship categories.

4. **Determinism.** Sorted stable JSON, identical bytes on every run, no host
   paths, no timestamps, no Git-derived values. The source tree is never
   mutated. ``--check`` regenerates from committed inputs and verifies the
   committed outputs byte-for-byte.

Usage
-----
    python3 scripts/build_content_audit_policy.py [--check]

Optional overrides (used by tests):

    --map, --id-map, --population, --categories, --content,
    --output, --summary

Exit status is 1 when a **blocking** finding is present (unsafe policy:
noncanonical endpoints, missing records, self-references) or when ``--check``
detects drift. Contested accepted evidence (multiple owners, unresolved rows,
non-poetry declarers) is reported without blocking: the conservative policy
simply does not map those records.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Committed inputs.
DEFAULT_MAP = ROOT / "metadata" / "relationship-map.jsonl"
DEFAULT_ID_MAP = ROOT / "metadata" / "id-map.jsonl"
DEFAULT_POPULATION = ROOT / "metadata" / "content-audit-policy" / "population.json"
DEFAULT_CATEGORIES = ROOT / "metadata" / "content-audit-policy" / "categories.json"
DEFAULT_CONTENT = ROOT / "content"
# Committed outputs.
DEFAULT_OUTPUT = ROOT / "metadata" / "content-audit-policy" / "policy.json"
DEFAULT_SUMMARY = ROOT / "metadata" / "content-audit-policy" / "summary.json"

ACCEPTED = "accepted-ownership-evidence"

# Findings that would make the generated policy unsafe (stale or wrong keys,
# missing records): they fail the generation with exit 1. Findings that merely
# report contested or out-of-population accepted evidence (multiple owners,
# unresolved rows, non-poetry declarers) are recorded but do not block: the
# conservative policy excludes those records by design and the report is the
# review surface.
BLOCKING_KINDS = {
    "missing_policy_endpoint",
    "noncanonical_endpoint",
    "missing_content_record",
    "self_reference",
}

# Policy fields that pass straight through from the committed population
# template; only ``exact_mappings`` is derived.
PASSTHROUGH_FIELDS = (
    "schema_version",
    "poetry_collections",
    "eligible_collections",
    "excluded_statuses",
    "excluded_ids",
    "placeholder",
    "density_bands",
    "mapping_relation_kinds",
)


def load_jsonl(path: Path) -> list[dict]:
    rows = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            rows.append(json.loads(line))
    return rows


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def render(obj) -> bytes:
    """Deterministic JSON bytes: sorted keys, 2-space indent, trailing NL."""
    text = json.dumps(obj, indent=2, sort_keys=True, ensure_ascii=False)
    return (text + "\n").encode("utf-8")


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def content_record_ids(content_root: Path) -> dict[str, str]:
    """Map every canonical id in the content tree to its collection.

    The id comes from frontmatter ``id:``; the collection from the directory
    the file lives in. Only stable ids are collected; files without an id are
    ignored here (the audit reports them independently).
    """
    ids: dict[str, str] = {}
    for path in sorted(content_root.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        match = re.search(r"^id:\s*(\S+)\s*$", text, flags=re.MULTILINE)
        if not match:
            continue
        rel = path.relative_to(content_root)
        # Collection derivation matches boris-content-audit's collectionOfPath:
        # nested files take their directory; a top-level file (a collection
        # landing page) is keyed by its bare filename, so it is never a poetry
        # or eligible source record.
        collection = rel.parts[0] if len(rel.parts) > 1 else rel.name
        ids[match.group(1)] = collection
    return ids


def collection_of(entity_id: str) -> str:
    return entity_id.split("/", 1)[0]


def category_for(field: str, categories: dict) -> dict:
    """Return the classification entry for a legacy field (never None)."""
    classification = categories.get("classification", {})
    entry = classification.get(field)
    if entry is not None:
        return entry
    # Documented default bucket: unknown fields are irrelevant to ownership.
    return {
        "bucket": categories.get("default_classification", "irrelevant"),
        "poetry_endpoint": None,
        "source_endpoint": None,
        "rationale": "field is not classified in metadata/content-audit-policy/categories.json",
    }


def endpoint_side(entry: dict, side: str, row: dict) -> str | None:
    """Map a category endpoint role to a row value (current_id/resolved_id)."""
    role = entry.get(side)
    if role == "declarer":
        return row.get("current_id")
    if role == "target":
        return row.get("resolved_id")
    return None


class Derivation:
    """Result of deriving ownership mappings from committed evidence."""

    def __init__(self) -> None:
        self.mappings: dict[str, str] = {}
        self.findings: list[dict] = []
        self.stats: dict = {}
        self.claims: dict[str, list[str]] = {}
        self.duplicate_evidence_rows = 0


def _add_finding(derivation: Derivation, kind: str, record_id: str, detail: str) -> None:
    derivation.findings.append(
        {
            "kind": kind,
            "record_id": record_id,
            "detail": detail,
            "blocking": kind in BLOCKING_KINDS,
        }
    )


def derive(
    population: dict,
    categories: dict,
    rows: list[dict],
    canonical_ids: set[str],
    content_ids: dict[str, str],
) -> Derivation:
    """Derive exact_mappings from relationship rows with fail-closed checks.

    ``canonical_ids`` is the committed identity map (metadata/id-map.jsonl).
    ``content_ids`` maps canonical ids found in the content tree to their
    collection; a mapping endpoint that is canonical but absent from the
    content tree is a stale-record finding.
    """
    derivation = Derivation()

    poetry_collections = set(population["poetry_collections"])
    eligible_collections = set(population["eligible_collections"])

    by_field: dict[str, int] = {}
    by_status: dict[str, int] = {}
    seen_evidence: set[tuple[str, str]] = set()
    row_counts = {"declared": len(rows), "accepted": 0, "accepted_resolved": 0}

    for row in rows:
        field = row.get("legacy_field")
        if field is None:
            field = "(none)"
        by_field[field] = by_field.get(field, 0) + 1
        status = row.get("status")
        by_status[status] = by_status.get(status, 0) + 1

        # Unclassified relationship fields are reported, never silent: the
        # committed taxonomy is the only authority on what counts as evidence.
        if field not in categories.get("classification", {}):
            _add_finding(
                derivation,
                "unknown_relationship_category",
                str(row.get("legacy_source") or row.get("current_source") or "-"),
                "legacy field '{}' is not classified in "
                "metadata/content-audit-policy/categories.json; it is treated as "
                "irrelevant to poetry ownership".format(field),
            )

        entry = category_for(field, categories)
        if entry.get("bucket") != ACCEPTED:
            continue
        row_counts["accepted"] += 1

        if status != "resolved":
            # Accepted evidence that never resolved: report, never drop.
            _add_finding(
                derivation,
                "unresolved_accepted_evidence",
                str(row.get("current_source") or row.get("legacy_source") or "-"),
                "accepted relationship category '{}' has status '{}'; it cannot "
                "become a mapping".format(field, status),
            )
            continue
        if not row.get("current_id") or not row.get("resolved_id"):
            # A resolved row without both canonical endpoints is broken input.
            _add_finding(
                derivation,
                "missing_policy_endpoint",
                str(row.get("current_source") or row.get("legacy_source") or "-"),
                "accepted relationship '{}' resolved without canonical "
                "current_id/resolved_id".format(field),
            )
            continue
        row_counts["accepted_resolved"] += 1

        poetry_id = endpoint_side(entry, "poetry_endpoint", row)
        source_id = endpoint_side(entry, "source_endpoint", row)

        # Endpoint role sanity: the accepted category must name a poetry side
        # and a source side.
        if poetry_id is None or source_id is None:
            _add_finding(
                derivation,
                "missing_policy_endpoint",
                str(row.get("current_id") or row.get("resolved_id") or "-"),
                "accepted relationship '{}' lacks a {}-side endpoint"
                .format(field, "poetry" if poetry_id is None else "source"),
            )
            continue
        if poetry_id == source_id:
            _add_finding(
                derivation,
                "self_reference",
                poetry_id,
                "accepted relationship '{}' maps a record to itself".format(field),
            )
            continue

        # Canonicality: both endpoints must be canonical ids. A noncanonical
        # endpoint is a blocking finding and can never produce a mapping.
        bad_canonical = False
        for side, entity_id in (("poetry", poetry_id), ("source", source_id)):
            if entity_id not in canonical_ids:
                bad_canonical = True
                _add_finding(
                    derivation,
                    "noncanonical_endpoint",
                    entity_id,
                    "{} endpoint '{}' is not a canonical id in "
                    "metadata/id-map.jsonl".format(side, entity_id),
                )
        if bad_canonical:
            continue

        # Endpoint roles: the poetry side must be a poetry record and the
        # source side must be an eligible source record.
        poetry_collection = collection_of(poetry_id)
        source_collection = collection_of(source_id)
        if poetry_collection not in poetry_collections:
            _add_finding(
                derivation,
                "impossible_endpoint_role",
                poetry_id,
                "accepted relationship '{}' poetry endpoint '{}' is in "
                "collection '{}', which is not a poetry collection"
                .format(field, poetry_id, poetry_collection),
            )
            continue
        if source_collection not in eligible_collections:
            _add_finding(
                derivation,
                "ineligible_source_endpoint",
                source_id,
                "accepted relationship '{}' source endpoint '{}' is in "
                "collection '{}', which is not an eligible source collection"
                .format(field, source_id, source_collection),
            )
            continue

        # Content cross-check: endpoints must exist in the content tree too.
        # A canonical-but-missing record is a blocking finding and can never
        # produce a mapping (the audit would reject a stale key/target).
        bad_content = False
        for side, entity_id in (("poetry", poetry_id), ("source", source_id)):
            if entity_id not in content_ids:
                bad_content = True
                _add_finding(
                    derivation,
                    "missing_content_record",
                    entity_id,
                    "{} endpoint '{}' is canonical but has no record in the "
                    "content tree".format(side, entity_id),
                )
        if bad_content:
            continue

        # Duplicate identical evidence deduplicates safely.
        evidence = (poetry_id, source_id)
        if evidence in seen_evidence:
            derivation.duplicate_evidence_rows += 1
            continue
        seen_evidence.add(evidence)
        derivation.claims.setdefault(poetry_id, []).append(source_id)

    # Exactly one owner per poetry id; otherwise a finding and no mapping.
    for poetry_id in sorted(derivation.claims):
        owners = sorted(set(derivation.claims[poetry_id]))
        if len(owners) > 1:
            _add_finding(
                derivation,
                "ambiguous_ownership",
                poetry_id,
                "poetry record is claimed by multiple owners: {}".format(
                    ", ".join(owners)
                ),
            )
            continue
        derivation.mappings[poetry_id] = owners[0]

    # Deterministic stats (no timestamps, no host paths, no git values).
    by_kind: dict[str, int] = {}
    for finding in derivation.findings:
        by_kind[finding["kind"]] = by_kind.get(finding["kind"], 0) + 1
    by_owner: dict[str, int] = {}
    by_poetry_type: dict[str, int] = {}
    for poetry_id, owner in derivation.mappings.items():
        by_owner[collection_of(owner)] = by_owner.get(collection_of(owner), 0) + 1
        poetry_type = population["poetry_collections"].get(
            collection_of(poetry_id), "?"
        )
        by_poetry_type[poetry_type] = by_poetry_type.get(poetry_type, 0) + 1

    claimed = set(derivation.claims)
    # Poetry population from the content tree: every record whose directory is
    # a poetry collection, including the collection landing pages (the audit
    # counts them the same way).
    poetry_records_total = sum(
        1
        for entity_id, collection in content_ids.items()
        if collection in poetry_collections
    )
    ambiguous_count = len(
        [p for p in claimed if len(set(derivation.claims[p])) > 1]
    )
    derivation.stats = {
        "rows": {
            "declared": row_counts["declared"],
            "by_field": dict(sorted(by_field.items())),
            "by_status": dict(sorted(by_status.items())),
            "accepted": row_counts["accepted"],
            "accepted_resolved": row_counts["accepted_resolved"],
            "duplicate_evidence_removed": derivation.duplicate_evidence_rows,
        },
        "poetry": {
            "records_total": poetry_records_total,
            "records_with_accepted_claims": len(claimed),
            "records_single_owner": len(derivation.mappings),
            "records_ambiguous": ambiguous_count,
            "records_unmapped": poetry_records_total - len(claimed),
        },
        "mappings": {
            "total": len(derivation.mappings),
            "by_owner_collection": dict(sorted(by_owner.items())),
            "by_poetry_type": dict(sorted(by_poetry_type.items())),
        },
        "findings": {
            "total": len(derivation.findings),
            "blocking": sum(1 for f in derivation.findings if f["blocking"]),
            "reported": sum(1 for f in derivation.findings if not f["blocking"]),
            "by_kind": dict(sorted(by_kind.items())),
        },
    }
    return derivation


def build_policy_object(population: dict, mappings: dict) -> dict:
    """Assemble the Boris policy document from the population template."""
    policy = {}
    for field in PASSTHROUGH_FIELDS:
        policy[field] = population[field]
    policy["exact_mappings"] = dict(sorted(mappings.items()))
    return policy


def build_summary_object(
    population: dict,
    policy_bytes: bytes,
    derivation: Derivation,
) -> dict:
    return {
        "artifact": "content-audit-policy-derivation",
        "policy_digest_sha256": sha256_hex(policy_bytes),
        "policy_schema_version": population["schema_version"],
        "population": {
            "poetry_collections": dict(sorted(population["poetry_collections"].items())),
            "eligible_collections": {
                k: list(v) for k, v in sorted(population["eligible_collections"].items())
            },
        },
        "rows": derivation.stats["rows"],
        "poetry": derivation.stats["poetry"],
        "mappings": derivation.stats["mappings"],
        "findings": sorted(
            derivation.findings,
            key=lambda f: (f["kind"], f["record_id"], f["detail"]),
        ),
    }


def check_bytes(committed: Path, fresh: bytes) -> bool:
    if not committed.is_file():
        return False
    return committed.read_bytes() == fresh


def run_generation(args) -> tuple[bytes, bytes, Derivation, bool]:
    """Generate policy + summary bytes from committed inputs.

    Returns (policy_bytes, summary_bytes, derivation, findings_present).
    """
    rows = load_jsonl(args.map)
    id_map_rows = load_jsonl(args.id_map)
    canonical_ids = {row.get("id") for row in id_map_rows if row.get("id")}
    population = load_json(args.population)
    categories = load_json(args.categories)
    content_ids = content_record_ids(args.content)

    derivation = derive(
        population,
        categories,
        rows,
        canonical_ids,
        content_ids,
    )
    policy = build_policy_object(population, derivation.mappings)
    policy_bytes = render(policy)
    summary = build_summary_object(population, policy_bytes, derivation)
    summary_bytes = render(summary)
    findings_blocking = any(f["blocking"] for f in derivation.findings)
    return policy_bytes, summary_bytes, derivation, findings_blocking


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--map", type=Path, default=DEFAULT_MAP)
    parser.add_argument("--id-map", type=Path, default=DEFAULT_ID_MAP)
    parser.add_argument("--population", type=Path, default=DEFAULT_POPULATION)
    parser.add_argument("--categories", type=Path, default=DEFAULT_CATEGORIES)
    parser.add_argument("--content", type=Path, default=DEFAULT_CONTENT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--summary", type=Path, default=DEFAULT_SUMMARY)
    parser.add_argument(
        "--check",
        action="store_true",
        help="verify committed policy.json and summary.json equal a fresh "
        "deterministic generation (exit 1 on drift)",
    )
    parser.add_argument("--quiet", action="store_true")
    args = parser.parse_args(argv)

    try:
        policy_bytes, summary_bytes, derivation, findings_blocking = run_generation(args)
    except (FileNotFoundError, json.JSONDecodeError, KeyError) as error:
        print("build_content_audit_policy: error: {}".format(error), file=sys.stderr)
        return 2

    if args.check:
        policy_ok = check_bytes(args.output, policy_bytes)
        summary_ok = check_bytes(args.summary, summary_bytes)
        if policy_ok and summary_ok:
            print(
                "content audit policy: check OK — committed policy.json and "
                "summary.json match fresh deterministic generation"
            )
            return 0
        print(
            "content audit policy: DRIFT — committed output differs from fresh "
            "generation (policy.json {} / summary.json {})".format(
                "match" if policy_ok else "DIFFERS",
                "match" if summary_ok else "DIFFERS",
            ),
            file=sys.stderr,
        )
        return 1

    # Fresh generation: commit the deterministic outputs (never mutate inputs).
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(policy_bytes)
    args.summary.parent.mkdir(parents=True, exist_ok=True)
    args.summary.write_bytes(summary_bytes)

    if not args.quiet:
        print(
            "content audit policy: generated {} exact mapping(s) "
            "({} poetry record(s) claimed, {} ambiguous, "
            "{} finding(s) / {} blocking)".format(
                len(derivation.mappings),
                derivation.stats["poetry"]["records_with_accepted_claims"],
                derivation.stats["poetry"]["records_ambiguous"],
                len(derivation.findings),
                derivation.stats["findings"]["blocking"],
            )
        )
        print("  policy:  {}".format(args.output))
        print("  summary: {}".format(args.summary))
    return 1 if findings_blocking else 0


if __name__ == "__main__":
    raise SystemExit(main())
