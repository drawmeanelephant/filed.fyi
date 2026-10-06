---
title: "Editorial Emphasis Pass 03: Aphorism Records 51–75"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "editorial-emphasis"]
---

# Editorial Emphasis Pass 03: Aphorism Records 51–75

**Maintenance ID:** 0.1.00033.emphasis-pass-03
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-057 through APH-082, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark terms of art, wry asides, and each record's own loaded vocabulary ("ancestry of excuses", "managed absence", "index dust", "detached from repair", the birth-time motif "3:12 AM" at both occurrences). Bold is capped at one per record, for the pivot sentence or slogan ("Plug in. Pay up. Pray.", "Three separate stories sharing a single case number.", "Synergy achieved.").
- Two records received italics-only treatment with no bold, matching their hushed register: APH-072 (Deprecatia Fade) and APH-078 (SI-9 Interval Witness).
- Haiku-shaped stanzas remain unmarked; the LLG cross-references in APH-079 remain untouched plain-text scaffolding.

## Watermark for the next run

- Records 51–75 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 75 is `content/aphorisms/APH-082.ma-lcgu-porter.md`.
- The next run resumes at record 76: `content/aphorisms/APH-083.ac-11-sealloop-auditor.md`.
- Run cap is 25 records per run. Records 076+ belong to the register-naming class (AV-14, CE-5, SI-9, SC-Λ, BX-6, LX-2, MA-LCGU, AC-11...); they were handled with the same rules and no containment-sensitive vocabulary was introduced.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (quoted phrases such as 'before' and 'never', shout-caps, `SC-Λ` glyph, `C:\`) were not modified.
- APH-057 was carried over from run 02's watermark and received its judged touches first in this run.
- The "legally X" gag family (legally unapproachable, legally qualifies, legally supersedes) was marked only where it is a record's central payload (APH-069, APH-054 in run 02), not on every occurrence, to avoid a repeated-marking tic.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (43 → 44); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 2,171 records remain in the emphasis queue.
