---
title: "Presentation QA v3 A-M2: crosslink apply on 33 mascot records"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "mascots"]
---

# Presentation QA v3 A-M2: crosslink apply on 33 mascot records

**Maintenance ID:** 0.1.00270.presentation-qa-v3-a-m2
**Date:** 2026-10-09
**Scope:** `content/mascots/` — issue #1011 pass-3 Track A crosslink-apply slice A-M2 (33 records, 83 manifest rows)

## What changed

Eighty-three adjudicated wiki links were applied to 33 mascot records from the post-fixup apply manifest (`decision == "apply"`, `content/mascots/261.footnote-pallbearer.md` through `content/mascots/938.vantage-hollow.md`). Each citation was verified at its actual location and rewritten as `[[adjudicated_target_id|matched_text]]`, with the matched surface text preserved byte-for-byte inside the label.

- 69 A1 name-mention rows and 14 A2 identifier-token rows; zero A3 relative-link rows in this slice.
- Manifest line numbers were uniformly four lines short of current content, consistent with the merged B1 `## Image`/`Alt-text:` insertions. Each link was therefore placed at the true first eligible occurrence rather than the stale cited line.
- Density rule held: first eligible (non-heading, non-protected) occurrence per page × target; later eligible mentions were left plain.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, relations, statuses, verse tails, and every word outside the eighty-three matched spans.
- Earlier occurrences inside inline code spans (e.g. backtick-quoted names in network rosters on 404, 409, 412) were skipped per the protected-region rules; the links landed on the first eligible prose occurrence.
- A second `Sealward Proxy-9` self-mention inside the record's own verse headings on 677 was left plain.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for outcome.
- Compiled-HTML inspection of changed pages under `dist/cantilever/` — see PR body.

## Unresolved follow-up

- None. All 83 in-scope `apply` rows were applied; zero rows were skipped or flagged.
