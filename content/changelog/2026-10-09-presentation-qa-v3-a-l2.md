---
title: "Presentation QA v3 A-L2: crosslinks applied on 30 lorelog records"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "lorelog", "crosslinks"]
---

# Presentation QA v3 A-L2: crosslinks applied on 30 lorelog records

**Maintenance ID:** 0.1.00274.presentation-qa-v3-a-l2
**Date:** 2026-10-09
**Scope:** `content/lorelog/` — issue #1013 Track A crosslink-apply slice A-L2 (`LLG-0408-AH1` through `map-inc-14`, 30 records, 56 manifest rows)

## What changed

56 adjudicated wiki links were applied from the post-fixup `apply-manifest.tsv`: verbatim `title:` surface mentions wrapped as `[[canonical-id|matched-text]]`, labels preserving the source text byte-for-byte. One link per (page × target) at the first eligible occurrence, per the density ruling. All rows were class A1 name-mentions; targets resolve to `limericks/` (38), `aphorisms/` (10), `haikus/` (3), and the `lorelog` trunk (5).

Every cited position was re-verified before editing: matched text present verbatim at the cited line, the line outside frontmatter, headings, blockquotes, fences, verse sections, `Related` tails, existing link syntax, and inline code; the occurrence confirmed as the first eligible one under leftmost-longest title shadowing. All 56 rows applied at their cited lines; none required relocation.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, relations, statuses, and prose. Only `[[ ]]` was inserted; no words, order, or punctuation changed.
- Verse tails (`## Related Aphorisms`/`Haikus`/`Limericks` and `###`-headed verse bodies), which remain unlinked by design.
- Later eligible mentions of each linked target on the same page — density ruling links first occurrence only.
- Manifest rows adjudicated `flag`/`held`/`drop` in this path range, which stay plain pending rulings.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for outcome.
- Compiled-HTML inspection of changed pages in `dist/cantilever/lorelog/` — see PR body.

## Unresolved follow-up

- None from this slice; zero rows flagged at apply time.
