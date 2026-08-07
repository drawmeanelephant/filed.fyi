#!/usr/bin/env python3
"""verse_stage.py — Stage the verse residue panel into Markdown BEFORE Boris renders.

Boris renders each record's appended poetry ("## Related Aphorisms", "##
Related Haikus", "## Related Limericks") as flat <h2> sections at the tail of
the article. That produces a broken outline (repeated <h2> at the same level,
a stray nested "Haikus" <h2>, and a TOC rail that lists every verse heading).

This script is the **pre-render** half of the verse-residue presentation. It
rewrites a *staged copy* of the Markdown content tree so that Boris itself
renders the desired presentation — a single labelled "Related residue" panel —
and therefore certifies exactly the bytes that get deployed:

  * the verse region is wrapped in one <section class="verse-residue"> with an
    <h2 id="verse-residue"> "Related residue" heading, keeping the core record
    first and primary;
  * the three "Related X" labels become labelled <p> elements (no heading,
    no id, so Boris's TOC lists a single "Related residue" entry, the search
    index stores no orphan verse fragments, and the label text stays
    searchable inside the panel section);
  * every inner heading (poem titles, stray "Haikus"/"Archival ..." labels) is
    re-leveled to <h4>+ — all original ids are preserved via Markdown
    {#id} anchors, so deep links to verse anchors keep working;
  * sections with no usable content (empty or "Stub:"-only) are dropped, and
    empty "Stub:" headings inside surviving sections are dropped;
  * long collections collapse by default behind a native <details> element
    (no JavaScript required); guide pages are always collapsed so they do not
    present full verse appendices.

The real content/ tree is never touched: run this against a staged copy
before invoking Boris. Pages without verse sections are left byte-for-byte
identical.

Usage:
    python3 scripts/verse_stage.py <staged-content-dir>

The script processes every *.md below the directory in place.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# Section labels that start the three appended verse sections. Matching
# tolerates trailing whitespace and an explicit {#id} suffix (e.g.
# "## Related Aphorisms {#related-aphorisms}") so a future content edit
# cannot silently escape the region and re-broken the outline.
VERSE_HEAD_RE = re.compile(
    r"^##[ \t]+Related (?:Aphorisms|Haikus|Limericks)(?:\s*\{#[A-Za-z0-9][A-Za-z0-9_-]*\})?\s*$"
)


def _is_verse_head(line: str) -> bool:
    return VERSE_HEAD_RE.match(line.strip()) is not None

# Collapse the residue body behind <details> when it holds more than this
# many poems. Single short verses stay open; big collections fold.
LONG_THRESHOLD = 8

# A heading with no content that is labelled a stub is dropped outright.
STUB_PREFIX = "stub:"

# Matches a Markdown heading line: ^## Text {#optional-id}
HEADING_RE = re.compile(r"^(#{1,6})[ \t]+(.*?)\s*$")

# An explicit Kramdown-style id suffix, e.g. " {#custom-id}".
EXPLICIT_ID_RE = re.compile(r"\s*\{#([A-Za-z0-9][A-Za-z0-9_-]*)\}\s*$")


def _heading_level(line: str) -> int:
    match = HEADING_RE.match(line)
    return len(match.group(1)) if match else 0


def _heading_label(line: str) -> str:
    """Heading text without the leading hashes or a trailing {#id} suffix."""
    match = HEADING_RE.match(line)
    if not match:
        return line.strip()
    text = match.group(2)
    text = EXPLICIT_ID_RE.sub("", text)
    return text.strip()


def _relevel_line(line: str) -> str:
    """Re-level one Markdown heading line, mirroring the rendered-HTML rules.

    h1 -> h2, h2/h3 -> h4, h4 -> h5, h5 -> h6, h6 stays h6. The heading text
    (including any explicit {#id}) is preserved so anchors do not move.
    """
    match = HEADING_RE.match(line)
    if not match:
        return line
    level = len(match.group(1))
    if level in (2, 3):
        new_level = 4
    else:
        new_level = min(6, level + 1)
    return "#" * new_level + " " + match.group(2)


def _count_poems(body_lines: list[str]) -> int:
    """Count poem blocks in a kept section body.

    Each poem renders as one <p>, so it maps to one run of consecutive
    non-blank, non-heading lines in the Markdown.
    """
    poems = 0
    in_poem = False
    for line in body_lines:
        if _heading_level(line):
            in_poem = False
            continue
        if not line.strip():
            in_poem = False
            continue
        if not in_poem:
            poems += 1
            in_poem = True
    return poems


def transform_markdown(text: str, *, collapse_all: bool = False) -> tuple[str, dict]:
    """Transform one staged Markdown document. Returns (new_text, stats).

    ``collapse_all`` forces the residue body behind a closed <details>
    (used for guide pages). Pages without verse sections are returned
    unchanged with empty stats.
    """
    stats: dict = {"verse_sections": 0, "dropped_sections": 0, "poems": 0,
                   "collapsed": False, "changed": False}

    lines = text.splitlines(keepends=True)
    # Find the first verse-section heading. The region runs to the end of
    # file — matching the rendered-HTML behaviour, where the appended verse
    # sections sit at the tail of the article and the last section extends
    # to the end of the record. Everything after the first verse head is
    # treated as residue; this mirrors the pre-existing presentation
    # contract (verse sections are always appended last in Filed records).
    region_start = None
    for index, line in enumerate(lines):
        if _is_verse_head(line):
            region_start = index
            break
    if region_start is None:
        return text, stats

    stats["verse_sections"] = 1
    region = lines[region_start:]
    kept: list[tuple[str, list[str]]] = []  # (label, body lines)
    total_poems = 0

    # Split the region into sections at each verse heading.
    current_head: str | None = None
    current_body: list[str] = []
    sections: list[tuple[str, list[str]]] = []

    def flush() -> None:
        nonlocal current_head, current_body
        if current_head is not None:
            sections.append((current_head, current_body))
        current_head = None
        current_body = []

    for line in region:
        if _is_verse_head(line):
            flush()
            current_head = line.strip()
        else:
            current_body.append(line)
    flush()

    for head, body in sections:
        # Drop empty "Stub:" headings: a heading with no content between it
        # and the next heading (or the end of the section) is removed.
        filtered: list[str] = []
        cursor = 0
        heading_indices = [i for i, ln in enumerate(body) if _heading_level(ln)]
        for pos, index in enumerate(heading_indices):
            next_index = heading_indices[pos + 1] if pos + 1 < len(heading_indices) else len(body)
            between = body[index + 1:next_index]
            label = _heading_label(body[index])
            if label.lower().startswith(STUB_PREFIX) and not any(
                ln.strip() and not _heading_level(ln) for ln in between
            ):
                filtered.extend(body[cursor:index])
                cursor = index + 1
        filtered.extend(body[cursor:])

        # Drop the whole section when no usable text remains after headings.
        usable = [ln for ln in filtered if ln.strip() and not _heading_level(ln)]
        if not usable:
            stats["dropped_sections"] += 1
            continue

        re_leveled = [_relevel_line(ln) for ln in filtered]
        kept.append((_heading_label(head), re_leveled))
        total_poems += _count_poems(filtered)

    if not kept:
        # Every verse section was dropped; remove the verse region entirely.
        new_text = "".join(lines[:region_start])
        stats["changed"] = True
        return new_text, stats

    stats["poems"] = total_poems
    collapsed = collapse_all or total_poems > LONG_THRESHOLD
    stats["collapsed"] = collapsed

    parts: list[str] = []
    parts.append('<section class="verse-residue" aria-labelledby="verse-residue">\n')
    parts.append('\n<h2 id="verse-residue">Related residue</h2>\n')
    if collapsed:
        parts.append(
            '\n<details class="verse-residue__body">\n'
            f'<summary>Show {total_poems} related poems</summary>\n'
        )
    for label, body in kept:
        # A labelled <p> rather than a heading: a heading would either leak
        # into the TOC (if id'd) or break Boris's rendered-search check
        # (an id-less heading stores an unresolvable search fragment).
        parts.append(f'\n<p class="verse-residue__label">{label}</p>\n')
        # Guarantee a blank line between the raw-HTML label and any Markdown
        # body, so Apex treats the body as Markdown (not raw HTML).
        parts.append("\n")
        parts.append("".join(body).rstrip("\n") + "\n")
    if collapsed:
        parts.append("\n</details>\n")
    parts.append("\n</section>\n")

    residue = "".join(parts)
    new_text = "".join(lines[:region_start]) + residue
    stats["changed"] = True
    return new_text, stats


def transform_file(path: "str | Path", *, collapse_all: bool = False) -> dict:
    """Read, transform, and write one staged Markdown file in place."""
    path = Path(path)
    original = path.read_text(encoding="utf-8")
    transformed, stats = transform_markdown(original, collapse_all=collapse_all)
    if stats["changed"] and transformed != original:
        path.write_text(transformed, encoding="utf-8")
    return stats


def is_guide_path(path: Path, root: Path) -> bool:
    """True when ``path`` sits under a ``guides/`` directory inside ``root``."""
    relative = path.relative_to(root)
    return bool(relative.parts) and relative.parts[0] == "guides"


def process_directory(root: Path) -> dict:
    summary = {"files": 0, "changed": 0, "sections": 0, "dropped": 0,
               "poems": 0, "collapsed": 0}
    for path in sorted(root.rglob("*.md")):
        summary["files"] += 1
        stats = transform_file(
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


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Stage the verse residue panel into a staged Markdown copy "
                    "before Boris renders it."
    )
    parser.add_argument("content_dir", type=Path,
                        help="Staged Markdown content directory (transformed in place)")
    args = parser.parse_args(argv)

    if not args.content_dir.is_dir():
        print(f"verse_stage: not a directory: {args.content_dir}", file=sys.stderr)
        return 2

    summary = process_directory(args.content_dir)
    print(
        "Verse residue staging: %d pages scanned, %d staged "
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
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
