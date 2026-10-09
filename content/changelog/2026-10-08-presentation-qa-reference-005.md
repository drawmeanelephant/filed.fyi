---
title: "Presentation QA Reference 005: Empathegy Continuity Doctrine Pivots"
parent: changelog
status: published
tags: ["changelog", "presentation", "reference"]
---

# Presentation QA Reference 005: Empathegy Continuity Doctrine Pivots

**Maintenance ID:** 0.1.00215.reference-005
**Date:** 2026-10-08
**Scope:** `content/reference/empathegy/fref-0600-ccph.md`, `content/reference/empathegy/fref-0610-cthr.md`, `content/reference/empathegy/fref-0620-cwsh.md` (issue #776)

## What changed

- `fref-0600-ccph.md` line 26: bolded `crossed from translation into laundering` — the Foundational Rule's pivot, which the record's five phrase classes operationalize.
- `fref-0610-cthr.md` line 107: bolded `prevent the archive from forgetting that reliance was there` — the Register Note's telos, the record's stated reason for existing.
- `fref-0620-cwsh.md` line 165: bolded `protected from contradiction instead of tested by it` — the definitional boundary closing the Distinguishing Rules section.
- Emphasis markers only. No words, order, links, frontmatter, or anchors changed.

## What was deliberately left alone

- All documentary residue: the generated Related Aphorisms sentence pairs, duplicate-anchor headings (`{#continuity-*-N}`), the `## Haikus` / `## Archival Residue` subheadings, and all Related Haikus / Related Limericks verse including two-space hard breaks. The stray limerick about pencils at `fref-0600-ccph.md` lines 422-426 remains.
- `fref-0610-cthr.md` line 106 `The Registers purpose` — a likely missing apostrophe (`Register's`). A word-level correction is outside presentation scope; flagged on #776 as needs decision.
- Every other line of all three records. Each already reads plainly and earned no further emphasis.

## Verification performed

- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./bin/validate_graph.sh`: PASS (see PR body for exact output).
- `python3 scripts/check_collection_counts.py`: PASS after recounting the changelog trunk to actual.
- Compiled articles for all three records inspected: each renders a single `<strong>` span at the intended line; verse blocks and residue headings unchanged.

## Unresolved follow-up

- `fref-0610-cthr.md` line 106 missing apostrophe — recorded as needs decision on #776 for maintainer adjudication.
