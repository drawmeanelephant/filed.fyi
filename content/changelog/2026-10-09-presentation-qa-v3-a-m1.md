---
title: "Presentation QA v3 A-M1: crosslinks applied to 47 mascot records"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "mascots"]
---

# Presentation QA v3 A-M1: crosslinks applied to 47 mascot records

**Maintenance ID:** 0.1.00272.presentation-qa-v3-a-m1
**Date:** 2026-10-09
**Scope:** `content/mascots/` — issue #1010 pass-3 A-track apply slice A-M1 (files `003.blamey-mctypoface.md` through `260.sidebar-mercy.md`, inclusive)

## What changed

95 adjudicated `apply` rows from the pass-3 manifest (post-fixup `apply-manifest.tsv`) were applied as Boris wiki links of the form `[[adjudicated_target_id|verbatim matched text]]`. 86 A1 name-mention rows and 9 A2 ID-token rows; no A3 rows exist in this slice. Labels preserve the matched surface text byte-for-byte, including `™`, non-breaking hyphens, and original casing. No words, order, IDs, frontmatter, or other formatting were modified.

All cited line numbers were stale by a uniform +4 (occasionally +2) because the manifest was adjudicated before the merged B1 `## Image` sections landed on `main`. Every row was relocated to its true first eligible occurrence per the apply protocol; all relocations resolved to the same passage the census cited.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, relations, and statuses.
- The 17 in-scope `flag`/`held`/`drop` rows — adjudicated non-apply decisions stand (e.g. `LLG-08xx-EPS` held pending the #970 alias ruling, `COMA-19` exclusion, dangling tokens).
- Verse sections, `## Related *` tails, headings, blockquotes, fenced code, and existing emphasis (link labels sit inside existing `**`/`__` emphasis markers untouched).
- Records carrying zero `apply` rows in this range were not opened for editing.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for outcome.
- Compiled-HTML inspection of changed pages in `dist/cantilever/mascots/` — see PR body.

## Unresolved follow-up

- None from this slice. Rows the apply protocol could not place would have been flagged to #992; all 95 rows placed.
