---
title: "Editorial Emphasis Pass 05: Aphorism Records 101–125"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "editorial-emphasis"]
---

# Editorial Emphasis Pass 05: Aphorism Records 101–125

**Maintenance ID:** 0.1.00035.emphasis-pass-05
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-222 through APH-246, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- This block shifts register: mostly all-prose first-person records (Placeholder Witness, Witness Mink-9, Annexa Sorrowmark, Index Mourner, and the care/coverage/compliance family) with a lighter hand — one touch per paragraph, several records italic-only with no bold (APH-223, 225, 228, 229, 230, 232, 233, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245). Bold appears only where a terse creed or slogan exists ("Always on Slide 7.", "Let your metrics smile too™.", "Velv is accepted everywhere, but never truly seen.").
- Italics mark each record's loaded vocabulary ("cryptographically secure indifference", "identically cruel", "a brief pause in the beating", "the economy of morale", "high-fructose paradigm shift" from run 04's convention continues).
- The "misfiles with conviction" and "a footnote that learned to walk" motifs did not recur in this block; no cross-record marking was required.

## Watermark for the next run

- Records 101–125 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 125 is `content/aphorisms/APH-246.thankyou-ash.md`.
- The next run resumes at record 126: `content/aphorisms/APH-247.ribbon-of-maybe.md`.
- Run cap is 25 records per run.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting were not modified — including the template placeholders in APH-234 (`[INSERT_SYMPATHY_VARIABLE]` and kin), the filename `'Do_Not_Distribute_v3.docx'` in APH-235, and all single-quoted phrases.
- The prose-residue paragraphs in APH-243 (from "A permanent paper trail of belief..." onward) remain plain, consistent with the residue-family convention from earlier runs.
- Quoted gag labels ('seasonal variance', 'engagement spike', 'koalafication') keep their existing quotation marks as their only marking.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (45 → 46); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 2,121 records remain in the emphasis queue.
