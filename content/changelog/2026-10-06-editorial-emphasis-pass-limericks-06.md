---
title: "Editorial Emphasis Pass, Limericks Run 06: Records 126-150"
parent: changelog
status: published
tags: ["changelog", "limericks", "editorial-emphasis"]
---

# Editorial Emphasis Pass, Limericks Run 06: Records 126-150

**Maintenance ID:** 0.1.00042.emphasis-pass-lim-06
**Date:** 2026-10-06
**Scope:** `content/limericks/`, records 126-150 in sorted path order

## What changed

- Read LIM-LLG-0382-BPD through LIM-LLG-0400-CMA-TSP (25 records, all LIM-LLG series) and added emphasis to 23; 2 left plain (LIM-LLG-0383-RAW: already fully bold-marked in its own style; LIM-LLG-0399-OCS: already well-served with its own emphasis). No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics for loaded vocabulary ("compassionate math", "affectionate fog", "audit erotica"), quoted rulings and spoken absurdities, and terms of art ("memorial quorum", "honorary absence", "coexistence cascade"). Bold capped at one pivot per record ("The ribbon is one, but is three,", "And approved what they'd punished at first.", "And the chair learns to nod before you.").
- The civic-lore records (ribbon, banner, sash, parade) are documentary-registry voice: marked on the moments where ceremony quietly becomes authority.

## Watermark for the next run

- Limerick records 126-150 of 551 (sorted path order) are complete. Record 150 is `content/limericks/LIM-LLG-0400-CMA-TSP.md`.
- The next run resumes at record 151: `content/limericks/LIM-LLG-0401-AMS.md`.

## What was deliberately left alone

- Frontmatter, H1 title lines, trailing-double-space hard breaks, and all pre-existing emphasis (including 0383-RAW's own bold scheme and 0399-OCS's existing italics) preserved byte-for-byte.

## Verification performed

- Byte-level checks for all 23 touched records against the run-05 base: asterisk-strip equality, per-line trailing-whitespace preservation, touched-line balance. All passed.
- `./bin/validate_graph.sh`: Boris graph diagnostics, Markdown link audit, verse residue check, HTML ID audit, Filed certification all passed; exit 0.

## Unresolved follow-up

- 401 limerick records remain in the emphasis queue.
