#!/usr/bin/env python3
"""test_relationship_repair.py — Regression tests for the relationship export.

Covers the two merge-blocking defects found in review of the relationship
export repair (PR fix/relationship-export):

1. **Repair idempotency** — ``repair_rag_page`` must be byte-stable on
   re-runs.  Before the fix, run 1 moved ``parts/...`` out of ``related`` into
   ``bundle_parts``, but run 2 saw ``related`` without container paths and
   *cleared* the ``bundle_parts`` the previous run had just preserved.  Bundle
   membership is now the ordered, deduplicated union of existing
   ``bundle_parts`` and part paths currently found in ``related``, and is
   never cleared.

2. **Source-to-export parity** — ``validate_relationships.audit`` must fail
   when a source-supported relationship is absent from an exported field
   (even an empty one), and must flag unexpected edges, RAG/context
   disagreement, and bundle-part paths left inside ``related``.

Usage:
    python3 scripts/test_relationship_repair.py
"""

import json
import os
import sys
import tempfile
from contextlib import contextmanager
from pathlib import Path

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from repair_relationships import (  # noqa: E402
    build_index,
    load_relationship_manifest,
    repair_rag_page,
    semantic_relationships,
)
from validate_relationships import audit  # noqa: E402
from recover_relationships import (  # noqa: E402
    Entry,
    build_rows,
    derive_collection_id,
    derive_legacy_id,
    generate,
    write_manifest,
)

FAILURES = []


def check(condition, message):
    if condition:
        print(f"  ok  {message}")
    else:
        FAILURES.append(message)


# ---------------------------------------------------------------------------
# 1. Repair idempotency
# ---------------------------------------------------------------------------

PAGE_TEMPLATE = (
    "---\n"
    "rag_id: content/collections/AAA-0001\n"
    "rag_path: content/pages/collections/AAA-0001.md\n"
    "entity_id: collections/AAA-0001\n"
    "role: satellite\n"
    "parent_entry: collections\n"
    "related:\n"
    "  - {related_items}\n"
    "---\n\n"
    "Body of the record.\n"
)


def test_repair_first_run_moves_parts_to_bundle():
    """run 1: parts/foo in related is moved to bundle_parts."""
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "AAA-0001.md"
        page.write_text(
            PAGE_TEMPLATE.format(related_items="parts/foo\n  - collections/AAA-0002"),
            encoding="utf-8",
        )
        changed, _ = repair_rag_page(page, ["collections/AAA-0002"], Path(tmp))
        text = page.read_text(encoding="utf-8")
        check(changed, "run 1 reports the page changed")
        check("bundle_parts:" in text and "  - parts/foo" in text,
              "run 1 preserves parts/foo under bundle_parts")
        # parts/foo must no longer be a related entry.
        in_related = False
        seen_related = False
        for line in text.splitlines():
            if line.startswith("related:"):
                seen_related = True
                continue
            if seen_related and line.startswith("  - "):
                if "parts/foo" in line:
                    in_related = True
            elif seen_related and line.startswith("bundle_parts:"):
                break
        check(not in_related, "run 1 removes parts/foo from related")


def test_repair_second_run_changes_zero_bytes():
    """run 2 on the resulting file: zero bytes change, bundle_parts intact."""
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "AAA-0001.md"
        page.write_text(
            PAGE_TEMPLATE.format(related_items="parts/foo\n  - collections/AAA-0002"),
            encoding="utf-8",
        )
        repair_rag_page(page, ["collections/AAA-0002"], Path(tmp))
        after_first = page.read_bytes()

        changed, _ = repair_rag_page(page, ["collections/AAA-0002"], Path(tmp))
        after_second = page.read_bytes()

        check(not changed, "run 2 reports no change")
        check(after_second == after_first, "run 2 changes zero bytes")
        check(b"bundle_parts:" in after_second and b"  - parts/foo" in after_second,
              "run 2 keeps parts/foo in bundle_parts")


