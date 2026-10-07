---
title: "Haiku Hard Breaks Restored in Four Records"
parent: changelog
status: published
tags: ["changelog", "presentation", "haikus"]
---

# Haiku Hard Breaks Restored in Four Records

**Maintenance ID:** 0.1.00047.haiku-hard-breaks
**Date:** 2026-10-06
**Scope:** `content/haikus/` — 4 of 25 assigned records under presentation QA workload #645, plus this docket and the changelog trunk count

## What changed

- Read all 25 records assigned by #645 in full, frontmatter through final line. No file had drifted from snapshot `8997eebee2a4e620c5dd47fcea97abf515c4cac6`.
- In `hai-003-blamey-mctypoface.md`, `hai-004-boily-mcplaterton.md`, `hai-005-bricky-goldbricksworth.md`, and `hai-019-kindy-mcexistentialcrisis.md`, every stanza after the fifth lacked the two-space hard breaks the earlier stanzas carry. Boris compiled those stanzas to paragraphs containing bare newlines, which browsers collapse — the haiku rendered as run-on prose.
- Added the missing hard breaks to the first two lines of each collapsed stanza, matching the collection's own convention. 8 lines in hai-003, 10 in hai-004, 4 in hai-005, 8 in hai-019. No words, line order, indentation, or stanza structure were changed.
- Recounted `content/changelog/` at finalization: 65 source records existed while the trunk declared 64 — the #610 guardrails docket merged as PR #803 with no net count change after #611's recount. This docket makes 66, and the trunk now says so.

## What was deliberately left alone

- The 21 remaining assigned records needed no change; their stanzas already carry hard breaks and compile correctly. No emphasis was added anywhere in the workload — nothing earned it.
- Archival residue preserved, including the stray leading space at `hai-003` line 16, the spelling "throtling" at `hai-004` line 27, the poem line "status: external" at `hai-003` line 28, and the line "chassis cools in silent thought" shared verbatim between `hai-004` line 45 and `hai-019` line 51.
- Frontmatter, titles, canonical IDs, tags, status fields, and stanza counts are untouched. The 82 other haiku-collection files carrying similar collapsed-stanza residue belong to their own bounded workloads and were not swept.

## Verification performed

- `./bin/validate_graph.sh` passed after the edits: Boris graph diagnostics, Markdown link audit, Cantilever compilation of 2,270 pages, verse residue check, zero duplicate HTML IDs, byte-for-byte publication certification.
- Inspected the compiled articles for all four changed records: every stanza paragraph now emits `<br />` line breaks; stanza counts are 9/10/7/9 for HAI-0003/0004/0005/0019 respectively. Spot-checked unchanged HAI-0013 and HAI-0028 and the `haikus.html` trunk (534 links) with zero collapsed paragraphs and intact navigation/TOC.
- Served `dist/cantilever/` locally and fetched each page over HTTP 200. Viewport-dependent rules in `themes/cantilever/assets/cantilever.css` (≤960px, ≤560px) govern shell chrome only; `<br />` line breaking is width-independent. No screenshot-based review is claimed.
- `python3 scripts/check_presentation_qa.py` (exit 1, `FINDINGS`) reports 30 error-level findings, one per line where a hard break was appended: any whitespace/hard-break delta sits outside its automatic safe subset and is flagged "words, order, whitespace, or existing markup changed". These are disclosed for the maintainer's narrow decision, not claimed as a pass.

## Unresolved follow-up

- `python3 scripts/check_collection_counts.py` reports `README.md` declaring 2,269 pages / 2,258 satellites against an actual 2,271 / 2,260 with this docket. The drift predates this branch — `main` already held 2,270 pages after #803 merged without a net trunk-count change. Updating `README.md` is outside the QA checker's allowed PR scope; left for coordinated count reconciliation.
- Requires independent review and successful `validate`, `publish-export`, and aggregate `ci` checks before merge; the reviewer's word is the certification, not this docket.
- Maintenance sequence `0.1.00047` was unclaimed on `main` at branch time; recheck before merge per the shared finalization lane.
