---
title: "Presentation QA v2 lorelog-10: two records earned structure, twelve unchanged"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "lorelog"]
---

# Presentation QA v2 lorelog-10: two records earned structure, twelve unchanged

**Maintenance ID:** 0.1.00240.presentation-qa-v2-lorelog-10
**Date:** 2026-10-09
**Scope:** `content/lorelog/` — issue #944 assignment (14 records, snapshot `4e6a82e8`)

## What changed

Fourteen assigned records read in full, frontmatter through final line, against the pass-2 transform list in `docs/presentation-qa-baseline.md`. Two earned a transform; twelve stayed plain. Markdown structure only — no word, order, ID, or frontmatter changes:

- `LLG-0409-IEL.md` line 11: bare `Framing Note:` lead-in became `**Framing Note:**`, matching the run-in label convention carried by sibling records (`**Routing note:**`, `**Registry Note:**`, `**Related custody condition:**`). Same line: bolded the tail clause "not as an objective archive doctrine" — the disclaimer that reframes the entire record's evidentiary status.
- `LLG-0409-PRE.md` line 90: the "Silent Interval Retroactive Explanation" bullet is the only scenario item whose body is the verbatim script artifact itself rather than a description of one; wrapped it in `>` so the specimen reads as quotation, consistent with the existing blockquote at line 162. Line 164: `SA-SS-TEL` node code wrapped in a code span — a literal doctrine-node identifier. A wiki link was evaluated and rejected: no canonical record for `SA-SS-TEL` exists anywhere in the corpus (four inbound mentions, zero `id:` declarations), and a miss is a hard error.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, relations, anchors, link targets/labels, quoted and documentary material, and all existing emphasis.
- All `## Related *` verse tails: stanza structure, indentation, `- `-item haiku formatting (LLG-0436-ASF, LLG-0446-OQF), and two-space hard breaks exactly as found.
- `LLG-0414-WAD.md`, `LLG-0422-SCP.md`, `LLG-0427-RAC.md`, `LLG-0430-HBR.md`, `LLG-0441-TSR.md`: Bricky's Filing Notes `- Summary:`/`- Trauma:`/`- Quirks:` lead-ins kept unbolded — that convention runs 53 occurrences with zero bolded in lorelog; bolding here would break the established pattern.
- `LLG-0410-BWS.md` and `LLG-0411-RRC.md`: the "Observed effects included …" passages are rhetorical triads inside prose, not discrete enumerations; existing single pivots already carry the emphasis.
- `LLG-040X-ANLAS.md`: already richly structured (code spans, `**origin:**`/`**failure domain:**`/`**first public catastrophe:**` run-ins, two blockquotes); the bolded `**ApplicationEnhancer.bundle**` at line 46 doubles as the incident's culprit designation — existing emphasis kept rather than converted.
- `LLG-0446-OQF.md` (line 61) and `LLG-0447-SLA.md` (line 67): bare `RelatedEntries` token residue — already flagged `needs decision` on issue #719; left exactly as found.
- `TPI`/`SCD`/`MEO` (LLG-0409-PRE line 50): directive-conflict type codes, not record-ID mentions — the canonical IDs are `lorelog/LLG-0331-TPI` et al.; left plain. `EFA-1`, `SOMA-14`, `SA-SS-TEL` in sibling records likewise left plain elsewhere; only the identifier token in scope here was code-spanned.
- Name-only record mentions ("Queue Matron", "Afterimage Clerk", "Anlas", "Replacement Without Release") carry no ID token; out of scope for pass-2 wiki links.

## Verification performed

- `git diff 4e6a82e839fe56832a3d1c3fdd155487c16b002b..HEAD` on all 14 assigned paths — clean; snapshot still current.
- `git diff` on changed records confirms markup-only deltas; no trailing-whitespace additions, no word changes.
- `python3 scripts/check_collection_counts.py` — run after adding this docket; `content/changelog.md` `Count:` and README totals set to actuals.
- `BORIS_BIN=<local> ./bin/validate_graph.sh` — see PR/issue comment for exact outcome.

## Unresolved follow-up

- `RelatedEntries` residue in `LLG-0446-OQF.md` (line 61) and `LLG-0447-SLA.md` (line 67) remains `needs decision` under issue #719, pending maintainer resolution or waiver.
