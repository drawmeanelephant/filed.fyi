#!/usr/bin/env python3
"""normalize_literal_newline_haikus.py — Repair literal-``\\n`` haiku verse residue.

Migration representation defect
-------------------------------
During the Astro -> Boris migration, authored haiku verse was serialized with
the literal two-character sequence backslash+n (``\\n``) standing in for
physical Markdown line breaks. The verse reads correctly only when each
literal ``\\n`` is an actual line boundary. This tool replaces those literal
escapes with real newlines inside **proven haiku verse blocks only**.

Evidence / classification rule
------------------------------
An occurrence is repaired only when ALL of the following hold:

1. It is the literal two-character sequence ``\\`` ``n`` (a single backslash
   followed by ``n``), not part of a longer escape such as ``\\\\n``.
2. It is outside the frontmatter block (``---`` ... ``---``).
3. It is outside a fenced code block (````` ``` ```` / ``~~~``) and outside a
   Boris native note/quote container (``:::`` ... ``:::`).
4. The enclosing Markdown section is a haiku verse section: the nearest
   heading above the occurrence matches ``Haikus``, ``Haikus {#…}``, or
   ``Related Haikus`` (heading level 2+).

Anything that fails the rule is **refused** (reported, never guessed). In
``--apply`` mode a single refused occurrence aborts the run before any file
is written. In ``--check`` mode refused occurrences make the run exit 1.

Scope
-----
Default scope repairs every proven occurrence under ``content/`` (the ``haikus``
collection, plus haiku verse embedded in ``mascots`` Haiku Log sections and
``reference`` Related Haikus sections — the identical defect). Use
``--scope=haikus`` to restrict to the ``haikus`` collection. The tool never
touches limerick verse, aphorisms, prose, or any other content.

Idempotence
-----------
Repairing replaces each literal ``\\n`` with one real newline and nothing
else. A second apply finds no literal ``\\n`` and changes zero bytes.

Usage
-----
    python3 scripts/normalize_literal_newline_haikus.py [--check] [--apply]
    python3 scripts/normalize_literal_newline_haikus.py --scope=haikus
    python3 scripts/normalize_literal_newline_haikus.py --apply

Exit codes
----------
    0  check: no defects remain / apply: repaired cleanly
    1  check: defects remain, or refused/ambiguous occurrences exist
    2  usage error
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONTENT = ROOT / "content"

# The literal two-character sequence backslash+n, when not itself escaped.
# Negative lookbehind rejects "\\n" (backslash backslash n), which is
# intentional text about escapes rather than a defective line boundary.
BSN_RE = re.compile(r"(?<!\\)\\n")

# Haiku verse section headings: "## Haikus", "## Haikus {#haikus-2}",
# "## Related Haikus", and the same at deeper levels.
HAIKU_HEADING_RE = re.compile(
    r"^#{2,6}\s+(?:Related\s+)?Haikus(?:\s*\{#[^}]*\})?\s*$"
)

# Fence / container markers that shield their contents from interpretation.
FENCE_STARTS = ("```", "~~~")
CONTAINER_STARTS = (":::",)


@dataclass
class Occurrence:
    path: str
    offset: int
    line: int
    context: str
    reason: str = ""


@dataclass
class FileResult:
    path: str
    repaired: int = 0
    refused: list[Occurrence] = field(default_factory=list)


def is_heading(line: str) -> bool:
    return bool(HAIKU_HEADING_RE.match(line))


def classify(text: str) -> tuple[list[Occurrence], list[Occurrence]]:
    """Return (provable, refused) literal-\\n occurrences.

    The section walk mirrors Markdown: headings at level 2+ reset the current
    section; a haiku heading makes the section a haiku verse section; fenced
    code and ::: containers shield their contents; the frontmatter block
    (leading --- ... ---) is never considered.

    Fail-closed edges (both bias toward refusal, never toward over-repair):
    a heading nested inside a haiku section (e.g. ``### Poem``) resets the
    section to non-haiku, so verse under it is refused rather than guessed;
    a file whose frontmatter never closes is treated as frontmatter to the
    end and its occurrences are not repaired.
    """
    lines = text.split("\n")
    provable: list[Occurrence] = []
    refused: list[Occurrence] = []

    # Rebuild offset index per line (byte offsets within the string).
    offsets: list[int] = []
    acc = 0
    for ln in lines:
        offsets.append(acc)
        acc += len(ln) + 1  # +1 for the '\n' that split() consumed

    in_frontmatter = text.startswith("---")
    in_fence: str | None = None
    in_container: str | None = None
    haiku_section = False

    for i, ln in enumerate(lines):
        stripped = ln.strip()
        # Frontmatter terminates at the first closing --- after line 0.
        if in_frontmatter:
            if i > 0 and stripped == "---":
                in_frontmatter = False
            continue
        # Fences / containers toggling.
        for marker in FENCE_STARTS:
            if stripped.startswith(marker):
                if in_fence is None:
                    in_fence = marker
                elif in_fence == marker:
                    in_fence = None
                break
        if in_fence is not None:
            continue
        if stripped.startswith(CONTAINER_STARTS):
            if in_container is None:
                in_container = stripped
            elif stripped == ":::" or stripped == in_container:
                in_container = None
            continue
        if in_container is not None:
            continue
        # Heading resets section context.
        if re.match(r"^#{2,6}\s+", ln):
            haiku_section = is_heading(ln)
            continue
        # Scan this line for literal backslash+n.
        for m in BSN_RE.finditer(ln):
            start = offsets[i] + m.start()
            occ = Occurrence(
                path="",
                offset=start,
                line=i + 1,
                context=text[max(0, start - 24):start + 12],
                reason="" if haiku_section else "not inside a haiku verse section",
            )
            (provable if haiku_section else refused).append(occ)
    return provable, refused


def analyze_file(path: Path, content: Path) -> FileResult:
    """Read-only: classify occurrences; never writes."""
    text = path.read_text(encoding="utf-8")
    provable, refused = classify(text)
    result = FileResult(path=str(path.relative_to(content)))
    result.refused = refused
    if refused or not provable:
        return result
    result.repaired = len(provable)
    return result


def apply_file(path: Path) -> int:
    """Write the repair for proven occurrences only (context-aware).

    Replaces each proven literal backslash+n with a real newline and nothing
    else. Fenced code, ::: containers, frontmatter, and non-haiku sections are
    never touched. Returns the number of repairs, or -1 if any occurrence is
    refused (caller must abort without writing).
    """
    text = path.read_text(encoding="utf-8")
    provable, refused = classify(text)
    if refused:
        return -1
    if not provable:
        return 0
    new_text = text
    for occ in sorted(provable, key=lambda o: o.offset, reverse=True):
        new_text = new_text[: occ.offset] + "\n" + new_text[occ.offset + 2 :]
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
    return len(provable)


def scan(content: Path, scope: str) -> list[FileResult]:
    if scope == "haikus":
        files = sorted((content / "haikus").glob("*.md"))
    elif scope == "all":
        files = sorted(content.rglob("*.md"))
    else:
        raise SystemExit(f"unknown scope: {scope}")
    return [analyze_file(f, content) for f in files]


def _affected_paths(results: list[FileResult], content: Path) -> list[Path]:
    return [content / r.path for r in results if r.repaired > 0 and not r.refused]


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    mode = ap.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true", help="read-only report (default)")
    mode.add_argument("--apply", action="store_true", help="write repairs")
    ap.add_argument("--scope", choices=("all", "haikus"), default="all")
    ap.add_argument("--content", type=Path, default=DEFAULT_CONTENT)
    ap.add_argument("--json", action="store_true", help="emit JSON report")
    args = ap.parse_args(argv)

    if not args.content.is_dir():
        print(f"error: content root not found: {args.content}", file=sys.stderr)
        return 2

    results = scan(args.content, args.scope)
    affected = [r for r in results if r.repaired > 0]
    refused_all = [r for r in results if r.refused]
    total_repaired = sum(r.repaired for r in affected)
    total_refused = sum(len(r.refused) for r in refused_all)

    if args.apply and not refused_all:
        # Write repairs only after the whole scan is provable.
        counts = [apply_file(f) for f in _affected_paths(results, args.content)]
        if any(n < 0 for n in counts):
            print("error: refused occurrence during apply; aborting",
                  file=sys.stderr)
            return 1
        total_repaired = sum(counts)

    if args.json:
        import json

        payload = {
            "scope": args.scope,
            "mode": "apply" if args.apply else "check",
            "files_scanned": len(results),
            "files_affected": len(affected),
            "occurrences_repaired": total_repaired,
            "refused_files": [str(r.path) for r in refused_all],
            "refused_occurrences": total_refused,
            "affected_files": sorted(str(r.path) for r in affected),
        }
        print(json.dumps(payload, indent=1, sort_keys=True))
    else:
        print(f"files scanned: {len(results)}")
        print(f"files affected: {len(affected)}")
        print(f"literal \\n occurrences repaired: {total_repaired}")
        print(f"refused/ambiguous occurrences: {total_refused}")
        for r in refused_all:
            for occ in r.refused:
                print(f"  REFUSED {r.path}:{occ.line}: {occ.reason}")
        for r in affected:
            print(f"  {r.repaired:4d}  {r.path}")

    if args.apply:
        if refused_all:
            if not args.json:
                print("error: refused occurrences; nothing written",
                      file=sys.stderr)
            return 1
        if not args.json:
            print("apply complete")
        return 0
    # check mode
    if refused_all:
        if not args.json:
            print("check: FAIL (refused/ambiguous occurrences)",
                  file=sys.stderr)
        return 1
    if total_repaired:
        if not args.json:
            print("check: FAIL (repairable occurrences remain)",
                  file=sys.stderr)
        return 1
    if not args.json:
        print("check: PASS (no literal-\\n haiku residue)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
