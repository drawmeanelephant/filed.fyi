---
title: "Presentation QA v2 Rubric Addendum — Rich Structure Transforms"
parent: changelog
status: published
tags: ["changelog", "presentation", "process"]
---

# Presentation QA v2 Rubric Addendum — Rich Structure Transforms

**Maintenance ID:** 0.1.00230.presentation-qa-v2-rubric
**Date:** 2026-10-08
**Scope:** `docs/presentation-qa-baseline.md`, `content/changelog/`

## What changed

- Appended a "Pass 2 — rich structure" addendum to the presentation baseline, defining the allowed transform set for second-pass slices: identifier→code span, enumeration→list, run-in labels, preserved-fragment→blockquote, annex→`<Details>`/`<Aside>`, tabular→table, record mention→wiki link, provenance tail→footnote, and uncapped-but-earned emphasis.
- Added a pass-2 reviewer checklist to the merge gate.
- Lifted the pass-1 one-bold-pivot cap for pass-2 slices only; pass-1 rules remain in force for any open pass-1 issues.
- Wiki-link conversion is documented as an evidence-layer edit: Boris resolves `[[id]]`/`[[id|label]]` against the frozen graph and hard-errors on missing targets (verified against `boris check` in a scratch graph, including `<Details summary>` and `<Aside kind>` attribute allowlists).

## What was deliberately left alone

- The pass-1 rubric, merge gate, and reviewer checklist — retained verbatim for in-flight pass-1 issues.
- All `content/` records. This docket changes process, not the archive.
- Natural-language crosslinking (linking phrases rather than ID tokens) — explicitly deferred to case-by-case maintainer calls, not slice work.

## Verification performed

- `BORIS_BIN=~/.local/bin/boris ./bin/validate_graph.sh`: see PR body for exact outcome.
- `python3 scripts/check_collection_counts.py`: see PR body for exact outcome.
- Wiki-link and component syntax verified against `boris check` on a scratch input graph (missing targets produce `EREFERENCEMISSING`; `<Details>` requires `summary`, `<Aside>` requires allowlisted `kind`/`id`).

## Unresolved follow-up

- The pass-2 addendum takes effect only on maintainer approval of this PR, per the baseline's own preamble.
- Pass-2 slice issues (lorelog-first pilot) are tracked under the milestone, not here.
