---
title: "Editorial Emphasis Pass 12: Aphorism Records 276–300"
parent: changelog
status: published
tags: ["aphorisms", "changelog", "editorial-emphasis"]
---

# Editorial Emphasis Pass 12: Aphorism Records 276–300

**Maintenance ID:** 0.1.00042.emphasis-pass-12
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-FREF-0280 through APH-FREF-0580, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics-only, 2–4 touches per record on the euphemism payloads ("desire for the room to be quiet", "mathematically indistinguishable from peace" family continues: "compromised artifact", "haunted defaults", "redistributes stewardship", "unsupported audio format", "necessary myth", "ergonomically ignorable", "bleaches", "decorative metadata").
- The lowercase-prefix irregulars (aph-fref-0290, aph-fref-0400, aph-fref-0560-adjc, aph-fref-0570-apcr) were preserved as found and processed under the same rules.
- Existing "##" section headings in APH-FREF-0570 and APH-FREF-0580 left untouched.

## Watermark for the next run

- Records 276–300 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 300 is `content/aphorisms/APH-FREF-0580-CMPS.md`.
- The next run resumes at record 301: `content/aphorisms/APH-FREF-0590-CPSP.md`.
- Run cap is 25 records per run. The duplicate-numbered pairs (APH-FREF-0560/0570 in two spellings each) are preserved as found.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (quoted coinages, the `C.U.N.T.I.E.R.` acronym, SOMA/COMA taxonomy names) were not modified.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (52 → 53); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 1,946 records remain in the emphasis queue.
