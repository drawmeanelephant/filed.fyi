#!/usr/bin/env python3
"""test_verse_stage.py — Regression tests for the pre-render verse staging.

scripts/verse_stage.py rewrites a **staged copy** of the Markdown content so
that Boris itself renders the single labelled \"Related residue\" panel —
before publication evidence is created. This test drives the transform over
Markdown fixtures and asserts the desired staged presentation:

  * the core record stays first and primary (verse only at the tail),
  * verse lives in one labelled \"Related residue\" panel,
  * the three \"Related X\" labels become raw <h3> (no ids),
  * inner headings re-level to <h4>+ with all original {#id} anchors kept,
  * long collections collapse behind a native <details>,
  * guide pages always collapse,
  * empty or \"Stub\" verse sections are dropped,
  * no flat \"## Related X\" verse heading remains,
  * pages without verse are left byte-for-byte identical.

Usage:
    python3 scripts/test_verse_stage.py
"""

import os
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from verse_stage import (  # noqa: E402
    is_guide_path,
    process_directory,
    transform_file,
    transform_markdown,
)

TESTDATA = os.path.join(ROOT, "scripts", "testdata", "verse-stage")
FAILURES = []


def fixture(name):
    with open(os.path.join(TESTDATA, name), encoding="utf-8") as handle:
        return handle.read()


def check(label, condition):
    if condition:
        print(f"  ok  {label}")
    else:
        FAILURES.append(label)
        print(f"  !!  {label}")


def test_no_verse():
    print("== no verse ==")
    original = fixture("no-verse.md")
    transformed, stats = transform_markdown(original)
    check("page left byte-identical", transformed == original)
    check("no residue section added", "verse-residue" not in transformed)
    check("stats report no change", stats["changed"] is False)


def test_one_short_verse():
    print("== one short verse ==")
    transformed, stats = transform_markdown(fixture("one-short-verse.md"))
    check("residue section staged", '<section class="verse-residue"' in transformed)
    check("labelled Related residue heading",
          '<h2 id="verse-residue">Related residue</h2>' in transformed)
    check("verse label is an id-free labelled p",
          '<p class="verse-residue__label">Related Aphorisms</p>'
          in transformed)
    check("poem title re-leveled to h4 with id kept",
          "#### Short Aphorism Title {#short-aphorism-title}" in transformed)
    check("no flat verse h2 remains",
          "## Related Aphorisms" not in transformed)
    check("short collection stays open", "<details" not in transformed)
    check("core heading still present", "# One Short Verse" in transformed)
    check("poem body intact", "First aphorism line." in transformed)
    check("stats count the section", stats["verse_sections"] == 1
          and stats["poems"] == 2 and stats["changed"] is True)


def test_all_three_types():
    print("== all three verse types ==")
    transformed, stats = transform_markdown(fixture("all-three-types.md"))
    check("three id-free labelled p labels",
          transformed.count('<p class="verse-residue__label">Related ') == 3)
    check("stray Haikus h2 re-leveled to h4",
          "#### Haikus {#haikus}" in transformed)
    check("poem titles all h4",
          transformed.count("#### Triad ") == 3)
    check("stayed open (3 poems)", "<details" not in transformed)
    check("no flat verse h2 remains",
          not any(f"## {head}" in transformed
                  for head in ("Related Aphorisms", "Related Haikus",
                               "Related Limericks")))
    check("stray anchor preserved", "{#haikus}" in transformed)
    check("stats count 3 poems", stats["poems"] == 3)


def test_large_collection():
    print("== large verse collection ==")
    transformed, stats = transform_markdown(fixture("large-collection.md"))
    check("stats report collapse", stats["collapsed"] is True)
    check("collapsed behind details",
          '<details class="verse-residue__body">' in transformed)
    check("summary carries poem count",
          "<summary>Show 10 related poems</summary>" in transformed)
    check("all poems still present",
          transformed.count("Haiku number") == 6
          and transformed.count("Limerick number") == 4)
    check("poem anchors preserved",
          "{#large-haiku-group}" in transformed
          and "{#large-limerick-group}" in transformed)
    check("outline clean",
          transformed.count('<p class="verse-residue__label">Related ') == 2
          and transformed.count("#### ") == 3)


