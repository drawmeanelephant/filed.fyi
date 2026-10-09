---
title: "Presentation QA v2 Lorelog 07: Rich-Structure Review of Fourteen Records"
parent: changelog
status: published
tags: ["changelog", "lorelog", "presentation-qa"]
---

# Presentation QA v2 Lorelog 07: Rich-Structure Review of Fourteen Records

**Maintenance ID:** 0.1.00237.presentation-qa-lorelog-07
**Date:** 2026-10-09
**Scope:** `content/lorelog/` — the fourteen records assigned by workload issue #941 (LLG-0382-BPD, LLG-0383-RAW, LLG-0384-CIR, LLG-0385-CEB, LLG-0385-SED, LLG-0386-LODGE-MERGE, LLG-0387-SURV-NOP, LLG-0388-EC-ORDER, LLG-0389-AKL, LLG-0389-MQM, LLG-0390-HAP, LLG-0390-KCL, LLG-0391-LAA, LLG-0391-RCD)

## What changed

- Read all fourteen assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue in each. Every file was byte-identical to snapshot `4e6a82e839fe56832a3d1c3fdd155487c16b002b` at review time; no moves, removals, or identity changes.
- `LLG-0382-BPD.md`: converted nine unambiguous record-ID mentions in the dossier's evidence prose to `[[canonical-id|source-spelling]]` wiki links (LLG-0003-SVR, LLG-0012-A, LLG-0319-PAS, LLG-0375-BREED, LLG-0376 → lorelog/LLG-0376-BREED-GOV, LLG-0088-B, CREDITS-GTA → lorelog/LLG-0005, LLG-0811-EG, LLG-0820-MCR); code-spanned the literal schema field names `vibe`, `cosmicAlignment`, `snackPreference`, `caseNumber`, and four body occurrences of `breedingProgram`/`BreedingProgram`.
- `LLG-0385-CEB.md`: wiki-linked two record mentions — `DS-404-ALPHA` → lorelog/DS-0404-ALPHA (line 13) and `EFA-1` → lorelog/LLG-0223-EFA (line 59). Labels preserve source spelling.
- `LLG-0389-MQM.md`: code-spanned the literal layer status tokens `In Honor` and `Present` (line 11); split the verbatim minute-book margin annotation at line 19 into a blockquote. No wording added at the seam.
- `LLG-0390-KCL.md`: code-spanned the three literal ledger status values in Sister Casserole's audit list — `prepared by`, `prepared from the card of`, `prepared in honor of` (lines 24–26).
- `LLG-0391-LAA.md`: split the verbatim handwritten note `Approved at lunch.` into a blockquote (lines 14–16); code-spanned the luncheon-template field names `reception summary` and `disposition` (line 30).
- Five records changed, nine reviewed unchanged. Totals reconcile against the fourteen-file assignment.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, status fields, tags, relations, `{#...}` heading anchors, list structures already present, existing bold spans, quoted/documentary material, verse stanzas, two-space hard breaks, and double-blank-line residue spacing — across all fourteen records.
- Form designations used as names (`Form 12‑A`, `Form 88‑B`, `Form AR-Null`, `divergence protocol L-17`, `Packet CEP`, `CEPs`) — left plain; the code-span transform covers literal identifiers, and these read as titles in prose.
- `LLG-0383-RAW`, `LLG-0384-CIR`, `LLG-0385-SED`, `LLG-0386-LODGE-MERGE`, `LLG-0387-SURV-NOP`, `LLG-0388-EC-ORDER`, `LLG-0389-AKL`, `LLG-0390-HAP`, `LLG-0391-RCD` — reviewed unchanged. Each already carries the structure its content implies (status/enumeration lists and earned bold), or its enumerations are rhetorical triads and woven prose that the rubric does not permit splitting.
- No new emphasis anywhere. Pass-1 already evaluated bold pivots for this slice; pass-2 emphasis remains uncapped but was not earned on a second read.
- `LLG-0382-BPD` heading `## The breedingProgram emerges` (line 32) left plain — code-spanning inside a heading risks the generated anchor for no presentational gain.
- The `LLG-0376` link is a partial-ID mention; it resolves unambiguously because only `lorelog/LLG-0376-BREED-GOV` carries that prefix and the record's own `relations` already cite it. `CREDITS-GTA` preserves source spelling while targeting canonical `lorelog/LLG-0005` (path ≠ ID residue in the corpus).
- Frontmatter `relations` untouched. `LLG-0382-BPD`'s body cites more records than its relations list — a curation question for the maintainer, not a formatting one.

## Verification performed

- `git diff` on the five changed records confirms Markdown structure only; stripping `**`/`` ` ``/`>`/`[[|]]` leaves every changed line byte-identical to its source.
- `python3 scripts/check_collection_counts.py` — PASS after this docket: changelog declared 186, actual 186; source 2,391 pages / 11 trunks / 2,380 satellites; README totals updated to match.
- `BORIS_BIN=<local boris> ./bin/validate_graph.sh` — see PR body for exact outcome, including wiki-link resolution against the frozen graph.
- Compiled-article inspection of the changed records plus one unchanged control — see PR body for exact pages and results.

## Unresolved follow-up

- `LLG-0382-BPD` body prose cites records absent from its `relations` (LLG-0003-SVR, LLG-0012-A, LLG-0319-PAS, LLG-0088-B, lorelog/LLG-0005, LLG-0811-EG, LLG-0820-MCR). The wiki links now carry the reference edges in-body; whether frontmatter relations should mirror them is a maintainer call, recorded here rather than made.
