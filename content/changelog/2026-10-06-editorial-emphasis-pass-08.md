---
title: "Editorial Emphasis Pass 08: Aphorism Records 176–200"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "editorial-emphasis"]
---

# Editorial Emphasis Pass 08: Aphorism Records 176–200

**Maintenance ID:** 0.1.00038.emphasis-pass-08
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-297 through APH-323, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark terms of art, wry asides, and each record's own loaded vocabulary ("margins" into which shouting is fitted, "runes of wasted potential", "dump truck full of urgent tasks", "load-bearing architecture", "lullaby of prerequisites", "ornamental risk"). Bold appears twice: APH-304's "You cannot opt out of being saved." and APH-309's callback couplet "Cut once, claimed thrice." (marked at both occurrences).
- APH-304 (Brother Optout Pending) is containment-sensitive material (opt-out, consent-loop, archival custody). The record explicitly involves these subjects and is permitted to speak of them; it was handled with maximum restraint — three italics and one bold, nothing invented.
- The "misfiles with conviction" motif recurred in APH-301 (seventh occurrence overall) and was marked. The "suggestion" motif recurred in APH-306 and was marked.
- Meta-touches: APH-299's "The approval is in *bold font*." joins APH-261's asterisk burial in the pass's self-referential set.

## Watermark for the next run

- Records 176–200 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 200 is `content/aphorisms/APH-323.caveat-snowglobe.md`.
- The next run resumes at record 201: `content/aphorisms/APH-324.complimentary-ghostline.md`.
- Run cap is 25 records per run. Numbering gaps at 302/303 are preserved as found.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (quoted phrases such as 'Good Enough for Now', 'f2x%9', 'PLEASE DO NOT SHUT OFF THE POWER') were not modified.
- The longer echo/residue paragraphs in APH-300, 305–308, 312–316, and 319–323 remain plain per the convention; the warm elegies in APH-313 and APH-314 were also left unmarked past their terse openings.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (48 → 49); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 2,046 records remain in the emphasis queue.
