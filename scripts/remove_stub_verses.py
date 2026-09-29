#!/usr/bin/env python3
"""Remove stub verse sections from content records.

Removes "### Stub: ..." sections that contain only placeholder verse:
- "Awaiting context / The record is totally bare / Pending binding soon"
- "Awaiting procedural interpretation. The system kept the ritual and misplaced the function."
- "The record is utterly bare, / With nothing but digital air..."
"""

import re
import sys
from pathlib import Path

PLACEHOLDER_PATTERNS = [
    r"Awaiting context\s+The record is totally bare\s+Pending binding soon",
    r"Awaiting procedural interpretation\.\s+The system kept the ritual and misplaced the function\.",
    r"The record is utterly bare,\s*With nothing but digital air",
]

# Combined pattern for matching any placeholder verse
PLACEHOLDER_RE = re.compile("|".join(f"({p})" for p in PLACEHOLDER_PATTERNS), re.MULTILINE | re.DOTALL)

# Pattern to match a "### Stub: ..." section and its body until the next heading or end of file
STUB_SECTION_RE = re.compile(
    r"(###\s+Stub:.*?\n)(.*?)(?=\n###|\n## |\n# |\Z)",
    re.DOTALL | re.MULTILINE
)


def remove_stub_sections(content: str) -> tuple[str, int]:
    """Remove stub sections containing placeholder verse. Returns (new_content, count_removed)."""
    count = 0
    
    def replace_fn(match):
        nonlocal count
        heading = match.group(1)
        body = match.group(2)
        
        # Check if body contains placeholder verse
        if PLACEHOLDER_RE.search(body):
            count += 1
            return ""  # Remove the entire stub section
        return match.group(0)  # Keep non-placeholder stub sections
    
    new_content = STUB_SECTION_RE.sub(replace_fn, content)
    return new_content, count


def process_file(path: Path) -> int:
    """Process a single file. Returns number of stub sections removed."""
    original = path.read_text(encoding="utf-8")
    new_content, count = remove_stub_sections(original)
    if count > 0 and new_content != original:
        path.write_text(new_content, encoding="utf-8")
        print(f"  Removed {count} stub section(s) from {path}")
    return count


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 remove_stub_verses.py <content_dir>")
        return 1
    
    content_dir = Path(sys.argv[1])
    if not content_dir.is_dir():
        print(f"Not a directory: {content_dir}")
        return 1
    
    total_removed = 0
    files_modified = 0
    
    for path in sorted(content_dir.rglob("*.md")):
        count = process_file(path)
        if count > 0:
            total_removed += count
            files_modified += 1
    
    print(f"\nDone: {total_removed} stub sections removed from {files_modified} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
