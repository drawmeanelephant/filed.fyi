---
title: "Editorial Emphasis Pass 01: First 25 Aphorism Records"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "editorial-emphasis"]
---

# Editorial Emphasis Pass 01: First 25 Aphorism Records

**Maintenance ID:** 0.1.00031.emphasis-pass-01
**Date:** 2026-10-06
**Scope:** `content/aphorisms.md` and `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 24 records: APH-003 through APH-027, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark terms of art, wry asides, and each record's own loaded vocabulary ("portability of the wound", "bourgeois deviation", "full procedural honors"). Bold is reserved for the single sentence a record pivots on, at most one per record ("Neither of you may leave.", "Some drafts are abandoned because they were too accurate.").
- The aphorisms trunk (`content/aphorisms.md`) was read and left plain: three lines, nothing earns emphasis.

## Watermark for the next run

- Records 1–25 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 25 is `content/aphorisms/APH-027.comrade-kernelov.md`.
- The next run resumes at record 26: `content/aphorisms/APH-028.genny-compileheart.md`.
- Run cap is 25 records per run. `APH-022` does not exist in the corpus (numbering gap; preserved as found).

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (quotation marks, shout-caps such as `VERIFICATION`, notation such as `[L]` and `/home`) were not modified.
- Verbatim duplicated prose paragraphs in APH-014 and APH-018 were left exactly as found and uniformly plain, so the duplicates remain identical.
- Recurring collection boilerplate ("The system kept the ritual and misplaced the function.", "The record now looks official.", "Silence entered the record with full procedural honors.") and status-label values (`Erasure state: Gentle`, `Failure status: Certified`) stay plain by default; they are marked only when an individual aphorism sets them up.
- No trunk counts changed; no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./scripts/ensure-boris.sh --provision`: Boris binary built at pinned commit `07dc0d3cc101d86682ec92e06ba00edef9d90c75` into `bin/boris` (binary is gitignored).
- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed (2,247 pages scanned); HTML ID audit found 0 pages with duplicate IDs; Filed certification passed (`dist/cantilever/_boris/proof` complete and byte-for-byte consistent).
- Spot-checked compiled HTML: `dist/cantilever/aphorisms/APH-0003.html` renders the bolded signature line as `<strong>` and four `<em>` spans; `APH-0027.html` renders two `<em>` spans as intended.

## Unresolved follow-up

- 2,221 records remain in the emphasis queue.
- Cross-record motifs ("a suggestion", "folklore") were marked where they recur in this batch; later runs should continue marking motif recurrences for consistency.