def test_bundle_parts_survives_when_related_already_clean():
    """The exact bug: related without parts must not erase existing bundle_parts."""
    with tempfile.TemporaryDirectory() as tmp:
        page = Path(tmp) / "AAA-0001.md"
        # State as produced by a correct first run: semantic related only,
        # bundle membership already preserved separately.
        page.write_text(
            "---\n"
            "entity_id: collections/AAA-0001\n"
            "related:\n"
            "  - collections/AAA-0002\n"
            "bundle_parts:\n"
            "  - parts/foo\n"
            "---\n\nBody.\n",
            encoding="utf-8",
        )
        before = page.read_bytes()
        changed, _ = repair_rag_page(page, ["collections/AAA-0002"], Path(tmp))
        after = page.read_bytes()
        check(not changed, "re-running on a clean page reports no change")
        check(after == before, "clean page is byte-stable")
        check(b"parts/foo" in after, "existing bundle membership is never cleared")


# ---------------------------------------------------------------------------
# 2. Source-to-export parity
# ---------------------------------------------------------------------------

CONTENT_FILES = {
    "collections/AAA-0001.md": (
        "---\n"
        "id: collections/AAA-0001\n"
        "title: \"Alpha One\"\n"
        "parent: collections\n"
        "---\n\n"
        "See [the second record](AAA-0002.md).\n"
    ),
    "collections/AAA-0002.md": (
        "---\n"
        "id: collections/AAA-0002\n"
        "title: \"Alpha Two\"\n"
        "parent: collections\n"
        "---\n\n"
        "No links.\n"
    ),
}

RAG_TEMPLATE = (
    "---\n"
    "entity_id: {entity_id}\n"
    "related:\n"
    "{related}\n"
    "---\n\nBody.\n"
)

CONTEXT_TEMPLATE = (
    "---\n"
    "entity_id: \"{entity_id}\"\n"
    "relations:\n"
    "{relations}\n"
    "---\n\nBody.\n"
)


@contextmanager
def build_parity_fixture(rag_related, context_relations, rag_bundle_parts=""):
    """Context-manager fixture: content + rag + context trees.

    Yields (by_id, by_source, semantic_by_id, unresolved, rag_dir,
    context_dir).  audit() globs content/pages/** under the rag root and
    pages/** under the context root, matching the real publish/ layout.
    """
    with tempfile.TemporaryDirectory() as tmp:
        content_root = Path(tmp) / "content"
        for rel, text in CONTENT_FILES.items():
            path = content_root / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8")

        rag_dir = Path(tmp) / "rag" / "content" / "pages" / "collections"
        rag_dir.mkdir(parents=True, exist_ok=True)
        rag_dir.joinpath("AAA-0001.md").write_text(
            RAG_TEMPLATE.format(
                entity_id="collections/AAA-0001",
                related=rag_related,
            ),
            encoding="utf-8",
        )
        if rag_bundle_parts:
            text = rag_dir.joinpath("AAA-0001.md").read_text(encoding="utf-8")
            text = text.replace(
                "---\n\nBody.\n",
                f"bundle_parts:\n{rag_bundle_parts}---\n\nBody.\n",
            )
            rag_dir.joinpath("AAA-0001.md").write_text(text, encoding="utf-8")
        rag_dir.joinpath("AAA-0002.md").write_text(
            RAG_TEMPLATE.format(entity_id="collections/AAA-0002", related=""),
            encoding="utf-8",
        )

        context_dir = Path(tmp) / "context" / "pages" / "collections"
        context_dir.mkdir(parents=True, exist_ok=True)
        context_dir.joinpath("AAA-0001.md").write_text(
            CONTEXT_TEMPLATE.format(
                entity_id="collections/AAA-0001",
                relations=context_relations,
            ),
            encoding="utf-8",
        )
        context_dir.joinpath("AAA-0002.md").write_text(
            CONTEXT_TEMPLATE.format(entity_id="collections/AAA-0002", relations=""),
            encoding="utf-8",
        )

        by_id, by_source, _warnings = build_index(content_root)
        semantic_by_id, unresolved = semantic_relationships(by_id, by_source, content_root)
        yield (by_id, by_source, semantic_by_id, unresolved,
               Path(tmp) / "rag", Path(tmp) / "context")


def test_parity_missing_relationship_fails_even_with_empty_field():
    """A source-supported edge absent from an empty RAG field is a finding."""
    with build_parity_fixture(
            rag_related="",
            context_relations="  - relates_to=collections/AAA-0002",
    ) as (by_id, by_source, semantic, unresolved, rag_dir, context_dir):
        findings, _ = audit(by_id, by_source, semantic, unresolved, rag_dir, context_dir)
    missing_rag = {row[2] for row in findings["missing_rag"]}
    check(missing_rag == {"collections/AAA-0002"},
          "parity reports the edge missing from the empty RAG export")
    check(not findings["missing_context"],
          "parity is silent when the context export carries the edge")
    check(not findings["unexpected_rag"] and not findings["unexpected_context"],
          "no unexpected edges in this fixture")


