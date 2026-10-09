---
title: "Presentation QA v2 — Lorelog Batch 02"
parent: changelog
status: published
tags: ["changelog", "presentation", "lorelog"]
---

# Presentation QA v2 — Lorelog Batch 02

**Maintenance ID:** 0.1.00232.presentation-qa-lorelog-02
**Date:** 2026-10-09
**Scope:** `content/lorelog/` — 14 assigned records, issue #936 (lorelog batch 02, pass 2)

## What changed

- Applied pass-2 rich-structure transforms to 12 of 14 assigned records; 2 records (LLG-0311-SRA, LLG-0316-MBR) earned no transform and remain unchanged.
- Record mentions → wiki links: `LLG-0115-TNS` (in LLG-0114-SOMA), `LLG-0114-SOMA` and `LLG-0326-DXS` (in LLG-0115-TNS), `LLG-0244-FSC` and `LLG-0324-MAP` (in LLG-0218-FSD), `LLG-0324-MAP` (in LLG-0244-FSC), `LLG-0316-MBR`, `LLG-0318-SRO`, `LLG-0323-ASD`, `LLG-0329-OIR` (in LLG-0316-LC22). Labels preserve source spelling; all targets verified against the graph before linking.
- Identifiers → code spans: form numbers and codes (`F17–F93`, `23-O`, `24-O`, `51-E`, `51-E-A`, `27-B`, `40-C`, `09-I`, `EFA-1`, `EFA-1-0000`, `32-A`, `32-A-R`, `32-A-NEW`, `12-A`, `72-S`, `19-C`, `422-EF`, `424-EFD`, `404-AF`) and the field name `mascotRef`.
- Field fragments → run-in labels: `**Archive position:**` (LLG-0218-FSD, LLG-0244-FSC) and `**SOMA:**`/`**COMA:**`/`**C.U.N.T.I.E.R.:**` output labels (LLG-0220-UIS).
- Preserved fragments → blockquotes: the "Brickys Filing Notes" margin-note blocks in LLG-0230-HYG, LLG-0244-FSC, LLG-0300-SC-X, and LLG-0302-CNTR, with existing `Summary:`/`Trauma:`/`Goals:`/`Quirks:` lead-ins converted to `**Label:**` run-ins.

## What was deliberately left alone

- Verbatim-quoted identifiers (e.g. `"superseded by 32-A-R (clarified)."`, `"-A"` suffixes, `"422-entity"` glossary strings) — quotation marks already set them off.
- Named designations and acronyms used as proper names (`SOMA-14`, `SOMA-72`, `LC-22`, `AV-14`, `MAP`, `AAOA`, `LCGU`, `CAAR`, `STCP`, `ARWI`, `TNS`) — names, not bare registry tokens.
- Heading-embedded code shorthand (`422`, `424` in "Routing Rules" heading of LLG-0115-TNS) — left plain to avoid touching heading anchors.
- Truncated record shorthand `51-E` in "recursive 51-E chains" (LLG-0115-TNS) — not a full ID token; out of scope for the wiki-link transform.
- All `## Related *` verse tails, frontmatter, IDs, status, tags, and relations.
- A `1)`/`2)`/`3)` outcome enumeration in LLG-0311-SRA — already a valid CommonMark ordered list; left as written.

## Verification performed

- `./bin/validate_graph.sh`: see PR body for exact outcome.
- `python3 scripts/check_collection_counts.py`: see PR body for exact outcome.
- Compiled-article spot check of changed records and one unchanged record: see PR body.

## Unresolved follow-up

- The pilot gate (issue #934) remains open; this slice was released by coordinator assignment before pilot merge. Disclosed for the record.
- `LC-22`/`AV-14` object designations were considered for code spans and declined as name-usage; a maintainer may rule otherwise in a future pass.
