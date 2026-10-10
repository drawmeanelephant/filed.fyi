#!/usr/bin/env python3
"""Write-mode twin of the read-only source census.

Rewrites each collection trunk's ``Count: N records.`` line and the README.md
page/trunk/satellite claims so they match the actual Markdown census, then
re-runs the read-only check to confirm convergence. Only repairs drift it owns:
missing or duplicated ``Count:`` lines, unowned records, and absent README
claims are reported and left for a human.

Usage: scripts/reconcile_counts.py [--check]
  --check   dry run: report the changes that would be made, write nothing.
"""

import argparse
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True

from check_collection_counts import COUNT, README_CLAIMS, inspect_counts  # noqa: E402


def reconcile_counts(root, apply):
    """Rewrite declared counts to match the census.

    Returns (changes, findings): ``changes`` describes each rewrite applied
    (or that would be applied when ``apply`` is false); ``findings`` is the
    read-only census output after any rewrites — entries remaining there are
    things this tool deliberately does not fix.
    """
    content = root / "content"
    collections, totals, _ = inspect_counts(root)
    changes = []
    for name, declared, actual in collections:
        if declared is None or declared == actual:
            continue
        trunk = content / f"{name}.md"
        rewritten = COUNT.sub(f"Count: {actual} records.",
                              trunk.read_text(encoding="utf-8"), count=1)
        if apply:
            trunk.write_text(rewritten, encoding="utf-8")
        changes.append(
            f"{trunk.relative_to(root)}: Count {declared} -> {actual}"
        )
    readme = root / "README.md"
    text = readme.read_text(encoding="utf-8") if readme.is_file() else ""
    rewritten = text
    for label, pattern in README_CLAIMS.items():
        value = f"{totals[label]:,}"
        if len(re.findall(pattern, rewritten)) != 1:
            continue
        rewritten = re.sub(
            pattern,
            lambda match, v=value: match.group(0).replace(match.group(1), v),
            rewritten,
            count=1,
        )
    if rewritten != text:
        if apply:
            readme.write_text(rewritten, encoding="utf-8")
        changes.append("README.md: totals rewritten to "
                       f"{totals['pages']:,} pages / {totals['trunks']:,} trunks / "
                       f"{totals['satellites']:,} satellites")
    _, _, findings = inspect_counts(root)
    return changes, findings


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path,
                        default=Path(__file__).resolve().parents[1],
                        help="Repository root")
    parser.add_argument("--check", action="store_true",
                        help="Report drift without rewriting files")
    args = parser.parse_args()
    root = args.root.resolve()
    try:
        changes, findings = reconcile_counts(root, apply=not args.check)
    except (OSError, ValueError) as error:
        print(f"FAIL: {error}")
        return 1
    verb = "would rewrite" if args.check else "rewrote"
    for change in changes:
        print(f"{'DRY-RUN ' if args.check else ''}{verb}: {change}")
    for finding in findings:
        print(f"UNRESOLVED: {finding}")
    if not changes and not findings:
        print("PASS: declared counts already match the source census.")
        return 0
    if findings:
        print("Residual findings need a human; declared-count drift was "
              f"{'left in place' if args.check else 'repaired'} above.")
        return 1
    if args.check:
        print(f"DRY-RUN: {len(changes)} declared-count drift(s) detected.")
        return 1
    print(f"PASS: reconciled {len(changes)} declared-count drift(s); "
          "census now clean.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
