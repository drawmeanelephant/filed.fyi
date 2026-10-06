---
title: "Editorial Emphasis Pass, Limericks Run 02: Records 26-50"
parent: changelog
status: published
tags: ["changelog", "limericks", "editorial-emphasis"]
---

# Editorial Emphasis Pass, Limericks Run 02: Records 26-50

**Maintenance ID:** 0.1.00038.emphasis-pass-lim-02
**Date:** 2026-10-06
**Scope:** `content/limericks/`, records 26-50 in sorted path order

## What changed

- Read records LIM-FREF-0750 through LIM-LLG-0051-E (25 records) and added emphasis to 19 of them; 6 left plain. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- The FREF records (0750-0880) follow the run-01 treatment: italics for loaded vocabulary ("dashboarded bloom", "non-actionable condition", "confidence object") and wry asides; bold capped at one pivot per record ("No lever was moved,", "And the trust drops straight through the flume.", "Did not stop being true,").
- The LIM-LLG records carry an existing series convention (one italic phrase per early stanza, no bold in this batch's files). Where the convention stopped mid-record, the already-marked region was completed (LIM-LLG-0001, -0002, -0003, -0004); LIM-LLG-0020 was plain and received series-consistent italics on its translated-speak phrases. Six LLG records were already fully served and were left untouched.
- Recurring motif "at a quarter to nine" italicized in LIM-FREF-0760 to match run 01.

## Watermark for the next run

- Limerick records 26-50 of 551 (sorted path order) are complete. Record 50 is `content/limericks/LIM-LLG-0051-E.md`.
- The next run resumes at record 51: `content/limericks/LIM-LLG-0052-MFX.md`.

## What was deliberately left alone

- Frontmatter, H1 title lines, trailing-double-space hard breaks, and pre-existing emphasis were preserved byte-for-byte. LIM-LLG-0003 contains a pre-existing italic span crossing two lines; untouched lines in that file were left exactly as found.
- Shouty comedy stanzas stay plain.

## Verification performed

- Byte-level checks against `main` for all 19 touched records: asterisk-strip equality, per-line trailing-whitespace preservation, balance check on every touched line. All passed.
- `./bin/validate_graph.sh`: Boris graph diagnostics, Markdown link audit, verse residue check, HTML ID audit, Filed certification all passed; exit 0.

## Unresolved follow-up

- 501 limerick records remain in the emphasis queue.
- Docket 0.1.00038 assigned against `main` at branch time; concurrent aphorism PRs may force renumbering at rebase per docs/working-with-filed.md.
