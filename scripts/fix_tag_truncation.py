#!/usr/bin/env python3
"""fix_tag_truncation.py — Repair tags corrupted by the Boris migration mapper.

Root cause
----------
The Astro→Boris migration mapper (commit 8e7db007) transformed each block-list
tag scalar as:  stripped = quote-strip(raw[2:])   — i.e. it sliced the first
two characters off every tag (including any surrounding quote chars), dropped
empties, deduplicated, and prepended the collection name.  Inline single-line
arrays survived intact; column-0 block items were dropped entirely.

Consequence:  `managed-absence` → `naged-absence`, `mascots` → `scots`,
`compliance-warning` → `mpliance-warning`, `continuity-theatre` →
`ntinuity-theatre`, `'403'` → `03`, etc.  The corrupted tags were baked into
content/ by the migration and then faithfully mirrored into every generated
output (IR graph, RAG parts, context bundle).

This script repairs the source of record (content/) back to the pre-migration
ground truth captured at 6abe4416 (src/content + src/content-residue), using
metadata/id-map.jsonl for exact legacy→current correspondence.

Target rule
-----------
    target = [collection] + dedup(quote-strip(pre tags+concepts))

Ground truth location: scratch/pre-tree (a git archive of 6abe4416's
src/content and src/content-residue).  If scratch/pre-tree is absent the
script will refuse to run.

Usage
-----
    python3 scripts/fix_tag_truncation.py [--dry-run] [--apply]
"""
import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRE_TREE = os.path.join(ROOT, "scratch", "pre-tree", "src")
CONTENT = os.path.join(ROOT, "content")
ID_MAP = os.path.join(ROOT, "metadata", "id-map.jsonl")

# Names of the regression tags the user must see round-trip unchanged.
NAMED_TAGS = [
    "mascots",
    "empathegy",
    "managed-absence",
    "continuity-theatre",
    "compliance-warning",
    "metrics-of-care",
    "assurance-vocabulary",
]

# Boris frontmatter schema caps tags per page at this many (verified: 33 fails).
MAX_TAGS = 32


def find_pre(collection, stem):
    """Resolve the pre-migration file for a legacy stem (or None)."""
    bases = [
        os.path.join(PRE_TREE, "content", "docs", collection),
        os.path.join(PRE_TREE, "content", collection),
        os.path.join(PRE_TREE, "content", "docs"),
        os.path.join(PRE_TREE, "content"),
        os.path.join(PRE_TREE, "content-residue", "workflow", collection),
        os.path.join(PRE_TREE, "content-residue"),
    ]
    names = [stem + ".mdx", stem + ".md", stem + ".quarantined.md"]
    for b in bases:
        for n in names:
            p = os.path.join(b, n)
            if os.path.exists(p):
                return p
    for dirpath, dirnames, filenames in os.walk(PRE_TREE):
        for f in filenames:
            if f in names:
                return os.path.join(dirpath, f)
    return None