def test_parity_clean_export_passes():
    """RAG and context both carrying the edge yields a clean audit."""
    with build_parity_fixture(
            rag_related="  - collections/AAA-0002",
            context_relations="  - relates_to=collections/AAA-0002",
    ) as (by_id, by_source, semantic, unresolved, rag_dir, context_dir):
        findings, _ = audit(by_id, by_source, semantic, unresolved, rag_dir, context_dir)
    total = sum(len(rows) for rows in findings.values())
    check(total == 0, "clean parity export reports zero findings")


def test_parity_unexpected_and_disagreement_detected():
    """Unexpected edges and RAG/context target-set disagreement are flagged."""
    with build_parity_fixture(
            rag_related="  - collections/AAA-0002\n  - collections/AAA-0002",
            context_relations="",
    ) as (by_id, by_source, semantic, unresolved, rag_dir, context_dir):
        findings, _ = audit(by_id, by_source, semantic, unresolved, rag_dir, context_dir)
    check(any(row[2] == "collections/AAA-0002" for row in findings["missing_context"]),
          "context export missing the source edge")
    check(bool(findings["rag_context_disagreement"]),
          "RAG/context disagreement reported")
    # Duplicate value inside one related field.
    check(any(row[2] == "collections/AAA-0002" for row in findings["duplicates"]),
          "duplicate exported value reported")


def test_parity_bundle_path_inside_related_is_loss():
    """A parts/... path inside related is reported as bundle membership loss."""
    with build_parity_fixture(
            rag_related="  - parts/foo",
            context_relations="  - relates_to=collections/AAA-0002",
    ) as (by_id, by_source, semantic, unresolved, rag_dir, context_dir):
        findings, _ = audit(by_id, by_source, semantic, unresolved, rag_dir, context_dir)
    check(any("parts/foo" in row[2] for row in findings["bundle_membership_loss"]),
          "container path inside related flagged as bundle membership loss")
    check(any(row[2] == "collections/AAA-0002" for row in findings["missing_rag"]),
          "edge still reported missing from RAG when related holds only the container path")


def test_parity_bundle_membership_preserved_counted():
    """bundle_parts entries are counted as preserved memberships."""
    with build_parity_fixture(
            rag_related="  - collections/AAA-0002",
            context_relations="  - relates_to=collections/AAA-0002",
            rag_bundle_parts="  - parts/foo\n  - parts/bar\n",
    ) as (by_id, by_source, semantic, unresolved, rag_dir, context_dir):
        _, counts = audit(by_id, by_source, semantic, unresolved, rag_dir, context_dir)
    check(counts["bundle_preserved"] == 2, "bundle memberships counted (2)")
    check(counts["canonical_exported"] == 1, "canonical relationships exported counted (1)")
    check(counts["canonical_records"] == 1, "relationship-bearing records counted (1)")
    check(counts["rag_exported"] == 1, "RAG relationships exported counted (1)")
    check(counts["context_exported"] == 1, "context relationships exported counted (1)")


# ---------------------------------------------------------------------------
# 3. Pre-migration relationship recovery (metadata/relationship-map.jsonl)
# ---------------------------------------------------------------------------


def _entry(source, data, legacy_id=None):
    """Build a legacy ground-truth Entry from a src/content-relative path."""
    collection, raw_id = derive_collection_id(source)
    return Entry(source, collection, raw_id, data,
                 legacy_id if legacy_id is not None else derive_legacy_id(source))


def _current(entity_id, source):
    return {"id": entity_id, "source": source}


