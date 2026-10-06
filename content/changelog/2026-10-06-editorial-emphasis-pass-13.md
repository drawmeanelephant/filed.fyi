---
title: "Editorial Emphasis Pass 13: Aphorism Records 301–325"
parent: changelog
status: published
tags: ["aphorisms", "changelog", "editorial-emphasis"]
---

# Editorial Emphasis Pass 13: Aphorism Records 301–325

**Maintenance ID:** 0.1.00043.emphasis-pass-13
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-FREF-0590 through APH-FREF-0790, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics-only, 2–4 touches per record on the euphemism payloads ("expensive than its expected return", "severity bleaching", "governed subject", "contradiction retention method", "unauthorized reconciliation", "standardized geometry"-family continuations, "porch light on"-class warmth, "warmth laundering", "theory of rest").
- The "substitutes" triad in APH-FREF-0740 (Acknowledgment / Witnessing / Gratitude substitutes for relief / intervention / outcome) was marked at all three occurrences — the parallelism is the record's spine.
- Motif recurrences marked: "severity bleaching" (APH-FREF-0660, echoing APH-FREF-0600), "warmth laundering" (APH-FREF-0790, echoing the proxy-compassion family).
- An incomplete sentence in APH-FREF-0630 ("As a result, they become proficient at.") was left exactly as found — archival residue is not for repair.

## Watermark for the next run

- Records 301–325 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 325 is `content/aphorisms/APH-FREF-0790-RLIF.md`.
- The next run resumes at record 326: `content/aphorisms/APH-FREF-0800-*.md` (next file in sorted order after FREF-0790).
- Run cap is 25 records per run. The lowercase-prefix and duplicate-numbered irregulars in this block (aph-fref-0635, aph-fref-0636, APH-fref-0650-pbc, APH-fref-0661-agbx) sit immediately beyond the watermark and will be reached next run.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting ("##" section headings, quoted coinages, shout-caps) were not modified.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (53 → 54); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 1,921 records remain in the emphasis queue.
