#!/usr/bin/env python3
"""test_verse_residue.py — Regression tests for the read-only residue check.

The verse residue **presentation** is produced before Boris renders by
``scripts/verse_stage.py``; ``scripts/verse_residue.py`` is the read-only
post-render half that verifies the presentation invariants over the certified
HTML tree and **never writes to it**:

  * no flat `<h2 id="related-...">` verse heading survives (Boris renders the
    staged raw `<h3>` labels, so a flat verse h2 means staging did not run);
  * the on-page TOC rail links no verse headings (only \"Related residue\");
  * every page that carries the residue panel has the single labelled panel.

This test drives the read-only check over post-staging fixtures (which must
pass) and pre-staging/flat fixtures (which must fail), and proves the check
does not write into the tree.

Usage:
    python3 scripts/test_verse_residue.py
"""

import os
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from verse_residue import check_directory  # noqa: E402

TESTDATA = os.path.join(ROOT, "scripts", "testdata", "verse-residue")
TESTDATA_FLAT = os.path.join(ROOT, "scripts", "testdata", "verse-residue-flat")
FAILURES = []


def check(label, condition):
    if condition:
        print(f"  ok  {label}")
    else:
        FAILURES.append(label)
        print(f"  !!  {label}")


def copy_fixtures(src_dir: str, dst: Path, names) -> None:
    for name in names:
        shutil.copy(os.path.join(src_dir, name), dst / name)


def test_post_staging_passes():
    print("== post-staging fixtures pass the check ==")
    tmp = Path(tempfile.mkdtemp(prefix="verse-residue-ok-"))
    try:
        copy_fixtures(TESTDATA, tmp,
                      ["no-verse.html", "one-short-verse.html",
                       "all-three-types.html", "large-collection.html",
                       "stub-empty.html", "guide.html"])
        findings = check_directory(tmp)
        check("no findings on post-staging tree", not findings)
        if findings:
            for finding in findings:
                print(f"    !! {finding}")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_flat_fixtures_fail():
    print("== flat pre-staging fixtures fail the check ==")
    tmp = Path(tempfile.mkdtemp(prefix="verse-residue-flat-"))
    try:
        copy_fixtures(TESTDATA_FLAT, tmp,
                      ["one-short-verse.html", "all-three-types.html",
                       "partial-staging.html"])
        findings = check_directory(tmp)
        check("flat verse h2 flagged",
              any("flat verse <h2>" in f for f in findings))
        check("TOC verse links flagged",
              any("linked from the TOC" in f for f in findings))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def test_read_only():
    print("== check never writes into the tree ==")
    tmp = Path(tempfile.mkdtemp(prefix="verse-residue-ro-"))
    try:
        copy_fixtures(TESTDATA, tmp,
                      ["one-short-verse.html", "no-verse.html"])
        copy_fixtures(TESTDATA_FLAT, tmp, ["all-three-types.html"])
        before = {}
        for path in sorted(tmp.rglob("*")):
            if path.is_file():
                before[str(path.relative_to(tmp))] = path.read_bytes()
        check_directory(tmp)
        after = {}
        for path in sorted(tmp.rglob("*")):
            if path.is_file():
                after[str(path.relative_to(tmp))] = path.read_bytes()
        check("no bytes changed", before == after)
        check("no new files", sorted(before) == sorted(after))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    tests = [
        test_post_staging_passes,
        test_flat_fixtures_fail,
        test_read_only,
    ]
    for test in tests:
        test()
        print()

    if FAILURES:
        print("FAILED:")
        for failure in FAILURES:
            print(f"  - {failure}")
        sys.exit(1)
    print("PASS — verse residue check verifies the certified output read-only "
          "and never touches the tree.")


if __name__ == "__main__":
    main()
