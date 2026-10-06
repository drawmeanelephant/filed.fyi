---
title: "Editorial Emphasis Pass 04: Aphorism Records 76–100"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "editorial-emphasis"]
---

# Editorial Emphasis Pass 04: Aphorism Records 76–100

**Maintenance ID:** 0.1.00034.emphasis-pass-04
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-083 through APH-221, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark terms of art, wry asides, and each record's own loaded vocabulary ("twelve layers of stamped approval", "somnambulant follow-up form", "un-grow", "high-fructose paradigm shift"). Bold is capped at one per record, for the pivot sentence or motto ("Success is just failure with better lighting.", "Crumble sweet, heal complete.", "A critical finding is merely a typographical error waiting for the right level of executive redaction.").
- Cross-record motif recurrences were marked consistently: "misfiles with conviction" (six occurrences: APH-121, 205, 214, 215, 217, 218), "a footnote that learned to walk" (APH-213, 220), "in triplicate" (APH-201, 212), "Rot is not decay here—it is governance." (APH-216, 221).
- APH-211 (Apex Goldbricker) is a sparser variant record — no haiku, no "Aphorisms" heading suffix — and was emphasized under the same rules.

## Watermark for the next run

- Records 76–100 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 100 is `content/aphorisms/APH-221.mccrisp-agent.md`.
- The next run resumes at record 101: `content/aphorisms/APH-222.slidey-deckworm.md`.
- Run cap is 25 records per run. The numbering gap between APH-085 and APH-121, and between APH-121 and APH-201, is preserved as found.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (shout-caps such as `ALPHA BATCH`, the `!.` double punctuation in APH-204, quoted phrases, the `SC-Λ` glyph family) were not modified.
- Haiku-shaped stanzas remain unmarked throughout the orchard/condiment/fuel mascot block.
- The "legally X" gag family was left plain at every occurrence in this run (APH-215, 216, 220), reserving marks for other payloads to avoid a repeated-marking tic.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (44 → 45); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 2,146 records remain in the emphasis queue.
