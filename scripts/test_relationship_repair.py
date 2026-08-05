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

import os
import sys
import tempfile
from contextlib import contextmanager
from pathlib import Path

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from repair_relationships import (  # noqa: E402
    build_index,
    repair_rag_page,
    semantic_relationships,
)
from validate_relationships import audit  # noqa: E402

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
    check(counts["source_supported"] == 1, "source-supported relationships counted (1)")
    check(counts["source_records"] == 1, "relationship-bearing records counted (1)")
    check(counts["rag_exported"] == 1, "RAG relationships exported counted (1)")
    check(counts["context_exported"] == 1, "context relationships exported counted (1)")


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
    if FAILURES:
        print("FAILED:")
        for failure in FAILURES:
            print(f"  - {failure}")
        sys.exit(1)
    print("PASS — repair is idempotent and export parity is enforced.")


if __name__ == "__main__":
    main()
