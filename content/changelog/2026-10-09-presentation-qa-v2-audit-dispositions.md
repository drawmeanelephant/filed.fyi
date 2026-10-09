---
title: "Presentation QA v2 — Audit Dispositions and Baseline Codifications"
parent: changelog
status: published
tags: ["changelog", "presentation", "process"]
---

# Presentation QA v2 — Audit Dispositions and Baseline Codifications

**Maintenance ID:** 0.1.00249.presentation-qa-v2-audit-dispositions
**Date:** 2026-10-09
**Scope:** `content/lorelog/LLG-0318-SRO.md`, `docs/presentation-qa-baseline.md`, `content/changelog/`

## What changed

- Repaired a missing apostrophe in `LLG-0318-SRO` ("the archives newfound flexibility" → "the archive's newfound flexibility"). One of four `needs decision` orphans from the lorelog coverage audit (issue #949); maintainer ruled it a plain typo with no ambiguity value.
- Codified three lorelog-audit rulings into `docs/presentation-qa-baseline.md` (pass-2 Implementation notes): short form codes stay plain inside quotations/verse/headings/citation summaries; code spans nested inside existing emphasis are sanctioned; wiki links inside heading text are permitted with the heading anchor verified. Also recorded that compound-split code spans (`` `PPC-9`'s ``-style) are a per-record judgment call, not a defect.

## What was deliberately left alone

- `TSA-SESSION-SCHEDULE`'s phantom asterisk — the document claims an asterisk appears beside Session D1 that does not exist anywhere in the file, followed by "No further explanation is filed." Maintainer ruled it intentional residue; no repair.
- `LLG-0453`'s `**Defining Action**:` colon inconsistency and `LLG-0322-FTD`'s missing `relations` edge to `LLG-0324-MAP` — both already dispositioned under PR #968 (`maint(833): residue dispositions`) before this docket was written. Verified on `origin/main`: all five labels now read `**Defining Action:**` and the `relates_to=lorelog/LLG-0324-MAP` edge is present.

## Verification performed

- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh`: see PR body for exact outcome.
- `python3 scripts/check_collection_counts.py`: see PR body for exact outcome.

## Unresolved follow-up

- Issue #950 (reference scoping) is unblocked by the audit verdict; its proposed slice plan is pending maintainer approval as an issue comment.
