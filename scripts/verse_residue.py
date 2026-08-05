#!/usr/bin/env python3
"""verse_residue.py — Group appended verse sections into a "Related residue" panel.

Boris renders each record's appended poetry ("## Related Aphorisms", "## Related
Haikus", "## Related Limericks") as flat <h2> sections at the end of the
article. That produces a broken outline (repeated <h2> at the same level, a
stray nested "Haikus" <h2>, and a TOC rail that lists every verse heading).

This build-time post-processor rewrites only the generated HTML, never the
Markdown source. For pages that contain verse sections it:

  * wraps the whole verse region in one labelled
    <section class="verse-residue"> with an <h2 id="verse-residue">
    "Related residue" heading, keeping the core record first and primary;
  * re-levels headings so the outline is clean: the three "Related X"
    labels become <h3>, and every inner heading (poem titles, stray
    "Haikus"/"Archival ..." labels) becomes <h4> — all original ids are
    preserved, so deep links to verse anchors keep working;
  * drops sections with no usable content (empty or "Stub:"-only sections),
    and drops empty "Stub:" headings inside surviving sections;
  * collapses long collections by default behind a native <details> element
    (no JavaScript required); guide pages are always collapsed so they do
    not present full verse appendices;
  * replaces the verse TOC entries with a single "Related residue" entry.

Pages without verse sections are left byte-for-byte identical.

Usage:
    python3 scripts/verse_residue.py <html-dir> [--check]

The script processes every *.html below <html-dir> except the compiler's own
_boris/ output. With --check it fails if any invariant is violated.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Ids of the three appended verse sections, in document order.
VERSE_IDS = ("related-aphorisms", "related-haikus", "related-limericks")

# Collapse the residue body behind <details> when it holds more than this
# many poem paragraphs. Single short verses stay open; big collections fold.
LONG_THRESHOLD = 8

# A heading with no content that is labelled a stub is dropped outright.
STUB_PREFIX = "stub:"

# Matches a full heading element emitted by Boris: <h2 id="...">Text</h2>.
HEADING_RE = re.compile(r"<h([1-6])([^>]*)>(.*?)</h\1>", re.S)

TOC_LI_RE = re.compile(r'<li class="page-toc__[^"]*"><a href="(#[^"]+)">')


def _heading_id(match: "re.Match[str]") -> str:
    attrs = match.group(2)
    id_match = re.search(r'\bid\s*=\s*"([^"]*)"', attrs)
    return id_match.group(1) if id_match else ""


def _heading_text(match: "re.Match[str]") -> str:
    return match.group(3)


def _relevel_heading(match: "re.Match[str]", new_level: int) -> str:
    """Rewrite one heading element at a different level, keeping attrs/text."""
    return "<h%d%s>%s</h%d>" % (
        new_level,
        match.group(2),
        match.group(3),
        new_level,
    )


def _count_paragraphs(html: str) -> int:
    return len(re.findall(r"<p[ >]", html))


def _process_section_body(body: str, section_heading: "re.Match[str]") -> tuple[str, int]:
    """Re-level body headings to <h4>, drop empty "Stub:" headings, count poems.

    ``body`` is the section text between the section heading and the next
    verse heading. Returns (rewritten body, number of poem paragraphs).
    """
    heads = list(HEADING_RE.finditer(body))
    chunks: list[str] = []
    cursor = 0
    for index, match in enumerate(heads):
        next_start = heads[index + 1].start() if index + 1 < len(heads) else len(body)
        between = body[match.end():next_start]
        label = _heading_text(match)
        if label.strip().lower().startswith(STUB_PREFIX) and not between.strip():
            # Empty stub heading with no usable content — drop the heading,
            # keep whatever whitespace surrounded it.
            chunks.append(body[cursor:match.start()])
            cursor = match.end()
            continue
        chunks.append(body[cursor:match.start()])
        chunks.append(_relevel_heading(match, 4 if match.group(1) in ("2", "3") else min(6, int(match.group(1)) + 1)))
        cursor = match.end()
    chunks.append(body[cursor:])
    rewritten = "".join(chunks)
    return rewritten, _count_paragraphs(rewritten)


def transform_html(text: str, *, collapse_all: bool = False) -> tuple[str, dict]:
    """Transform one rendered HTML document. Returns (new_text, stats).

    ``collapse_all`` forces the residue body behind a closed <details>
    (used for guide pages). Pages without verse sections are returned
    unchanged with empty stats.
    """
    stats: dict = {"verse_sections": 0, "dropped_sections": 0, "poems": 0,
                   "collapsed": False, "changed": False}

    article_start = text.find("<article")
    article_end_marker = text.find("</article>")
    if article_start == -1 or article_end_marker == -1:
        return text, stats

    body = text[article_start:article_end_marker]
    heads = list(HEADING_RE.finditer(body))
    verse_heads = [m for m in heads if _heading_id(m) in VERSE_IDS]
    if not verse_heads:
        return text, stats

    stats["verse_sections"] = len(verse_heads)

    # Each verse section runs from its heading to the next verse heading
    # (or the end of the article). Everything in between — poem titles,
    # stray "## Haikus" labels, poems — belongs to the section.
    kept: list[str] = []
    total_poems = 0
    for index, section_head in enumerate(verse_heads):
        section_end = (
            verse_heads[index + 1].start()
            if index + 1 < len(verse_heads)
            else len(body)
        )
        sec_body = body[section_head.end():section_end]
        if not HEADING_RE.sub("", sec_body).strip():
            stats["dropped_sections"] += 1
            continue
        rewritten_body, poems = _process_section_body(sec_body, section_head)
        kept.append(_relevel_heading(section_head, 3) + rewritten_body)
        total_poems += poems

    region_start = verse_heads[0].start()

    if not kept:
        # Every verse section was dropped; remove the verse region entirely.
        new_text = text[:article_start] + body[:region_start] + text[article_end_marker:]
        new_text, stats = _rewrite_toc(new_text, residue_entry=False, stats=stats)
        stats["changed"] = True
        return new_text, stats

    stats["poems"] = total_poems
    collapsed = collapse_all or total_poems > LONG_THRESHOLD
    stats["collapsed"] = collapsed

    body_html = "\n".join(kept)
    if collapsed:
        body_html = (
            "<details class=\"verse-residue__body\">\n"
            "<summary>Show %d related poems</summary>\n"
            "%s\n"
            "</details>"
        ) % (total_poems, body_html)

    residue_html = (
        "<section class=\"verse-residue\" aria-labelledby=\"verse-residue\">\n"
        "<h2 id=\"verse-residue\">Related residue</h2>\n"
        "%s\n"
        "</section>\n"
    ) % body_html

    new_article = body[:region_start] + residue_html
    new_text = text[:article_start] + new_article + text[article_end_marker:]
    new_text, stats = _rewrite_toc(new_text, residue_entry=True, stats=stats)
    stats["changed"] = True
    return new_text, stats


def _rewrite_toc(text: str, *, residue_entry: bool, stats: dict) -> tuple[str, dict]:
    """Replace verse entries in the on-page TOC rail with one residue entry."""
    toc_marker = text.find('class="page-toc"')
    if toc_marker == -1:
        return text, stats
    toc_end = text.find("</nav>", toc_marker)
    if toc_end == -1:
        return text, stats

    verse_li = None
    for match in TOC_LI_RE.finditer(text, toc_marker, toc_end):
        if match.group(1) in ("#" + vid for vid in VERSE_IDS):
            verse_li = match
            break
    if verse_li is None:
        return text, stats

    li_start = verse_li.start()
    ul_close = text.find("</ul>", li_start)
    if ul_close == -1:
        return text, stats

    entry = (
        '<li class="page-toc__l2"><a href="#verse-residue">Related residue</a></li>'
        if residue_entry
        else ""
    )
    new_text = text[:li_start] + entry + text[ul_close:]
    stats["toc_pruned"] = True
    return new_text, stats


def transform_file(path: "str | Path", *, collapse_all: bool = False) -> tuple[str, dict]:
    """Read, transform, and write one file back in place."""
    path = Path(path)
    original = path.read_text(encoding="utf-8")
    transformed, stats = transform_html(original, collapse_all=collapse_all)
    if stats["changed"] and transformed != original:
        path.write_text(transformed, encoding="utf-8")
    return transformed, stats


def is_guide_path(path: Path, root: Path) -> bool:
    """True when ``path`` sits under a ``guides/`` directory inside ``root``.

    ``root.rglob`` yields absolute-or-relative paths anchored at ``root``, so
    the guide segment is only visible relative to ``root`` — ``path.parts[0]``
    is the top of the build tree (e.g. "dist"), not "guides".
    """
    relative = path.relative_to(root)
    return bool(relative.parts) and relative.parts[0] == "guides"


def process_directory(root: Path) -> dict:
    summary = {"files": 0, "changed": 0, "sections": 0, "dropped": 0,
               "poems": 0, "collapsed": 0}
    for path in sorted(root.rglob("*.html")):
        if "_boris" in path.parts:
            continue
        summary["files"] += 1
        _, stats = transform_file(
            path,
            collapse_all=is_guide_path(path, root),
        )
        if not stats["changed"]:
            continue
        summary["changed"] += 1
        summary["sections"] += stats["verse_sections"]
        summary["dropped"] += stats["dropped_sections"]
        summary["poems"] += stats["poems"]
        if stats["collapsed"]:
            summary["collapsed"] += 1
    return summary


def check_directory(root: Path) -> list[str]:
    """Invariant checks over the whole rendered site (used by --check)."""
    findings: list[str] = []
    for path in sorted(root.rglob("*.html")):
        if "_boris" in path.parts:
            continue
        html = path.read_text(encoding="utf-8")
        if re.search(r'<h2 id="(?:%s)"' % "|".join(VERSE_IDS), html):
            findings.append(f"{path}: flat verse <h2> survived transform")
        if re.search(r"#(?:%s)" % "|".join(VERSE_IDS), html[html.find('class="page-toc"'):]):
            findings.append(f"{path}: verse entries still linked from the TOC")
    return findings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html_dir", type=Path, help="Rendered HTML directory")
    parser.add_argument("--check", action="store_true",
                        help="Verify invariants over the whole directory")
    args = parser.parse_args(argv)

    if not args.html_dir.is_dir():
        print(f"verse_residue: not a directory: {args.html_dir}", file=sys.stderr)
        return 2

    summary = process_directory(args.html_dir)
    print(
        "Verse residue transform: %d pages scanned, %d rewritten "
        "(%d verse sections, %d dropped, %d poems, %d collapsed)"
        % (
            summary["files"],
            summary["changed"],
            summary["sections"],
            summary["dropped"],
            summary["poems"],
            summary["collapsed"],
        )
    )

    if args.check:
        findings = check_directory(args.html_dir)
        if findings:
            for finding in findings:
                print(f"  !! {finding}", file=sys.stderr)
            print(f"verse_residue check failed: {len(findings)} finding(s).",
                  file=sys.stderr)
            return 1
        print("Verse residue check passed: no flat verse headings or TOC links remain.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
