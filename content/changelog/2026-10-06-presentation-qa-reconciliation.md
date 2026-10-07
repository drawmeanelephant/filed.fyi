---
title: "Presentation QA Counts and Prior Coverage Reconciled"
parent: changelog
status: published
tags: ["changelog", "documentation"]
---

# Presentation QA Counts and Prior Coverage Reconciled

**Maintenance ID:** 0.1.00046.presentation-qa-reconciliation
**Date:** 2026-10-06
**Scope:** collection count lines, README census, historical coverage report, finalization count check

## What changed

- Recounted every collection, including all 49 nested reference records. Corrected aphorisms 563 → 542, haikus 577 → 520, limericks 576 → 551, and lorelog 187 → 189. Changelog was accurate at 63 after #609; this docket makes 64.
- Corrected README from 2,265 pages / 2,254 satellites to 2,269 / 2,258, including this docket. The 11 trunks are the home page and ten collection roots.
- Read all 11 trunks and all 21 merged emphasis dockets in full; inspected their net first-parent changes. Recorded discrepancies and exact coverage paths in `reports/presentation-qa-reconciliation.md` and its evidence table. Historical reading remains unknown, not inferred from edits.
- Added a read-only count check and focused regressions for the single finalization lane. No allocation or editorial decision is automated.

## What was deliberately left alone

- Historical dockets, verification claims, numbering gaps, case variants, duplicated prose, metadata, canonical IDs, and record formatting remain as found. On 2026-10-06 the maintainer explicitly approved preservation of repeated historical maintenance sequences, identified by full docket strings and source paths.
- `APH-fref-0650-pbc.md` and `APH-fref-0661-agbx.md` remain in the read-first population. Their previous review is unknown; they were inside the old claimed range but not changed by #608.
- #610 owns the workload scope/preservation validator, its tests, baseline usage, and CI wiring. Those files were not changed here.

## Verification performed

- `python3 scripts/test_collection_counts.py` passed all 11 tests with no skips, including exact first-parent coverage checks. `python3 scripts/check_collection_counts.py` passed all collection and README counts: 2,269 pages, 11 trunks, 2,258 satellites.
- `./scripts/ensure-boris.sh` initially failed because the compiler was absent. `./scripts/ensure-boris.sh --provision` then provisioned pinned Boris `07dc0d3cc101d86682ec92e06ba00edef9d90c75`.
- `./bin/validate_graph.sh` passed: graph diagnostics, Markdown links, Cantilever compilation, verse residue, zero duplicate HTML IDs, and byte-for-byte publication certification. `git diff --check` passed.
- Inspected compiled articles for the five corrected trunks, this docket, and unchanged reference at 1440×900 and 390×844. Counts, headings, emphasis, overflow, and in-page anchors passed. The initial browser binding failure was recovered using the existing preview tab; no screenshot-based review is claimed.

## Unresolved follow-up

- Rebase and repeat shared finalization against current `main`, including any #610 docket, before merge. No maintenance sequence is reserved against concurrent work.
- Require independent review and successful repository `validate`, `publish-export`, and aggregate `ci` checks before merge. This correction does not approve a pilot or certify earlier reading.