def test_recovery_mascot_to_lorelog():
    """A mascot's legacy relatedEntries targeting a lorelog record recovers."""
    entries = [
        _entry("docs/mascots/005.bricky-goldbricksworth.mdx",
               {"slug": "mascots/bricky-goldbricksworth",
                "relatedEntries": [{"collection": "lorelog", "id": "LLG-0007-COMA"}]}),
        _entry("docs/lorelog/LLG-0007-COMA.mdx", {"slug": "lorelog/LLG-0007-COMA"}),
    ]
    by_legacy = {
        "mascots/005.bricky-goldbricksworth": _current("mascots/M-0005",
                                                        "mascots/005.bricky-goldbricksworth.md"),
        "lorelog/LLG-0007-COMA": _current("lorelog/LLG-0007-COMA",
                                           "lorelog/LLG-0007-COMA.md"),
    }
    rows, status_counts, _structural = build_rows(entries, by_legacy)
    check(len(rows) == 1 and status_counts["resolved"] == 1,
          "mascot -> lorelog yields one resolved manifest row")
    row = rows[0]
    check(row["resolved_id"] == "lorelog/LLG-0007-COMA" and row["current_id"] == "mascots/M-0005",
          "mascot -> lorelog resolves through the id-map to the current lorelog record")
    check(row["match_type"] == "exact", "collection-scoped declaration matches at the exact tier")


def test_recovery_mascot_to_reference():
    """Legacy 'docs' collection declaration with a bare reference id recovers."""
    entries = [
        _entry("docs/lorelog/LLG-0408-DTS-DEP.mdx",
               {"relatedEntries": [{"collection": "docs", "id": "fref-0840-rwrr"}]}),
        _entry("docs/reference/fref-0840-rwrr.mdx", {"slug": "reference/fref-0840-rwrr"}),
    ]
    by_legacy = {
        "lorelog/LLG-0408-DTS-DEP": _current("lorelog/LLG-0408-DTS-DEP",
                                              "lorelog/LLG-0408-DTS-DEP.md"),
        "reference/fref-0840-rwrr": _current("reference/FREF-0840-RWRR",
                                              "reference/fref-0840-rwrr.md"),
    }
    rows, status_counts, _ = build_rows(entries, by_legacy)
    check(status_counts["resolved"] == 1,
          "legacy docs->reference mapping resolves exactly (old docs mapping for reference)")
    check(rows[0]["resolved_id"] == "reference/FREF-0840-RWRR",
          "bare fref id under collection docs resolves to the reference record")


def test_recovery_legacy_docs_reference_mapping():
    """A slashed 'reference/forms/...' id under collection docs resolves."""
    entries = [
        _entry("docs/lorelog/LLG-0436-ASF.mdx",
               {"relatedEntries": [{"collection": "docs",
                                    "id": "reference/forms/fref-0020-maps"}]}),
        _entry("docs/reference/forms/fref-0020-maps.mdx",
               {"slug": "reference/forms/fref-0020-maps"}),
    ]
    by_legacy = {
        "lorelog/LLG-0436-ASF": _current("lorelog/LLG-0436-ASF",
                                          "lorelog/LLG-0436-ASF.md"),
        "reference/forms/fref-0020-maps": _current("reference/FREF-0020-MAPS",
                                                    "reference/forms/fref-0020-maps.md"),
    }
    rows, status_counts, _ = build_rows(entries, by_legacy)
    check(status_counts["resolved"] == 1
          and rows[0]["resolved_id"] == "reference/FREF-0020-MAPS",
          "slashed docs id resolves through the legacy docs/reference mapping")


def test_recovery_missing_target():
    """A legacy declaration with no current counterpart is reported, not dropped."""
    entries = [
        _entry("docs/mascots/005.bricky-goldbricksworth.mdx",
               {"relatedEntries": [{"collection": "lorelog", "id": "LLG-9999-NOPE"}]}),
    ]
    by_legacy = {
        "mascots/005.bricky-goldbricksworth": _current("mascots/M-0005",
                                                        "mascots/005.bricky-goldbricksworth.md"),
    }
    rows, status_counts, _ = build_rows(entries, by_legacy)
    check(status_counts["missing"] == 1 and rows[0]["status"] == "missing",
          "missing target is reported with status 'missing'")
    check(rows[0]["resolved_id"] is None, "missing rows carry no resolved id")


