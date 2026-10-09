---
title: "Presentation QA v3 A-R1: crosslink apply on guides, posts, index, and reference (first range)"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "reference", "guides", "posts"]
---

# Presentation QA v3 A-R1: crosslink apply on guides, posts, index, and reference (first range)

**Maintenance ID:** 0.1.00271.presentation-qa-v3-a-r1
**Date:** 2026-10-09
**Scope:** `content/guides/`, `content/posts/`, `content/index.md`, and `content/reference/**` through `content/reference/empathegy/fref-0780-rsfl.md` — issue #1014 pass-3 A-track apply slice A-R1 (138 manifest rows across 38 files)

## What changed

Adjudicated crosslinks from the pass-3 apply manifest were applied mechanically. No prose was authored, reordered, or modified; only link syntax changed.

- 44 A3 rows: relative `.md` links converted to `[[canonical-id|label]]` form with the visible label preserved byte-for-byte.
- 92 A1 rows: verbatim record-title mentions wrapped as `[[adjudicated_target_id|matched_text]]` at the first eligible non-heading occurrence per page, per the density ruling.
- Labels preserve the matched source text exactly, including spelling, case, and punctuation.

## What was deliberately left alone

- Two manifest rows in `content/reference/directives/tri-directive-doctrine.md` (lines 14–15): the adjudicated targets `lorelog/LLG-0051-E` and `lorelog/LLG-0114-SOMA` were already linked on the same lines, so the rows were skipped per the double-link rule and flagged on the PR.
- All later same-target mentions on each page, per the first-occurrence density ruling.
- All frontmatter, canonical IDs, titles, tags, relations, statuses, verse tails, and unrelated prose.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for outcome.
- Compiled-HTML inspection of changed pages in `dist/cantilever/` — see PR body.
