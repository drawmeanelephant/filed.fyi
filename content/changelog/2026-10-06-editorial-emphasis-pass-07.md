---
title: "Editorial Emphasis Pass 07: Aphorism Records 151–175"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "editorial-emphasis"]
---

# Editorial Emphasis Pass 07: Aphorism Records 151–175

**Maintenance ID:** 0.1.00037.emphasis-pass-07
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-272 through APH-296, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark terms of art, wry asides, and each record's own loaded vocabulary ("runes of wasted potential", "garden of scope creep", "bandage applied to the air next to the wound", "structural currency", "the silence between the applause lines"). Bold appears only in APH-258-adjacent fashion where a true thesis sentence exists — in this run, none qualified; the block is prose-first and hushed, so the run is italics-only.
- APH-286 (Favorable Beige) explicitly instructs "Do not use bold fonts. Bold fonts invite opinions." The record received italics only, in obedience to its own policy.
- APH-290 and APH-291 close the run; their trailing echo-paragraphs (watermark/pencil, latency/vault variants of earlier residue) remain plain per convention.

## Watermark for the next run

- Records 151–175 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 175 is `content/aphorisms/APH-296.gown-of-recognition.md`.
- The next run resumes at record 176: `content/aphorisms/APH-297.minute-absolution.md`.
- Run cap is 25 records per run.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (single-quoted phrases such as 'learnings and growth', 'Key Stakeholder', 'out of an abundance of caution') were not modified.
- The residue-family paragraphs in APH-279, 282, 283, 284, 285, 287, 288, 291, 292, 293, 294, 295, and 296 remain plain, consistent with the convention established in earlier runs.
- The "legally X" family did not recur in this block.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (47 → 48); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 2,071 records remain in the emphasis queue.