def test_recovery_ambiguous_target():
    """A bare stem matching multiple legacy entries is reported ambiguous."""
    # The real-world ambiguity: the aphorism/haiku/limerick/lorelog quartet for
    # one LLG case shares the same caseNumber, so the global caseNumber tier
    # matches multiple entries (mirrors archive-identity.resolveExactAlias).
    entries = [
        _entry("docs/lorelog/LLG-0217-CNTR.mdx",
               {"slug": "lorelog/LLG-0217-CNTR", "caseNumber": "LLG-0217-CNTR"}),
        _entry("docs/limericks/LIM-LLG-0217-CNTR.mdx",
               {"slug": "limericks/LIM-LLG-0217-CNTR", "caseNumber": "LLG-0217-CNTR"}),
        _entry("docs/reference/fref-0200-cbac.mdx",
               {"relatedEntries": ["LLG-0217-CNTR"]}),
    ]
    by_legacy = {
        "lorelog/LLG-0217-CNTR": _current("lorelog/LLG-0217-CNTR",
                                           "lorelog/LLG-0217-CNTR.md"),
        "limericks/LIM-LLG-0217-CNTR": _current("limericks/LIM-LLG-0217-CNTR",
                                                 "limericks/LIM-LLG-0217-CNTR.md"),
        "reference/fref-0200-cbac": _current("reference/FREF-0200-CBAC",
                                              "reference/fref-0200-cbac.md"),
    }
    rows, status_counts, _ = build_rows(entries, by_legacy)
    check(status_counts["ambiguous"] == 1 and rows[0]["status"] == "ambiguous",
          "bare stem matching the shared-caseNumber quartet is reported ambiguous")


def test_recovery_duplicate_declaration():
    """Two declarations of the same target export as a single canonical edge."""
    entries = [
        _entry("docs/mascots/005.bricky-goldbricksworth.mdx",
               {"relatedEntries": [
                   {"collection": "lorelog", "id": "LLG-0007-COMA"},
                   {"collection": "lorelog", "id": "LLG-0007-COMA"},
               ]}),
        _entry("docs/lorelog/LLG-0007-COMA.mdx", {"slug": "lorelog/LLG-0007-COMA"}),
    ]
    by_legacy = {
        "mascots/005.bricky-goldbricksworth": _current("mascots/M-0005",
                                                        "mascots/005.bricky-goldbricksworth.md"),
        "lorelog/LLG-0007-COMA": _current("lorelog/LLG-0007-COMA",
                                           "lorelog/LLG-0007-COMA.md"),
    }
    rows, status_counts, _ = build_rows(entries, by_legacy)
    check(status_counts["resolved"] == 2,
          "both duplicate declarations are recorded in the manifest")
    recovered = {
        eid: [r["resolved_id"] for r in rows
              if r["status"] == "resolved" and r["current_id"] == eid]
        for eid in {"mascots/M-0005"}
    }
    check(len(recovered["mascots/M-0005"]) == 2,
          "recovered list preserves both declarations (first-seen order)")
    content_files = {
        "mascots/005.bricky-goldbricksworth.md": (
            "---\nid: mascots/M-0005\ntitle: \"Bricky\"\nparent: mascots\n---\n\nBody.\n"),
        "lorelog/LLG-0007-COMA.md": (
            "---\nid: lorelog/LLG-0007-COMA\ntitle: \"Coma\"\nparent: lorelog\n---\n\nBody.\n"),
    }
    with tempfile.TemporaryDirectory() as tmp:
        content_root = Path(tmp) / "content"
        for rel, text in content_files.items():
            path = content_root / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8")
        by_id, by_source, _warnings = build_index(content_root)
        semantic, _unresolved = semantic_relationships(
            by_id, by_source, content_root, recovered=recovered)
    check(semantic.get("mascots/M-0005") == ["lorelog/LLG-0007-COMA"],
          "duplicate recovered declarations export as a single deduplicated edge")


def test_recovery_self_link():
    """A legacy declaration pointing at its own record is reported self, excluded."""
    entries = [
        _entry("docs/mascots/005.bricky-goldbricksworth.mdx",
               {"relatedEntries": [{"collection": "mascots",
                                    "id": "005.bricky-goldbricksworth"}]}),
    ]
    by_legacy = {
        "mascots/005.bricky-goldbricksworth": _current("mascots/M-0005",
                                                        "mascots/005.bricky-goldbricksworth.md"),
    }
    rows, status_counts, _ = build_rows(entries, by_legacy)
    check(status_counts["self"] == 1 and rows[0]["status"] == "self",
          "self-link is reported with status 'self'")
    check(rows[0]["resolved_id"] == "mascots/M-0005", "self row records the resolved self id")


