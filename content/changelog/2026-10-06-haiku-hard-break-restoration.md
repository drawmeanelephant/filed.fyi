---
title: "Haiku Verse Hard-Break Restoration (Pilot Fix)"
parent: changelog
status: published
tags: ["changelog", "haikus", "presentation"]
---

# Haiku Verse Hard-Break Restoration (Pilot Fix)

**Maintenance ID:** 0.1.00047.haiku-hard-break-restoration
**Date:** 2026-10-06
**Scope:** `content/haikus/` (four records), changelog docket/trunk

## What changed

- Restored two-space hard breaks on verse lines in the tail stanzas of four haiku records whose stanzas after stanza 5 lacked them: `hai-003` (stanzas 6-9), `hai-004` (stanzas 6-10), `hai-005` (stanzas 6-7), `hai-019` (stanzas 6-9). 41 verse lines received the `  ` terminator.
- Each breakless stanza had been collapsing into a single run-on paragraph in compiled HTML (verified: HAI-0003 showed 10 `<br />` for 9 stanzas). After restoration all stanzas render as verse lines (HAI-0003: 18 `<br />`, HAI-0004: 20, HAI-0005: 14, HAI-0019: 18).
- Traced the mixed state to the pre-Boris MDX source at `6abe4416`: the breakless tails were authored that way inside `<Limerick>` components, which masked the missing breaks until the Astro-to-Boris migration. Original residue, not a migration artifact.
- Escalated under presentation QA pilot #645 as `needs decision` (hard-break edits are outside the workload's automatic safe subset); the maintainer authorized the fix and requested this PR.
- Recounted changelog source records at finalization: 65 existing records plus this docket. The trunk previously declared 64, one behind reality; it now declares the actual 66.

## What was deliberately left alone

- Every word, stanza boundary, and line order. `git diff --ignore-space-at-eol` is empty; only trailing hard-break whitespace was appended.
- The file-final line of each record keeps no trailing break, matching the marked-stanza convention (`I'll ask you anew` pattern).
- The stray leading space on `hai-003` L16 (` ritual is safe  `) and the `throtling` typo on `hai-004` L27 — archival residue, preserved.
- Zero emphasis added. The haiku collection is uniformly unmarked deadpan verse (0/520 files contain asterisks); no record earned a mark.
- The ~295 other collapsed verse stanzas across the archive tracked by the verse-residue check — outside this bounded assignment.

## Verification performed

- `./bin/validate_graph.sh`: passed. Boris graph diagnostics, full Cantilever compile, verse residue check, zero duplicate HTML IDs, byte-for-byte certification.
- `python3 scripts/test_presentation_qa.py`: 24 tests passed.
- `python3 scripts/check_presentation_qa.py` with explicit assignment/evidence JSON for #645: FINDINGS as designed — `human_review` flags on the four hard-break edits (outside the automatic asterisk-only safe subset), disclosed here under maintainer waiver. No scope violations; totals reconcile.
- Compiled-page inspection of `dist/cantilever/haikus/HAI-0003.html`, `HAI-0004.html`, `HAI-0005.html`, `HAI-0019.html`: stanza lines now render with `<br />`, matching the marked stanzas above them. Unchanged records spot-checked (`HAI-0006.html`, `HAI-0013.html`) still render correctly.

## Unresolved follow-up

- Archive-wide verse collapse (~299 collapsed poems per the verse-residue check) remains a maintainer decision; this fix covers only the four pilot-assigned records.
- Independent review and `validate` / `publish-export` / aggregate `ci` gates still required before merge.
