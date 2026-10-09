---
title: "Presentation QA Reference 004: Read-First Review of Three Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA Reference 004: Read-First Review of Three Records

**Maintenance ID:** 0.1.00214.reference-004
**Date:** 2026-10-08
**Scope:** `content/reference/empathegy/` — the three records assigned by workload issue #775

## What changed

- Read all three assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue appended to each.
- `fref-0570-celc.md` line 243: bolded "a property of the archive, not the person" in "This is a property of the archive, not the person.", the closing line of Survivability Factors. Asterisks only.
- `fref-0590-cpsp.md` line 16: bolded "production of silence under pressure" in "It is the production of silence under pressure.", the definitional pivot of the Purpose section. Asterisks only.
- `content/changelog.md`: trunk count incremented to match source after this docket.

## What was deliberately left alone

- All frontmatter, canonical IDs, tags, headings, `{#...}` anchors, two-space hard breaks in the haiku and limerick sections, tables, taxonomy lists, and quoted/documentary material.
- `fref-0580-cmps.md` — left untouched. Its final body line (line 145, "It is simply not the whole value claim such systems sometimes mak") is truncated mid-word, a non-formatting defect. Per the baseline, the record stays as it is and the defect is flagged `needs decision` on issue #775 rather than repaired or worked around.
- Residue preserved, not corrected: `fref-0570-celc.md` line 86 "The subjects account" and line 252 "Coverage Axis Note" label without punctuation; `fref-0580-cmps.md` line 139 "a subjects dignity"; `fref-0590-cpsp.md` lines 13 "a systems visible complaint volume" and 121 "the institutions preferred dialect" (apostrophes absent — consistent with corpus-wide residue, cf. `2026-10-07-presentation-qa-reference-013.md`).
- The stray limerick in `fref-0580-cmps.md` lines 293–297 ("The box has been sealed with a string…") bears no visible relation to Compassion Surfaces. Related Limericks blocks are protected residue; flagged, not normalized.

## Verification performed

- `git diff 8997eebee2a4e620c5dd47fcea97abf515c4cac6 HEAD` on all three assigned paths: no changes since the issue snapshot.
- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./bin/validate_graph.sh` passed.
- `python3 scripts/check_collection_counts.py` passed.
- Rendered-HTML diff confirmed each changed record differs only by one `<strong>` pair.

## Unresolved follow-up

- `fref-0580-cmps.md` line 145 truncation (`needs decision`, awaiting maintainer).
