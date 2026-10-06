---
title: "Editorial Emphasis Pass 06: Aphorism Records 126–150"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "editorial-emphasis"]
---

# Editorial Emphasis Pass 06: Aphorism Records 126–150

**Maintenance ID:** 0.1.00036.emphasis-pass-06
**Date:** 2026-10-06
**Scope:** `content/aphorisms/`, records in sorted path order

## What changed

- Added editorial emphasis (bold and italics only) to 25 records: APH-247 through APH-271, judged one record at a time. No words were added, removed, reordered, or corrected; the diff is asterisks only.
- Italics mark terms of art, wry asides, and each record's own loaded vocabulary ("radioactive half-life of synergy", "resin of procedural delay", "homeopathic" relief, "monument to lost intentions"). Bold is rare in this block: the records are mostly uniform one-liners or hushed first-person prose, and only APH-258 ("Three people in a hallway decided how it actually works.") and APH-260 ("I will break the rules to fix the thing the rules broke.") had a true thesis sentence to earn it.
- Records composed of equal-weight one-liners (APH-265, 266) were trimmed to the strongest five marks rather than one per line, to avoid a uniform-marking wash.
- The APH-261 asterisk burial received its meta-touch: "we merely buried it under an *asterisk*."

## Watermark for the next run

- Records 126–150 of 2,246 markdown files under `content/` (sorted path order) are complete. Record 150 is `content/aphorisms/APH-271.alibi-seal.md`.
- The next run resumes at record 151: `content/aphorisms/APH-272.shorthand-reliquary.md`.
- Run cap is 25 records per run.

## What was deliberately left alone

- Frontmatter, links, tables, code, backtick spans, and all pre-existing formatting (single-quoted phrases such as 'Not It', 'paradigm shift', 'Enterprise Infrastructure') were not modified.
- The placeholder-witness residue block in APH-259 (brass paperweight, lanyard, podium, coat, highlighter) and the echo-rewrites of Witness Mink-9 / Proxy Compassion Possum material in APH-268 (side pane, minutes, apology slip, vellum) remain plain per the residue-family convention.
- The "legally X" family was marked only where it is a paragraph's payload (APH-255, 271), not on every occurrence.
- No trunk counts changed other than this docket's own addition to `content/changelog/` (46 → 47); no records were added, removed, or renamed; no relations were touched.

## Verification performed

- `./bin/validate_graph.sh`: Boris graph diagnostics passed; full Cantilever compile wrote `dist/cantilever`; verse residue check passed; HTML ID audit found 0 pages with duplicate IDs; Filed certification passed, proof complete and byte-for-byte consistent.

## Unresolved follow-up

- 2,096 records remain in the emphasis queue.
