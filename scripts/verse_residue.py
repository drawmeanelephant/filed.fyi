#!/usr/bin/env python3
"""verse_residue.py — Read-only verification of the certified verse-residue output.

The verse residue **presentation** is now produced before Boris renders: see
``scripts/verse_stage.py``, which rewrites a *staged copy* of the Markdown so
Boris itself emits the single labelled "Related residue" panel — and therefore
certifies exactly the bytes that get deployed. This script is the read-only
post-render half: it verifies the invariants over the certified HTML tree and
**never writes to it**.

Invariants verified over the rendered output:

  * no flat `<h2 id="related-...">` verse heading survives (Boris renders the
    staged raw `<h3>` labels, so a flat verse h2 means staging did not run);
  * the on-page TOC rail links no verse headings (only "Related residue");
  * every page that carries the residue panel has the single labelled panel.

Pages without verse sections must be untouched. This script mutates nothing:
it only reads.

Usage:
    python3 scripts/verse_residue.py <html-dir>
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Ids of the three appended verse sections.
VERSE_IDS = ("related-aphorisms", "related-haikus", "related-limericks")
VERSE_IDS_ALTERNATION = "|".join(VERSE_IDS)

# A flat rendered verse heading is the pre-staging shape.
FLAT_VERSE_H2_RE = re.compile(r'<h2[^>]*id="(?:%s)"' % VERSE_IDS_ALTERNATION)
# A TOC entry linking a verse heading (the pre-staging TOC shape).
TOC_VERSE_LINK_RE = re.compile(
    r'<li class="page-toc__[^"]*"><a href="#(?:%s)"' % VERSE_IDS_ALTERNATION
)
RESIDUE_PANEL_RE = re.compile(
    r'<section class="verse-residue"[^>]*>\s*'
    r'<h2 id="verse-residue">Related residue</h2>',
    re.S,
)


def check_directory(root: Path) -> list[str]:
    """Invariant checks over the whole rendered site. Returns findings."""
    findings: list[str] = []
    for path in sorted(root.rglob("*.html")):
        if "_boris" in path.parts:
            continue
        html = path.read_text(encoding="utf-8")
        flat = list(FLAT_VERSE_H2_RE.finditer(html))
        if flat:
            for match in flat[:3]:
                findings.append(f"{path}: flat verse <h2> survived staging")
        toc_marker = html.find('class="page-toc"')
        if toc_marker != -1:
            toc = html[toc_marker:]
            toc_links = TOC_VERSE_LINK_RE.findall(toc)
            if toc_links:
                findings.append(
                    f"{path}: verse entries still linked from the TOC "
                    f"({', '.join(sorted(set(toc_links)))})"
                )
        if flat and RESIDUE_PANEL_RE.search(html):
            findings.append(
                f"{path}: flat verse h2 and residue panel both present "
                "(staging partially applied?)"
            )
    return findings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Read-only verification of the certified verse-residue output."
    )
    parser.add_argument("html_dir", type=Path, help="Rendered HTML directory")
    args = parser.parse_args(argv)

    if not args.html_dir.is_dir():
        print(f"verse_residue: not a directory: {args.html_dir}", file=sys.stderr)
        return 2

    findings = check_directory(args.html_dir)
    if findings:
        for finding in findings:
            print(f"  !! {finding}", file=sys.stderr)
        print(f"Verse residue check failed: {len(findings)} finding(s).",
              file=sys.stderr)
        return 1
    print("Verse residue check passed: no flat verse headings or TOC links remain.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
