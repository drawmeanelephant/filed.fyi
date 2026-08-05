#!/usr/bin/env python3
"""test_verse_residue.py — Regression tests for the verse-residue transform.

scripts/verse_residue.py rewrites the generated HTML so appended verse
sections ("## Related Aphorisms / Haikus / Limericks") become a single
labelled "Related residue" panel at the end of each record. This test drives
the transform over fixture pages and asserts the desired presentation:

  * the core record renders first and stays primary (verse only at the tail),
  * verse lives in one clearly labelled "Related residue" section,
  * long verse collections collapse by default (closed <details>),
  * guide pages never present the full appendix,
  * empty or "Stub" verse sections do not render,
  * repeated "Related X" headings no longer create a broken outline
    (one <h2>, <h3> labels, <h4> poem titles, no flat <h2 id="related-...">),
  * direct links to verse anchors keep working (ids preserved),
  * pages without verse are left byte-for-byte identical.

Usage:
    python3 scripts/test_verse_residue.py
"""

import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from verse_residue import transform_html, transform_file, is_guide_path  # noqa: E402

TESTDATA = os.path.join(ROOT, "scripts", "testdata", "verse-residue")
FAILURES = []


def fixture(name):
    with open(os.path.join(TESTDATA, name), encoding="utf-8") as handle:
        return handle.read()


def toc_region(html):
    marker = html.find('class="page-toc"')
    return html[marker:] if marker != -1 else ""


def check(label, condition):
    if condition:
        print(f"  ok  {label}")
    else:
        FAILURES.append(label)
        print(f"  !!  {label}")


def test_no_verse():
    print("== no verse ==")
    original = fixture("no-verse.html")
    transformed, stats = transform_html(original)
    check("page left byte-identical", transformed == original)
    check("no residue section added", "verse-residue" not in transformed)
    check("stats report no change", stats["changed"] is False)


def test_one_short_verse():
    print("== one short verse ==")
    transformed, stats = transform_html(fixture("one-short-verse.html"))
    check("residue section present", '<section class="verse-residue"' in transformed)
    check("labelled Related residue heading",
          '<h2 id="verse-residue">Related residue</h2>' in transformed)
    check("verse label re-leveled to h3",
          '<h3 id="related-aphorisms">Related Aphorisms</h3>' in transformed)
    check("poem title re-leveled to h4",
          '<h4 id="short-aphorism-title">Short Aphorism Title</h4>' in transformed)
    check("no flat verse h2 remains",
          not re.search(r'<h2 id="related-', transformed))
    check("short collection stays open", "<details" not in transformed)
    check("core heading still present", 'id="one-short-verse"' in transformed)
    check("poem heading kept its anchor id",
          'id="short-aphorism-title"' in transformed)
    toc = toc_region(transformed)
    check("TOC keeps core entries", 'href="#one-short-verse"' in toc
          and 'href="#notes"' in toc)
    check("TOC lists Related residue", 'href="#verse-residue"' in toc)
    check("TOC no longer lists verse headings",
          not re.search(r'#related-aphorisms', toc)
          and not re.search(r'#short-aphorism-title', toc))


def test_all_three_types():
    print("== all three verse types ==")
    transformed, stats = transform_html(fixture("all-three-types.html"))
    check("three verse labels as h3",
          transformed.count('<h3 id="related-') == 3)
    check("stray Haikus h2 re-leveled to h4",
          '<h4 id="haikus">Haikus</h4>' in transformed)
    check("poem titles all h4",
          transformed.count('<h4 id="triad-') == 3)
    check("stayed open (3 poems)", "<details" not in transformed)
    check("no flat verse h2 remains",
          not re.search(r'<h2 id="(?:related-|haikus)"', transformed))
    check("stray anchor preserved", 'id="haikus"' in transformed)
    toc = toc_region(transformed)
    check("TOC has single residue entry",
          toc.count('href="#verse-residue"') == 1
          and not re.search(r'#related-haikus|#haikus"', toc))


def test_large_collection():
    print("== large verse collection ==")
    transformed, stats = transform_html(fixture("large-collection.html"))
    check("stats report collapse", stats["collapsed"] is True)
    check("collapsed behind details",
          '<details class="verse-residue__body">' in transformed)
    check("details closed by default",
          '<details class="verse-residue__body" open' not in transformed)
    check("summary carries poem count",
          "Show 10 related poems" in transformed)
    check("all poems still present",
          transformed.count("Haiku number") == 6
          and transformed.count("Limerick number") == 4)
    check("poem anchors preserved",
          'id="large-haiku-group"' in transformed
          and 'id="large-limerick-group"' in transformed)
    check("outline clean",
          transformed.count("<h2 ") == 2
          and transformed.count('<h3 id="related-') == 2
          and transformed.count('<h4 id="') == 3)


def test_stub_empty():
    print("== stub verse heading with no usable content ==")
    transformed, stats = transform_html(fixture("stub-empty.html"))
    check("stub section not rendered", "related-haikus" not in transformed)
    check("stub heading not rendered", "stub-no-content" not in transformed)
    check("no residue section when nothing remains",
          "verse-residue" not in transformed)
    check("stats report the drop", stats["dropped_sections"] == 1)
    toc = toc_region(transformed)
    check("TOC stub entries removed",
          not re.search(r'#related-haikus|#stub-no-content', toc))
    check("core record intact", 'id="stub-verse-section"' in transformed)


def test_guide_always_collapsed():
    print("== guide page ==")
    transformed, stats = transform_html(fixture("guide.html"), collapse_all=True)
    check("guide path detected",
          is_guide_path(Path("guides/GUIDE-0001.html")))
    check("short guide verse still collapsed",
          '<details class="verse-residue__body">' in transformed)
    check("summary present", "Show 1 related poems" in transformed)
    check("guide content stays primary", 'id="steps"' in transformed)
    toc = toc_region(transformed)
    check("TOC residue entry on guide",
          'href="#verse-residue"' in toc
          and not re.search(r'#related-aphorisms', toc))


def test_transform_file_writes_in_place():
    print("== transform_file writes in place ==")
    tmpdir = tempfile.mkdtemp(prefix="verse-residue-test-")
    try:
        work = os.path.join(tmpdir, "reference")
        os.makedirs(work)
        target = os.path.join(work, "fref-sample.html")
        with open(target, "w", encoding="utf-8") as handle:
            handle.write(fixture("one-short-verse.html"))
        _, stats = transform_file(target)
        check("rewritten on disk", "verse-residue" in open(target).read())
        check("stats changed", stats["changed"] is True)
        untouched = os.path.join(work, "no-verse.html")
        with open(untouched, "w", encoding="utf-8") as handle:
            handle.write(fixture("no-verse.html"))
        _, stats = transform_file(untouched)
        check("no-verse page not rewritten", stats["changed"] is False)
        check("no-verse page bytes preserved",
              open(untouched).read() == fixture("no-verse.html"))
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
    print("PASS — verse residue transform behaves as specified and leaves "
          "no-verse pages untouched.")


if __name__ == "__main__":
    main()
