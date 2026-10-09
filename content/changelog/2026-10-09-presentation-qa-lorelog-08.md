---
title: "Presentation QA Lorelog 08"
parent: changelog
status: published
tags: ["changelog", "lorelog", "presentation-qa"]
---

# Presentation QA Lorelog 08

**Maintenance ID:** 0.1.00238.lorelog-08
**Date:** 2026-10-09
**Scope:** `content/lorelog/` — 14 records (LLG-0392-RCS through LLG-0401-GLP, issue #942 assignment)

## What changed

Pass-2 (rich structure) presentation review of the lorelog-08 slice. Fourteen
records read in full; eight earned transforms, six reviewed unchanged.

- `LLG-0392-RCS`, `LLG-0395-MSS`, `LLG-0397-SBF`: the parallel "traced/performed/reconstructed ... through/using/from" evidence sentences split into verbatim item lists, matching the comma/`and` item style already used in `LLG-0392-SGL`'s consensus list.
- `LLG-0399-OCS`: seven literal record-ID mentions became wiki links (six edit sites) — `FREF-0290-OCVH`, `LLG-0391-LAA` (×2), `LLG-0397-SBF` (×2), `FREF-0270-BMDC`, `LLG-0400-CMA-TSP` — labels preserving source spelling including the record's non-breaking hyphens. Self-references to `OCS-0399`/`CMA-TSP` left plain.
- `LLG-0400-CMA-TSP`: Bricky's margin-note lead-ins (`Summary:`, `Trauma:`, `Goals:`, `Quirks:`) became run-in bold labels; the prose mention of companion case `LLG-0399-OCS` became a wiki link.
- `LLG-0400-SCAS`: cloned form numbers `SOMA-14`, `51-E`, `SOMA-72`, `COMA-19` (forms enumeration and the later `SOMA-14` mention) became code spans.
- `LLG-0400-TRIAD`: the three bolded member-record IDs became wiki links inside the existing bold (`LLG-0401-GLP`, `LLG-0402-GMP`, `LLG-0403-WBA`).
- `LLG-0401-GLP`: the `Finding:` lead-in became a run-in label; `UNSURE` kept its existing bold.

Reviewed unchanged: `LLG-0392-SGL`, `LLG-0393-BDA`, `LLG-0393-RBR`,
`LLG-0394-PRS`, `LLG-0396-MSP`, `LLG-0398-CCO` — their enumerations are already
lists and no remaining prose runs earned a transform.

## What was deliberately left alone

- All words, ordering, frontmatter, IDs, tags, relations, titles, and every
  `## Related *` verse tail, including the two terminal limerick stanzas in
  `LLG-0401-GLP` that duplicate earlier stanzas — intentional residue.
- Stray `---` separators ahead of the verse tails in `LLG-0392-SGL` (line 23)
  and `LLG-0393-RBR` (line 24) — pre-existing markup irregularity, preserved.
- `LLG-0400-SCAS` line ~200: `(see LLG-0000-NULL)` references no record in the
  graph. Left plain — a null pointer to a null incident is on-brand residue, not
  a defect; flagged for maintainer awareness rather than filed as needs-decision.
- `SA‑SS‑TEL` (SCAS) and mascot designations (`LC-04`, `BX-6`, `LX-2`, `AC-11`)
  are natural-language node/name references, not canonical ID tokens — out of
  scope for the wiki-link transform.
- Quoted artifact inscriptions (`save the good ribbon`, `Handle as shared
  certainty`, `We are basically there`, `As a former`) left unmarked, matching
  corpus convention for such phrases.
- Directive/subsystem acronyms (TNS, SBI, CSI, SIRC, MFX, C.U.N.T.I.E.R.,
  FeelingSeeder) left plain — names, not document codes.
- Banner phrases in `LLG-0393-BDA`/`LLG-0393-RBR` left unmarked; italicizing
  quoted stitch-text would be emphasis for decoration, not structure.

## Verification performed

- `python3 scripts/check_collection_counts.py`: PASS after count updates.
- `./bin/validate_graph.sh`: passed — Boris graph diagnostics, verse residue
  check, HTML ID audit (0 duplicates), filed certification.
- Compiled output inspected for all eight changed records: wiki links resolve
  to `lorelog/LLG-*.html` / `reference/FREF-*.html` targets, `**[[id|label]]**`
  renders as linked strong text, code spans and new lists render correctly, and
  the GLP checkbox list/`Finding:` run-in are intact.

## Unresolved follow-up

- Issue #942's gate cites pilot #934, which was still open and unmerged at the
  time this slice was worked; the assignment was released by the coordinator
  regardless. Recorded here so the sequencing decision is auditable.
- `LLG-0000-NULL` has no record; if maintainers later create one, the SCAS
  mention becomes a link candidate on a future pass.
