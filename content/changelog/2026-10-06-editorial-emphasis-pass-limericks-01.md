---
title: "Editorial Emphasis Pass, Limericks Run 01: First 25 Limerick Records"
parent: changelog
status: published
tags: ["changelog", "limericks", "editorial-emphasis"]
---

# Editorial Emphasis Pass, Limericks Run 01: First 25 Limerick Records

**Maintenance ID:** 0.1.00037.emphasis-pass-lim-01
**Date:** 2026-10-06
**Scope:** `content/limericks/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: LIM-FREF-0500 through LIM-FREF-0740, judged one record at a time in sorted path order. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark each record's own loaded vocabulary ("governable space", "administratively mild", "partial success", "technically true") and wry asides. Bold marks at most one pivot line per record ("Which is how categories dare.", "But the issue is practically dead.", "That is Empathegy's art:"). In LIM-FREF-0570 the pivot spans a two-line couplet ("The care did not end; / It just failed to extend") and is bolded across both.
- Recurring formulas ("at a quarter to nine", filed-as quotations such as *"zero-complaint"* and *"thermally challenging fire."*) are marked where the individual stanza sets them up, not on sight.

## Watermark for the next run

- Limerick records 1-25 of 551 (sorted path order) are complete. Record 25 is `content/limericks/LIM-FREF-0740-MOC.md`.
- The next run resumes at record 26: `content/limericks/LIM-FREF-0750-PXCM.md`.
- Run cap is 25 records per run.

## What was deliberately left alone

- Frontmatter, H1 title lines, trailing-double-space hard line breaks, and all pre-existing formatting were preserved byte-for-byte. Verification confirmed that stripping every asterisk from old and new files yields byte-identical text.
- Shouty comedy stanzas in the alarm/panic register were mostly left plain; they do not need help.
- The limericks trunk (`content/limericks.md`) was read and left plain.
- No records were added, removed, or renamed; no relations were touched.

## Verification performed

- Per-record byte-level checks against `main`: asterisk-strip equality, per-line trailing-whitespace preservation, balanced asterisks (no `***`), frontmatter untouched. All 25 records passed.
- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile succeeded; verse residue check and HTML ID audit passed; Filed certification passed (proof byte-for-byte consistent).

## Unresolved follow-up

- 526 limerick records remain in the emphasis queue.
- Docket number was originally drafted as 0.1.00035; while this branch was in flight, aphorism passes 05 and 06 merged claiming 0.1.00035 and 0.1.00036, so the docket was renumbered to 0.1.00037 at rebase time per `docs/working-with-filed.md` section 9.
