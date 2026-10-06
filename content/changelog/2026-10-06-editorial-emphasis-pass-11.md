---
title: "Editorial Emphasis Pass 11: Aphorism Records 251–275"
parent: changelog
status: published
tags: ["aphorisms", "changelog", "editorial-emphasis"]
---

# Editorial Emphasis Pass 11: Aphorism Records 251–275

**Maintenance ID:** 0.1.00041.emphasis-pass-11
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-FREF-0040 through APH-FREF-0270, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- This block is the FREF reference-mirror register — uniformly terse assurance-vocabulary records. Italics-only, 2–4 touches per record on the euphemism payloads ("deferred presence", "durable features", "calmer than their contents", "mathematically indistinguishable from peace", "re-contaminate", "illegal to use, but mandatory to retain", "immune to truth", "diluted responsibility", "laundered").
- No bold in this run; the register has no thesis sentences, only calibrated phrasing.
- Cross-references to other mascots inside APH-FREF-0070 (Seal of Maybe Enough, AC-11 Sealloop Auditor) were left plain; the mark went to the interpretive sentences around them.

## Watermark for the next run

- Records 251–275 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 275 is `content/aphorisms/APH-FREF-0270-BMDC.md`.
- The next run resumes at record 276: `content/aphorisms/APH-FREF-0280-CBND.md`.
- Run cap is 25 records per run. The near-duplicate openers in APH-FREF-0060 and APH-FREF-0120 were left identically plain at both occurrences.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (shout-caps such as `ABSENCE`, `NOT`, `VACANCY`; quoted coinages) were not modified.
- Taxonomy acronym definitions (CAAR, LCGU, STCP, AAOA, C.U.N.T.I.E.R.) were left unmarked.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (51 → 52); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 1,971 records remain in the emphasis queue.