def test_stub_empty():
    print("== stub verse heading with no usable content ==")
    transformed, stats = transform_markdown(fixture("stub-empty.md"))
    check("stub section not staged", "Related Haikus" not in transformed)
    check("stub heading not staged", "stub-no-content" not in transformed)
    check("no residue section when nothing remains",
          "verse-residue" not in transformed)
    check("stats report the drop", stats["dropped_sections"] == 1)
    check("core record intact", "# Stub Verse Section" in transformed)


def test_guide_always_collapsed():
    print("== guide page ==")
    transformed, stats = transform_markdown(fixture("guide.md"),
                                            collapse_all=True)
    check("guide path detected relative to root",
          is_guide_path(Path("staged/guides/GUIDE-0001.md"), Path("staged"))
          and not is_guide_path(Path("staged/reference/fref-x.md"),
                                Path("staged"))
          and not is_guide_path(Path("staged"), Path("staged")))
    check("short guide verse still collapsed",
          '<details class="verse-residue__body">' in transformed)
    check("summary present", "Show 1 related poems" in transformed)
    check("guide content stays primary", "## Steps" in transformed)
    check("stayed within a single labelled panel",
          transformed.count('id="verse-residue"') == 1)


def test_process_directory_collapses_guides():
    print("== directory processor collapses guides ==")
    tmpdir = Path(tempfile.mkdtemp(prefix="verse-stage-guide-test-"))
    try:
        guide_dir = tmpdir / "guides"
        guide_dir.mkdir(parents=True)
        (tmpdir / "reference").mkdir(parents=True)

        target = guide_dir / "GUIDE-0001.md"
        target.write_text(fixture("guide.md"), encoding="utf-8")
        plain = tmpdir / "reference" / "fref-x.md"
        plain.write_text(fixture("one-short-verse.md"), encoding="utf-8")

        summary = process_directory(tmpdir)
        staged = target.read_text(encoding="utf-8")
        plain_staged = plain.read_text(encoding="utf-8")

        check("both verse pages rewritten", summary["changed"] == 2)
        check(
            "guide collapsed through directory processor",
            '<details class="verse-residue__body">' in staged,
        )
        check(
            "non-guide left open",
            "<details" not in plain_staged,
        )
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def test_transform_file_writes_in_place():
    print("== transform_file writes in place ==")
    tmpdir = tempfile.mkdtemp(prefix="verse-stage-test-")
    try:
        work = os.path.join(tmpdir, "reference")
        os.makedirs(work)
        target = os.path.join(work, "fref-sample.md")
        with open(target, "w", encoding="utf-8") as handle:
            handle.write(fixture("one-short-verse.md"))
        stats = transform_file(target)
        check("rewritten on disk", "verse-residue" in open(target).read())
        check("stats changed", stats["changed"] is True)
        untouched = os.path.join(work, "no-verse.md")
        with open(untouched, "w", encoding="utf-8") as handle:
            handle.write(fixture("no-verse.md"))
        stats = transform_file(untouched)
        check("no-verse page not rewritten", stats["changed"] is False)
        check("no-verse page bytes preserved",
              open(untouched).read() == fixture("no-verse.md"))
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def main():
    tests = [
        test_no_verse,
        test_one_short_verse,
        test_all_three_types,
        test_large_collection,
        test_stub_empty,
        test_guide_always_collapsed,
        test_process_directory_collapses_guides,
    ]
    for test in tests:
        test()
        print()

    test_transform_file_writes_in_place()
    print()

    if FAILURES:
        print("FAILED:")
        for failure in FAILURES:
            print(f"  - {failure}")
        sys.exit(1)
    print("PASS — verse staging transform behaves as specified and leaves "
          "no-verse pages untouched.")


if __name__ == "__main__":
    main()
