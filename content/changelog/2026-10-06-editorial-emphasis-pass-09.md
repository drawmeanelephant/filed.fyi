---
title: "Editorial Emphasis Pass 09: Aphorism Records 201–225"
parent: changelog
status: published
tags: ["aphorisms", "changelog", "editorial-emphasis"]
---

# Editorial Emphasis Pass 09: Aphorism Records 201–225

**Maintenance ID:** 0.1.00039.emphasis-pass-09
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-324 through APH-426, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- This block crosses into the large HTTP-status mascot records (APH-400 through APH-426), several of which carry 17–33 one-line aphorisms plus residue paragraphs and verbatim duplicates. These received the sparse treatment: 4–5 marks per record on the standout lines, residue paragraphs plain, duplicated paragraphs left identically plain (APH-404, 408, 415, 422, 424).
- APH-405 (Method Not Allowed Mel) already contained its own emphasis (*sunset* / *extinguish*); existing formatting was left untouched and no marks were added to that line.
- Bold appears twice: APH-404's opener "You shouldn't be here." Motif recurrences marked: "misfiles with conviction" (8th occurrence, APH-404), "a footnote that learned to walk" (3rd, APH-418), "the tense of almost" (APH-417, echoing APH-007), "folklore" (APH-325, APH-408).
- The "a suggestion" motif was left plain in APH-409's residue block per the residue convention.

## Watermark for the next run

- Records 201–225 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 225 is `content/aphorisms/APH-426.old-wire-pilgrim.md`.
- The next run resumes at record 226: `content/aphorisms/APH-428.safekeeping-clause.md`.
- Run cap is 25 records per run. Numbering gaps (328–399, 401–402, 406–407, 419–420, and others) are preserved as found.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (quoted phrases, the existing asterisks in APH-405, the tag recitation in APH-418) were not modified.
- The residue-family paragraphs throughout the HTTP-status block (APH-408, 409, 410, 411, 412, 413, 415, 416, 422, 423, 424) remain plain.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (49 → 50); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 2,021 records remain in the emphasis queue.
