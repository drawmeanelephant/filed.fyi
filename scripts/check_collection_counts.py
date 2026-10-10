#!/usr/bin/env python3
"""Read-only source census for the shared maintenance finalization lane.

Count Markdown files, including nested records and new local dockets. This is
not a Boris graph/schema validator, a record registry, or evidence of reading.
"""

import argparse
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
COUNT = re.compile(r"^Count: (\d+) records\.$", re.MULTILINE)
README_CLAIMS = {
    "pages": r"Filed is a ([\d,]+)-page",
    "trunks": r"includes ([\d,]+) trunk pages",
    "satellites": r"and ([\d,]+) satellite records",
}


def census_markdown_files(root):
    """Return committable Markdown files: tracked + untracked-but-not-ignored.

    Gitignored local-only records (e.g. the spec-lab testbed) exist in the
    working tree but are not archive source and must not move the counts.
    Falls back to a plain rglob when git is unavailable.
    """
    try:
        out = subprocess.run(
            ["git", "ls-files", "--cached", "--others", "--exclude-standard", "--", "content"],
            cwd=root,
            capture_output=True,
            text=True,
            check=True,
        )
        return {
            root / line
            for line in out.stdout.splitlines()
            if line.strip().endswith(".md")
        }
    except (OSError, subprocess.CalledProcessError):
        return {p for p in (root / "content").rglob("*.md") if p.is_file()}


def inspect_counts(root):
    content = root / "content"
    if not content.is_dir():
        raise ValueError(f"Missing source directory: {content}")
    pages = census_markdown_files(root)
    trunks = sorted(p for p in pages if p.parent == content)
    totals = {
        "pages": len(pages),
        "trunks": len(trunks),
        "satellites": len(pages) - len(trunks),
    }
    findings = []
    collections = []
    accounted = set(trunks)
    if content / "index.md" not in pages:
        findings.append("Missing home trunk: content/index.md")
    for trunk in trunks:
        if trunk.name == "index.md":
            continue
        records = {p for p in pages if (content / trunk.stem) in p.parents}
        accounted.update(records)
        matches = COUNT.findall(trunk.read_text(encoding="utf-8"))
        declared = int(matches[0]) if len(matches) == 1 else None
        collections.append((trunk.stem, declared, len(records)))
        if declared is None:
            findings.append(f"{trunk.relative_to(root)}: expected one Count: line")
        elif declared != len(records):
            findings.append(
                f"{trunk.relative_to(root)}: declares {declared}, actual {len(records)}"
            )
    for path in sorted(pages - accounted):
        findings.append(f"No collection trunk for {path.relative_to(root)}")
    readme = root / "README.md"
    text = readme.read_text(encoding="utf-8") if readme.is_file() else ""
    for label, pattern in README_CLAIMS.items():
        matches = re.findall(pattern, text)
        declared = int(matches[0].replace(",", "")) if len(matches) == 1 else None
        if declared is None:
            findings.append(f"README.md: expected one {label} claim")
        elif declared != totals[label]:
            findings.append(
                f"README.md: declares {declared} {label}, actual {totals[label]}"
            )
    return collections, totals, findings


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT, help="Repository root")
    args = parser.parse_args()
    try:
        collections, totals, findings = inspect_counts(args.root.resolve())
    except (OSError, ValueError) as error:
        print(f"FAIL: {error}")
        return 1
    for name, declared, actual in collections:
        print(f"{name}: declared {declared}, actual {actual}")
    print(
        f"Source: {totals['pages']} pages, {totals['trunks']} trunks, "
        f"{totals['satellites']} satellites"
    )
    for finding in findings:
        print(f"FAIL: {finding}")
    if findings:
        return 1
    print("PASS: collection counts and README totals match Markdown source.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
