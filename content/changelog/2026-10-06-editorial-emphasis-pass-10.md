---
title: "Editorial Emphasis Pass 10: Aphorism Records 226–250"
parent: changelog
status: published
tags: ["aphorisms", "changelog", "editorial-emphasis"]
---

# Editorial Emphasis Pass 10: Aphorism Records 226–250

**Maintenance ID:** 0.1.00040.emphasis-pass-10
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-428 through APH-FREF-0030, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark terms of art, wry asides, and each record's own loaded vocabulary ("damage with paperwork", "prayer with worse telemetry", "load-bearing mistake", "load-bearing misunderstanding", "procedural warmth", "impossible dreams", "prophecy buffering", "institutional mercy", "porch light on"). No bold in this run; the block is prose-forward with no thesis-sentence candidates.
- This block contains the historical irregularities — the lowercase `aph-FFP-*` mirror records, `APH-ffp-0385`, `APH-FREF-*` reference mirrors, and the id-overridden `APH-coma-observation-transcript` (APH-0089). All were preserved exactly as found and judged under the same rules.
- Motif echo marked: APH-435's "impossible dreams" (echoing APH-400) — cross-record echo, marked once per record.

## Watermark for the next run

- Records 226–250 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 250 is `content/aphorisms/APH-FREF-0030-AVSG.md`.
- The next run resumes at record 251: `content/aphorisms/APH-FREF-0040-AVDN.md`.
- Run cap is 25 records per run. Numbering gaps (436–450, 452–501, 505–671, 673–676, 678–936) are preserved as found.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting were not modified, including the "## Contextual Records" heading in APH-435 and the quoted fortune lines in APH-937.
- Taxonomy acronym definitions in APH-FREF-0020 (CAAR, LCGU, STCP, AAOA) were left unmarked; the touches went to the sentences interpreting them.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (50 → 51); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 1,996 records remain in the emphasis queue.
