---
title: "Presentation QA v2 Lorelog 06: Rich-Structure Review of Fourteen Records"
parent: changelog
status: published
tags: ["changelog", "lorelog", "presentation-qa"]
---

# Presentation QA v2 Lorelog 06: Rich-Structure Review of Fourteen Records

**Maintenance ID:** 0.1.00236.presentation-qa-lorelog-v2-06
**Date:** 2026-10-09
**Scope:** `content/lorelog/` — the fourteen records assigned by workload issue #940 (LLG-0368-RAGE-AQ through LLG-0381-OPTOUT)

## What changed

- Read all fourteen assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue in each. The working tree was already at the issue snapshot (`4e6a82e8` = `origin/main`), so no intervening diffs required rereads.
- `LLG-0368-RAGE-AQ.md` line 13: italicized the verbatim unsanctioned filer note *I know what a graph is and that is not what happened to me* — quoted documentary material the record itself flags as repeatedly cited. Emphasis only.
- `LLG-0369-DOGE-SWAB.md` line 13: italicized the use-mention *weather* (the word-as-word object of Bricky's objection). Line 32: converted the bulletin's verbatim standard reminder to a blockquote — already introduced as quotation by "the standard reminder:". Zero word changes.
- `LLG-0370-XEV.md` line 23: code-spanned `B-4A`, the routing-state code in the comparative table's RAGE column. The limerick's "RAGE: B-4A." (line 126) is protected verse and stays plain.
- `LLG-0373-DOGE-W5.md` line 26: converted the verbatim cover-sheet text to a blockquote — introduced as quotation by "a manual cover sheet reading". Zero word changes.
- `LLG-0375-BREED.md`: code-spanned the two remaining bare `breedingProgram` field mentions (lines 26, 44) to match the record's own convention at lines 13/20, and code-spanned the `HUMAN-ORIGIN` tag literal at line 18.
- `LLG-0376-BREED-GOV.md`: code-spanned `breedingProgram` at body lines 12, 25, 30, 43. The two occurrences inside the Related Aphorisms tail (lines 56, 64) are protected residue and stay plain.
- `LLG-0377-GRAT.md`: code-spanned `breedingProgram` at lines 28 (inside the quoted log string) and 39, consistent with the record's existing `gratitudeBias` code span at line 41.
- `LLG-0378-WFA.md`: code-spanned `LITH-PLAN/ALOC-03` (lines 13, 33), `HTTP 200` (line 31), `gratitudeBias` (line 35), and `breedingProgram` (lines 35, 48, 62). The ALL-CAPS category literals (FIELD-OPERATIVE, MAINTENANCE-UNIT, ADMIN-CLERK, UNDECLARED) are already structurally set off as list items and stay plain.
- `LLG-0379-ROBOT-MEMO.md`: converted "incident LLG-0378-WFA" at line 12 to `[[lorelog/LLG-0378-WFA|LLG-0378-WFA]]` — target confirmed against that record's `id:` frontmatter; label preserves source spelling. Code-spanned `COORD-CLUSTER/SE-Δ` (line 12), the `COAUTHOR`/`CONSUMER` classification literals (lines 36, 56 ×2), and `breedingProgram` (lines 22, 40, 47, 56, 64). Promoted the existing lead-in "Internal discrepancy note:" at line 56 to a `**Label:**` run-in. `PENDING` stays prose.
- `LLG-0380-MATCH.md`: converted "LLG-0377-GRAT" at line 22 to `[[lorelog/LLG-0377-GRAT|LLG-0377-GRAT]]` — canonical `id:` confirmed. Code-spanned `breedingProgram` at lines 12, 16, 55 and `BreedingProgram` (sentence-initial capital preserved) at line 77.
- `LLG-0381-OPTOUT.md`: code-spanned `breedingProgram` at lines 12, 26, 42.
- Added this docket; after merging `origin/main` (which landed dockets `0.1.00231`, `0.1.00237`, `0.1.00240` from concurrent v2 slices), recounted `content/changelog/` to 189 and set README totals to actuals: 2,394 pages, 11 trunks, 2,383 satellites.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, relations, heading anchors, verse stanzas, indentation, two-space hard breaks, and the `## Related *` residue tails in every record — including every `breedingProgram`/`COAUTHOR`/`B-4A` occurrence inside verse or residue text.
- `LLG-0371-BAIT-B2B.md` reviewed unchanged: `B-2B` functions as the record's subject name, not a field literal ("when in doubt, leave plain"), and the record already carries its earned bold pivot (line 13) and indicator list.
- `LLG-0372-BAIT-B5.md` reviewed unchanged: the line-11 comma run enumerates example mirror surfaces rather than discrete items — rhetorical exemplification, not an enumeration — and the record already has its bold pivot (line 13) and indicator list.
- `LLG-0374-DOGE-LA.md` reviewed unchanged: the four evidence classes already exist as a run-in-labelled list (lines 19–22) mirroring the prose at line 13. The `GEX-2R` token at line 11 names a resubmission class, not an unambiguous record citation; the nearest canonical ID (`aphorisms/APH-LLG-0355-GEX-2R`) does not match the token's spelling, so no wiki link was made.
- ALL-CAPS status words treated as prose, not literals: `RESOLVED`/`STABLE` (LLG-0377), `UNRESOLVABLE` (LLG-0376), `PENDING` (LLG-0379), `ACKNOWLEDGED — CONTINUATION PENDING` (already a blockquote in LLG-0381), `MN-O` (inside an existing bold run-in, LLG-0368).
- Pre-existing formatting untouched: `**SIMULATOR WEATHER ADVISORY**` (LLG-0369), `**Intent to Co-Exist**` and `**REFUSAL RECEIVED; STATUS UNCHANGED**` (LLG-0381), existing blockquotes in LLG-0375/0376/0379/0380/0381, and `**rotAffinity**` (LLG-0380 line 23 — already bold; not converted to a code span).

## Verification performed

- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./bin/validate_graph.sh` — passed: Boris graph diagnostics, full Cantilever compile, verse residue check, 0 duplicate HTML IDs, Filed certification.
- `git diff` review: only emphasis markers, code spans, blockquote markers, and two `[[...]]` wiki links differ; no word, order, ID, frontmatter, link-target, or whitespace changes.
- Compiled-article inspection in `dist/cantilever/lorelog/`: both wiki links resolve (`<a href="LLG-0378-WFA.html">LLG-0378-WFA</a>`, `<a href="LLG-0377-GRAT.html">LLG-0377-GRAT</a>`); blockquotes render in LLG-0369/0373; every new `<code>` span verified per record against the source diff.
- Served `dist/cantilever` locally and previewed: LLG-0379-ROBOT-MEMO (largest record, 266 lines) at 1280×800 desktop and 430×932 mobile — wiki link, code spans, run-in label, and Kindy's blockquote all render with no console or network errors; LLG-0369-DOGE-SWAB blockquote/italic and unchanged LLG-0374-DOGE-LA verified in the DOM at 430×932.
- `python3 scripts/check_collection_counts.py` — PASS after updating the changelog trunk count and README totals.

## Unresolved follow-up

- No `needs decision` items. The `GEX-2R` mention in LLG-0374 was evaluated for the record-mention transform and left plain for the reason above; flagging it here so the decision is on record.
