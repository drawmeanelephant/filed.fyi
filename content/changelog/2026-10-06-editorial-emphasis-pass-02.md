---
title: "Editorial Emphasis Pass 02: Aphorism Records 26–50"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "editorial-emphasis"]
---

# Editorial Emphasis Pass 02: Aphorism Records 26–50

**Maintenance ID:** 0.1.00032.emphasis-pass-02
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-028 through APH-056, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark terms of art, wry asides, and each record's own loaded vocabulary ("a future that was canceled", "aesthetic remorse", "Norway", "line 42"). Bold is capped at one per record, for the sentence or slogan the record pivots on ("Some paths are not for bots. Some paths are not for anyone.", "One indent wrong and I burn your house down.").
- Haiku-shaped stanzas embedded in several records (APH-039, 041, 042, 045, 048, 050, 052, among others) were left to their form; no emphasis was added inside verse.
- Callback structures were marked consistently at both occurrences: the repeated "Please resolve conflicts before I resolve you." (APH-052) and "Merged cells are a crime against legibility." (APH-053) are bolded each time they appear.

## Watermark for the next run

- Records 26–50 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 50 is `content/aphorisms/APH-056.roboshirker.md`.
- The next run resumes at record 51: `content/aphorisms/APH-057.zhuzhing-ping.md`.
- Run cap is 25 records per run. Numbering gaps at 038, 043, 047, and 055 are preserved as found.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (shout-caps such as `IT` and `THE`, notation such as `C:\`) were not modified.
- Verbatim duplicated lines were treated uniformly: APH-033's repeated "Piped auth service into CPU scheduler" opener and APH-035's twice-repeated "Tags: tizen, failed-launch, ghost-ui." recitation remain identically plain at every occurrence.
- Prose-family residue paragraphs (mirror servers, thermal chassis warping, replication deferment) remain plain throughout, consistent with pass 01.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (41 → 43 across runs 01–02); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 2,196 records remain in the emphasis queue.
- APH-057 ("Zhuzhing Ping") was read but deliberately left for the next run at the record cap; it is a record about over-emphasis and will warrant a judged touch of its own.
