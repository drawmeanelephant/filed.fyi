---
title: "Corporate Fellowship: Charter, Steward, and Verse"
parent: changelog
status: published
tags: ["changelog", "lorelog", "mascots", "aphorisms", "limericks", "managed-absence"]
---

# Corporate Fellowship: Charter, Steward, and Verse

**Maintenance ID:** 0.1.00299.corporate-fellowship
**Date:** 2026-11-25
**Scope:** `content/lorelog/`, `content/mascots/`, `content/aphorisms/`, `content/limericks/`. Four greenfield records, plus this docket.

## What changed

- `content/lorelog/LLG-0940-CORPORATE-FELLOWSHIP.md`, `lorelog/LLG-0940-CORPORATE-FELLOWSHIP`. Charter of an executive social club filed under CAAR, AAOA, and LCGU at once: governance table, three rituals, directive conflict profile, membership roll excerpt.
- `content/mascots/939.fellowship-steward.md`, `mascots/M-0939` "Fellowship Steward", status `archived` per mascot convention. Keeper of a roster whose members do not attend.
- `content/aphorisms/APH-939.fellowship-steward.md`, `aphorisms/APH-0939`.
- `content/limericks/LIM-LLG-0940-FEL.md`, `limericks/LIM-LLG-0940-FEL`. Six limericks and three prose sections.
- Trunk `Count:` lines updated: lorelog 209 -> 210, mascots 257 -> 258, aphorisms 566 -> 567, limericks 575 -> 576, changelog 251 -> 252. README totals updated by five.

## What was deliberately left alone

- Existing records. Relations point outward from the four new records only; nothing they cite was edited to point back.
- The prose sections in the limerick record. They were authored with it and are not limericks. They stay where they were filed.

## Verification performed

- `./bin/validate_graph.sh` passed: collection counts and README totals match source, verse hard-break check reported 0 violations, Boris graph diagnostics passed, Cantilever compile and certification passed.
- `python3 scripts/test_relationship_repair.py` passed.
- `./scripts/filed-publish.sh` completed; `reports/relationship-integrity.md` does not show FINDINGS.