def test_recovery_repeated_run_byte_stability():
    """Regenerating the manifest from the same ground truth changes zero bytes."""
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        gt_root = tmp_path / "gt"
        src = gt_root / "src" / "content" / "docs" / "mascots"
        src.mkdir(parents=True)
        (src / "005.bricky-goldbricksworth.mdx").write_text(
            "---\nslug: mascots/bricky-goldbricksworth\n"
            "relatedEntries:\n  - collection: lorelog\n    id: LLG-0007-COMA\n---\n\nBody.\n",
            encoding="utf-8")
        lore_dir = gt_root / "src" / "content" / "docs" / "lorelog"
        lore_dir.mkdir(parents=True)
        (lore_dir / "LLG-0007-COMA.mdx").write_text(
            "---\nslug: lorelog/LLG-0007-COMA\n---\n\nBody.\n", encoding="utf-8")
        id_map = tmp_path / "id-map.jsonl"
        id_map.write_text(
            '{"role": "satellite", "id": "mascots/M-0005", '
            '"source": "mascots/005.bricky-goldbricksworth.md", '
            '"legacy_id": "mascots/005.bricky-goldbricksworth"}\n'
            '{"role": "satellite", "id": "lorelog/LLG-0007-COMA", '
            '"source": "lorelog/LLG-0007-COMA.md", '
            '"legacy_id": "lorelog/LLG-0007-COMA"}\n',
            encoding="utf-8")
        first_rows, first_summary = generate(gt_root, id_map)
        write_manifest(first_rows, first_summary, tmp_path / "map-a.jsonl",
                       tmp_path / "summary-a.json")
        second_rows, second_summary = generate(gt_root, id_map)
        write_manifest(second_rows, second_summary, tmp_path / "map-b.jsonl",
                       tmp_path / "summary-b.json")
        check((tmp_path / "map-a.jsonl").read_bytes() == (tmp_path / "map-b.jsonl").read_bytes(),
              "repeated manifest generation is byte-stable (map)")
        check((tmp_path / "summary-a.json").read_bytes() == (tmp_path / "summary-b.json").read_bytes(),
              "repeated manifest generation is byte-stable (summary)")


def test_recovery_manifest_loader():
    """load_relationship_manifest returns ordered resolved targets, skips the rest."""
    with tempfile.TemporaryDirectory() as tmp:
        manifest = Path(tmp) / "relationship-map.jsonl"
        manifest.write_text(
            json.dumps({"status": "resolved", "current_id": "mascots/M-0005",
                        "resolved_id": "lorelog/LLG-0007-COMA",
                        "provenance": "6abe4416"}) + "\n"
            + json.dumps({"status": "resolved", "current_id": "mascots/M-0005",
                          "resolved_id": "lorelog/LLG-0019-COMA",
                          "provenance": "6abe4416"}) + "\n"
            + json.dumps({"status": "missing", "current_id": "mascots/M-0005",
                          "resolved_id": None, "provenance": "6abe4416"}) + "\n",
            encoding="utf-8")
        recovered = load_relationship_manifest(manifest)
    check(recovered == {"mascots/M-0005": ["lorelog/LLG-0007-COMA", "lorelog/LLG-0019-COMA"]},
          "manifest loader returns ordered resolved targets only")


def main():
    print("repair idempotency:")
    test_repair_first_run_moves_parts_to_bundle()
    test_repair_second_run_changes_zero_bytes()
    test_bundle_parts_survives_when_related_already_clean()
    print()
    print("source-to-export parity:")
    test_parity_missing_relationship_fails_even_with_empty_field()
    test_parity_clean_export_passes()
    test_parity_unexpected_and_disagreement_detected()
    test_parity_bundle_path_inside_related_is_loss()
    test_parity_bundle_membership_preserved_counted()
    print()
    print("pre-migration relationship recovery:")
    test_recovery_mascot_to_lorelog()
    test_recovery_mascot_to_reference()
    test_recovery_legacy_docs_reference_mapping()
    test_recovery_missing_target()
    test_recovery_ambiguous_target()
    test_recovery_duplicate_declaration()
    test_recovery_self_link()
    test_recovery_repeated_run_byte_stability()
    test_recovery_manifest_loader()
    print()
    if FAILURES:
        print("FAILED:")
        for failure in FAILURES:
            print(f"  - {failure}")
        sys.exit(1)
    print("PASS — repair idempotent, export parity enforced, pre-migration recovery verified.")


if __name__ == "__main__":
    main()
