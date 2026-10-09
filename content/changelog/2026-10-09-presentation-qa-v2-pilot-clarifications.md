---
title: "Presentation QA v2 Rubric Clarifications — Pilot Findings"
parent: changelog
status: published
tags: ["changelog", "presentation", "process"]
---

# Presentation QA v2 Rubric Clarifications — Pilot Findings

**Maintenance ID:** 0.1.00247.presentation-qa-v2-pilot-clarifications
**Date:** 2026-10-09
**Scope:** `docs/presentation-qa-baseline.md`, `content/changelog/`

## What changed

- Added an "Implementation notes (pilot findings)" subsection to the pass-2 addendum, codifying four clarifications raised by the independent review of the lorelog pilot (PR #966):
  - Code spans follow token shape, not grammatical role; spaced title-case designations-as-names stay plain; short form codes may span with per-record consistency.
  - List splits keep conjunctions and punctuation inside items; a lead-in colon on the intro line is a permitted punctuation adjustment.
  - `<Details>`/`<Aside>` `id` preserves the auto-derived heading anchor.
  - The merge gate's formal `APPROVE` must come from an account other than the PR author's (GitHub rejects self-approval; a comment review alone does not satisfy the gate).

## What was deliberately left alone

- The allowed transform list itself — the notes read the list, they do not extend it.
- PR #966's two `needs decision` flags (`**Defining Action**:` colon inconsistency in LLG-0453; `LLG-0324-MAP` cited in-body without a `relations` edge) — maintainer calls, not process text.
- The bare `51-E` span inconsistency between merged lorelog-08 and the pilot's DRIFT-01 handling — recorded as defensible-either-way, and the notes now say why.

## Verification performed

- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh`: see PR body for exact outcome.
- `python3 scripts/check_collection_counts.py`: see PR body for exact outcome.

## Unresolved follow-up

- The 14 lorelog slice issues (#935–#948) are gated on the pilot merging; once #966 and this docket land, slices may be claimed in order.
