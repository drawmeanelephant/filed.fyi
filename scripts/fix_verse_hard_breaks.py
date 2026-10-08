#!/usr/bin/env python3
"""fix_verse_hard_breaks.py — restore missing hard breaks in verse stanzas.

Verse lines rely on the CommonMark two-trailing-spaces hard break. Multi-agent
authoring left stanzas where non-final lines carry no break, so Boris/Oliver
correctly compiles them as soft breaks — the stanza renders as one run-on
paragraph instead of separate verse lines.

Scope (the two places verse lives):

  * collection record bodies under content/limericks/ and content/haikus/
    (everything after frontmatter is verse);
  * "## Related Haikus" / "## Related Limericks" residue regions in any
    record (the region runs to the next Related heading or EOF, mirroring
    verse_stage.py's contract). Aphorisms are prose and are never touched.

A stanza is a run of two or more consecutive non-blank, non-heading,
non-raw-HTML lines (Markdown list items count; the ~30 residue verses
authored as "- line" + indented continuations keep their style and just get
breaks). Every non-final stanza line must already end in a hard break —
two or more trailing spaces or an unescaped backslash — or the line's
trailing whitespace is normalized to exactly two spaces. Final stanza
lines, single-line runs, headings, blanks, fenced code, and lines that
already break are never modified. Additive whitespace only.

Usage:
    python3 scripts/fix_verse_hard_breaks.py <content-dir> --check
    python3 scripts/fix_verse_hard_breaks.py <content-dir> --apply [--exclude PATH]...

--check exits 1 and lists every violating line without writing; usable as a
guardrail. --apply rewrites files in place and prints a per-file summary.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

VERSE_HEAD_RE = re.compile(
    r"^##[ \t]+Related (?:Aphorisms|Haikus|Limericks)(?:\s*\{#[A-Za-z0-9][A-Za-z0-9_-]*\})?\s*$"
)
HEADING_RE = re.compile(r"^#{1,6}[ \t]")
FENCE_RE = re.compile(r"^\s*```")
COLLECTION_DIRS = ("limericks", "haikus")


def _is_verse_head(line: str) -> bool:
    return VERSE_HEAD_RE.match(line.strip()) is not None


def _split_eol(line: str) -> tuple[str, str]:
    if line.endswith("\r\n"):
        return line[:-2], "\r\n"
    if line.endswith("\n"):
        return line[:-1], "\n"
    return line, ""


def _has_hard_break(body: str) -> bool:
    """Mirror Oliver's analyzeLineEnd (markdown.zig §6.7): the trailing
    whitespace run is consumed first; two or more spaces inside it is a hard
    break (tabs never count). Otherwise an unescaped backslash ending the
    content is a hard break."""
    stripped = body.rstrip(" \t")
    run = body[len(stripped):]
    if run.count(" ") >= 2:
        return True
    if stripped.endswith("\\"):
        n = 0
        i = len(stripped) - 1
        while i >= 0 and stripped[i] == "\\":
            n += 1
            i -= 1
        return n % 2 == 1
    return False


def _regions(lines: list[str]) -> list[tuple[int, int]]:
    """Yield (start, end) line-index spans of Related Haikus/Limericks
    residue regions. A region runs to the next Related heading or EOF,
    mirroring verse_stage.py's contract."""
    spans: list[tuple[int, int]] = []
    i = 0
    while i < len(lines):
        if _is_verse_head(lines[i]) and "Aphorisms" not in lines[i]:
            start = i + 1
            j = len(lines)
            for k in range(start, len(lines)):
                if _is_verse_head(lines[k]):
                    j = k
                    break
            spans.append((start, j))
            i = j
        else:
            i += 1
    return spans


def _is_verse_line(body: str) -> bool:
    """A line that belongs to a stanza run."""
    if not body.strip():
        return False
    if HEADING_RE.match(body):
        return False
    if body.lstrip().startswith("<"):
        return False
    return True


def transform_with_scope(path: Path, root: Path) -> tuple[str, list[tuple[int, str]]]:
    text = path.read_text(encoding="utf-8")
    rel = path.relative_to(root)
    in_collection = bool(rel.parts) and rel.parts[0] in COLLECTION_DIRS
    lines = text.splitlines(keepends=True)

    fm_end = 0
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                fm_end = i + 1
                break

    if in_collection:
        spans = [(fm_end, len(lines))]
    else:
        spans = [(fm_end + s, fm_end + e) for s, e in _regions(lines[fm_end:])]

    violations: list[tuple[int, str]] = []
    new_lines = list(lines)

    for start, end in spans:
        stanza: list[int] = []
        in_fence = False

        def flush() -> None:
            if len(stanza) < 2:
                stanza.clear()
                return
            for idx in stanza[:-1]:
                body, eol = _split_eol(lines[idx])
                if _has_hard_break(body):
                    continue
                violations.append((idx + 1, body))
                new_lines[idx] = body.rstrip(" \t") + "  " + eol
            stanza.clear()

        for idx in range(start, end):
            body, _ = _split_eol(lines[idx])
            if FENCE_RE.match(body):
                in_fence = not in_fence
                flush()
                continue
            if in_fence:
                flush()
                continue
            if _is_verse_line(body):
                stanza.append(idx)
            else:
                flush()
        flush()

    return "".join(new_lines), violations


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Restore or check two-space hard breaks in verse stanzas."
    )
    parser.add_argument("content_dir", type=Path)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true",
                      help="report violations without writing (exit 1 if any)")
    mode.add_argument("--apply", action="store_true",
                      help="rewrite files in place")
    parser.add_argument("--exclude", type=Path, action="append", default=[],
                        help="content-relative path to skip (repeatable)")
    args = parser.parse_args(argv)

    root = args.content_dir
    if not root.is_dir():
        print(f"fix_verse_hard_breaks: not a directory: {root}", file=sys.stderr)
        return 2
    excluded = set()
    for e in args.exclude:
        p = e.as_posix()
        if p.startswith(root.as_posix() + "/"):
            p = p[len(root.as_posix()) + 1:]
        elif p.startswith("content/"):
            p = p[len("content/"):]
        excluded.add(p)

    total_files = total_lines = 0
    for path in sorted(root.rglob("*.md")):
        rel = path.relative_to(root).as_posix()
        if rel in excluded:
            continue
        new_text, violations = transform_with_scope(path, root)
        if not violations:
            continue
        total_files += 1
        total_lines += len(violations)
        if args.check:
            for lineno, body in violations:
                print(f"{rel}:{lineno}: missing hard break: {body.strip()!r}")
        else:
            path.write_text(new_text, encoding="utf-8")
            print(f"{rel}: {len(violations)} line(s) fixed")

    verb = "violation(s)" if args.check else "line(s) fixed"
    print(
        f"fix_verse_hard_breaks: {total_lines} {verb} across {total_files} file(s)"
    )
    if args.check and total_lines:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
