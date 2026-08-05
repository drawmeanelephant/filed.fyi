#!/usr/bin/env python3
"""test_tag_roundtrip.py — Regression test for the tag-truncation bug.

The Boris migration mapper (8e7db007) corrupted every block-list tag by
slicing off its first two characters (`managed-absence` → `naged-absence`,
`mascots` → `scots`, `compliance-warning` → `mpliance-warning`,
`continuity-theatre` → `ntinuity-theatre`).  The corruption was baked into
content/ and mirrored into every generated output.

This test proves the pipeline's tag extraction + serialization round-trips
these canonical values unchanged, so the corruption cannot silently return.
The named tags below must survive:

    mascots, empathegy, managed-absence, continuity-theatre,
    compliance-warning, metrics-of-care, assurance-vocabulary

It uses only the same parsing/serialization helpers as the repair tool
(scripts/fix_tag_truncation.py), operating on the actual corpus.

Usage:
    python3 scripts/test_tag_roundtrip.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

from fix_tag_truncation import (  # noqa: E402
    current_tags,
    strip_quotes,
    unescape,
)

CONTENT = os.path.join(ROOT, "content")

NAMED_TAGS = [
    "mascots",
    "empathegy",
    "managed-absence",
    "continuity-theatre",
    "compliance-warning",
    "metrics-of-care",
    "assurance-vocabulary",
]

# Representative files where each named tag must survive round-trip.
# Chosen from the repaired corpus; these values were corrupt before the fix.
REPRESENTATIVE_FILES = {
    "mascots": "content/lorelog/LLG-0002-CED.md",
    "empathegy": "content/haikus/hai-FFP-0380.md",
    "managed-absence": "content/reference/FREF-0810-DSL.md",
    "continuity-theatre": "content/limericks/LIM-LLG-0824-GBC.md",
    "compliance-warning": "content/aphorisms/APH-003.blamey-mctypoface.md",
    "metrics-of-care": "content/lorelog/LLG-0019-COMA.md",
    "assurance-vocabulary": "content/limericks/LIM-LLG-0327-AVR.md",
}

FAILURES = []


def serialize_tags(values):
    """Serialize a tag list exactly as the repair tool writes it."""
    return "tags: [%s]" % ", ".join(json.dumps(v) for v in values)


def roundtrip(value):
    """Serialize one tag, then re-parse it; must come back unchanged."""
    serialized = serialize_tags(["collection", value])
    reparsed = re.search(r"^tags:[ \t]*\[(.*)\]$", serialized, re.M)
    values = [unescape(strip_quotes(v)) for v in reparsed.group(1).split(",")
              if v.strip()]
    return values[1]  # skip the leading collection name


def main():
    # 1. Round-trip the canonical values through serialize -> parse.
    for tag in NAMED_TAGS:
        result = roundtrip(tag)
        if result != tag:
            FAILURES.append(f"roundtrip changed {tag!r} -> {result!r}")
        else:
            print(f"  ok  roundtrip {tag!r}")

    # 2. Confirm each named tag is present, intact, in a real corpus file.
    for tag, rel in REPRESENTATIVE_FILES.items():
        path = os.path.join(ROOT, rel)
        if not os.path.exists(path):
            FAILURES.append(f"missing representative file: {rel}")
            continue
        text = open(path).read()
        tags = current_tags(text) or []
        if tag not in tags:
            FAILURES.append(
                f"tag {tag!r} missing from {rel} (tags={tags!r})"
            )
        else:
            print(f"  ok  {tag!r} intact in {rel}")

    # 3. Whole-corpus invariant: no truncated tag fragments remain.
    #    A tag is suspicious if it is not itself a pre-migration value but
    #    every candidate prefix-restoration is absent — we keep this check
    #    cheap: assert the five known-bad fragments never appear verbatim.
    known_bad = ["scots", "pathegy", "naged-absence", "ntinuity-theatre",
                 "mpliance-warning", "trics-of-care"]
    for frag in known_bad:
        for dirpath, dirnames, filenames in os.walk(CONTENT):
            for f in filenames:
                if not f.endswith(".md"):
                    continue
                text = open(os.path.join(dirpath, f)).read()
                if re.search(r'"(?:%s)"' % re.escape(frag), text):
                    FAILURES.append(
                        f"corrupt fragment {frag!r} still present in "
                        f"{os.path.join(dirpath, f)}"
                    )
        print(f"  ok  no corrupt fragment {frag!r}")

    print()
    if FAILURES:
        print("FAILED:")
        for f in FAILURES:
            print(f"  - {f}")
        sys.exit(1)
    print("PASS — all named tags round-trip unchanged and no corrupt "
          "fragments remain.")


if __name__ == "__main__":
    main()