def block_items(text, key):
    """Return block-list scalar values under `key:` (indented or column-0)."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if re.match(r"^%s:[ \t]*$" % re.escape(key), line):
            items = []
            j = i + 1
            while j < len(lines):
                nxt = lines[j]
                mm = re.match(r"^\s*-\s+(.*)$", nxt)
                if mm:
                    items.append(mm.group(1).strip())
                    j += 1
                elif nxt.strip() == "" or nxt.startswith((" ", "\t")):
                    break
                else:
                    break
            return items
    return None


def inline_items(text, key):
    for line in text.splitlines():
        m = re.match(r"^%s:[ \t]*\[(.*)\]$" % re.escape(key), line)
        if m:
            return [v.strip() for v in m.group(1).split(",") if v.strip()]
    return None


def pre_tags(text):
    """All tag-ish values from tags and concepts fields (block or inline)."""
    out = []
    for key in ("tags", "concepts"):
        bi = block_items(text, key)
        if bi is not None:
            out.extend(bi)
        else:
            ii = inline_items(text, key)
            if ii is not None:
                out.extend(ii)
    return out


def strip_quotes(s):
    s = s.strip()
    while s and s[0] in "'\"":
        s = s[1:]
    while s and s[-1] in "'\"":
        s = s[:-1]
    return s


def unescape(s):
    """Decode YAML-style \\uXXXX escapes so equivalent spellings compare equal."""
    def repl(m):
        return chr(int(m.group(1), 16))
    return re.sub(r"\\u([0-9a-fA-F]{4})", repl, s)


def dedup(vals):
    seen = set()
    out = []
    for v in vals:
        if v not in seen:
            seen.add(v)
            out.append(v)
    return out


def current_tags(text):
    m = re.search(r"^tags:[ \t]*\[(.*)\]$", text, re.M)
    if not m:
        return None
    return [unescape(strip_quotes(v)) for v in m.group(1).split(",") if v.strip()]


def target_tags(collection, pre_text):
    vals = [collection] + [unescape(strip_quotes(t)) for t in pre_tags(pre_text)]
    vals = dedup(vals)
    # Boris schema limit: cap the list in source-of-record order (see MAX_TAGS).
    return vals[:MAX_TAGS]


def rewrite_tags_line(text, target):
    """Replace the `tags:` frontmatter line with an inline JSON array."""
    values = ", ".join(json.dumps(v) for v in target)
    line = "tags: [%s]" % values
    # replace the existing line (lambda avoids \u escape processing in repl)
    new_text, n = re.subn(r"^tags:[ \t]*\[.*\]$", lambda m: line, text, count=1, flags=re.M)
    if n == 0:
        # no existing tags line: insert after the `---` opener
        new_text = text.replace("---\n", "---\n%s\n" % line, 1)
        n = 1
    return new_text


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true",
                        help="report what would change without writing")
    parser.add_argument("--apply", action="store_true",
                        help="write repaired files")
    args = parser.parse_args()

    if not os.path.isdir(PRE_TREE):
        sys.exit("error: ground-truth tree missing at %s — run:\n"
                 "  git archive 6abe4416 src/content src/content-residue "
                 "| tar -x -C scratch/pre-tree" % PRE_TREE)

    rows = [json.loads(l) for l in open(ID_MAP) if l.strip()]

    changed = []
    unchanged = 0
    no_pre = []
    named_hits = {n: 0 for n in NAMED_TAGS}

    for row in rows:
        if row.get("role") != "satellite":
            continue
        post_rel = row["source"]
        pp = os.path.join(CONTENT, post_rel)
        if not os.path.exists(pp):
            continue
        text = open(pp).read()
        cur = current_tags(text)
        legacy = row.get("legacy_id", "")
        stem = legacy.split("/")[-1] if legacy else post_rel.split("/")[-1]
        pre_path = find_pre(row["collection"], stem)
        if not pre_path:
            no_pre.append(post_rel)
            continue
        target = target_tags(row["collection"], open(pre_path).read())
        if cur == target:
            unchanged += 1
            for n in NAMED_TAGS:
                if n in (cur or []):
                    named_hits[n] += 1
            continue
        changed.append((post_rel, cur, target, pre_path))
        for n in NAMED_TAGS:
            if n in target:
                named_hits[n] += 1
        if args.apply:
            open(pp, "w").write(rewrite_tags_line(text, target))

    print("REPAIR SUMMARY")
    print(f"  files to change : {len(changed)}")
    print(f"  already correct : {unchanged}")
    print(f"  no pre source   : {len(no_pre)}")
    print(f"  named tag coverage (targets): {named_hits}")
    print()
    if not args.apply and not args.dry_run:
        print("(dry run — pass --apply to write, or --dry-run for detail)")

    if args.dry_run:
        print("\nDETAIL (first 15):")
        for rel, cur, target, pre_path in changed[:15]:
            print(f"  {rel}")
            print(f"    cur : {cur}")
            print(f"    tgt : {target}")
            print(f"    pre : {pre_path}")

    if args.apply:
        for rel, cur, target, pre_path in changed:
            print(f"  repaired {rel}")


if __name__ == "__main__":
    main()
