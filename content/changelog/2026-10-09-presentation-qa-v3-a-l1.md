---
title: "Presentation QA v3 A-L1: crosslink apply on 56 lorelog records"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "lorelog"]
---

# Presentation QA v3 A-L1: crosslink apply on 56 lorelog records

**Maintenance ID:** 0.1.00270.presentation-qa-v3-a-l1
**Date:** 2026-10-09
**Scope:** `content/lorelog/` — issue #1012 pass-3 A-track apply slice A-L1 (`content/lorelog/DS-404-ALPHA.md` through `content/lorelog/LLG-0407-SSP.md`, manifest row order)

## What changed

105 adjudicated `[[canonical-id|label]]` wiki links were inserted into 56 lorelog records, driven row-for-row by the post-fixup `apply-manifest.tsv` (`decision == "apply"`). Labels preserve the cited surface text byte-for-byte, including `™` and non-breaking-hyphen residue. No prose was authored, reordered, or altered; only `[[ ]]` was inserted around existing text.

- All cited occurrences verified at their manifest lines; zero relocations were needed — the fixup pass had already re-pointed stale rows to true first eligible occurrences.
- Four links share one line (`LLG-0400-CMA-TSP.md:16`, mascot-name enumeration); applied left-to-right.
- One occurrence landed inside an existing `**bold**` run (`LLG-0400-SCAS.md:32`, `Silence Burden Index`), consistent with the sanctioned emphasis-nesting convention.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, relations, statuses, headings, verse tails (`## Related *` sections), blockquotes, code spans, and fences.
- `LLG-0382-BPD.md:50` — manifest `apply` row for `Gratitude Telemetry Misallocation` → `limericks/LIM-0005` was **flagged, not applied**: the line already links the verse target's primary parent `[[lorelog/LLG-0005|CREDITS-GTA]]`, and the parenthetical title describes that record (the referent-mismatch pattern the adjudication flags). Needs maintainer ruling.
- Later (non-first) mentions of linked entities, per the one-link-per-target-per-page density ruling.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for outcome.
- Compiled-HTML inspection of changed pages in `dist/cantilever/` — see PR body.

## Unresolved follow-up

- The `LLG-0382-BPD.md:50` flag is reported in the PR and to issue #992 for the needs-decision tracker.
