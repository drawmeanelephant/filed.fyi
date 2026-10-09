---
title: "Presentation QA v3 A-R2: Crosslink apply on reference and releases records"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "reference", "releases"]
---

# Presentation QA v3 A-R2: Crosslink apply on reference and releases records

**Maintenance ID:** 0.1.00273.presentation-qa-v3-a-r2
**Date:** 2026-10-09
**Scope:** `content/reference/**` above `empathegy/fref-0780-rsfl.md` in string order, plus `content/releases/` — pass-3 Track A crosslink-apply slice A-R2 (issue #1015), 43 files, 127 adjudicated manifest rows

## What changed

- Applied all 127 `apply` rows from the adjudicated apply manifest (`apply-manifest.tsv`, post-fixup) in the A-R2 slice: `decision == "apply"`, `source_path` not under `content/mascots/` or `content/lorelog/`, and `source_path` string-greater than `content/reference/empathegy/fref-0780-rsfl.md`. Every row in scope was class A1 (verbatim name-mention → `[[adjudicated_target_id|matched_text]]`); no A3 relative-link conversions fell in this slice's range.
- Each matched text was verified verbatim at its cited line and confirmed outside protected regions (frontmatter, headings, blockquotes, fenced/inline code, verse regions, `## Related *` tails, `## Incident Anchors`/`## Annex Signals` link-index sections, existing link syntax) before insertion. Labels preserve the source spelling byte-for-byte.
- All 74 distinct adjudicated targets resolve against canonical `id:` values (or path-derived trunk ids) in the corpus.
- Recounted `content/changelog/` source records, including this docket, and set the trunk's `Count:` to match. README totals updated to match source.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, relations, statuses, `{#...}` anchors, verse tails, stanza structure, and two-space hard breaks.
- Later same-target mentions on each page (density rule: first non-heading occurrence only) and every `held`, `flag`, and `drop` manifest row.
- `content/posts/*`, `content/index.md`, `content/guides/*`, and lower-`reference/` apply rows — they fall at or below the slice boundary and belong to sibling slices.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for outcome.
- Compiled-HTML inspection of changed pages — see PR body.

## Unresolved follow-up

- Maintenance ID 0.1.00270 is claimed by sibling slices (a-r1, a-m1, a-m2) in flight; this docket takes 0.1.00271 to avoid collision per the convention's renumber rule.
