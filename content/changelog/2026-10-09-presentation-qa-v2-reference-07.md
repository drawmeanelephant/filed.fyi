---
title: "Presentation QA v2 — reference 07: 14 records reviewed, 12 changed"
parent: changelog
status: published
tags: ["changelog", "presentation", "reference"]
---

# Presentation QA v2 — reference 07: 14 records reviewed, 12 changed

**Maintenance ID:** 0.1.00249.presentation-qa-v2-reference-07
**Date:** 2026-10-09
**Scope:** `content/reference/` (FREF-0350-BHDS through FREF-0821-AVTL, issue #977 assignment), `content/changelog/`

## What changed

Pass-2 (rich structure) presentation review of the reference-07 slice.
Fourteen records read in full; twelve earned transforms, two reviewed
unchanged.

- `FREF-0350-BHDS`: `FREF-0815-MAP` and the `LLG-0001-NAV`/`LLG-0004-SMD`
  cross-references became wiki links. `LLG-BHDSS-TOAST` left plain — it is a
  filename stem, not a canonical `id:` (the record resolves as
  `lorelog/LLG-0003`); flagged as needs-decision.
- `FREF-0360-SAST`: six lorelog citations became wiki links —
  `LLG-0400-SCAS`, `LLG-0401-SCAS-ECHO`, `LLG-0406-FSD`, `LLG-0405-SAC`,
  `LLG-0407-SSP`, `LLG-0402-FSR`.
- `FREF-0370-DCST`: `LLG-0300-SC-X`, `LLG-0331-TPI`, `LLG-0332-SCD`,
  `LLG-0336-CSE` became wiki links; form codes `SOMA‑72` and `COMA‑19`
  became code spans (non-breaking hyphen U+2011 preserved).
- `FREF-0380-LBKP`: the four entropy tag literals under §4.3 became code
  spans.
- `FREF-0400-METR` (draft): `FREF-0740-MOC` (×2), `LLG-0334-CSI`,
  `LLG-0300-SC-X`, `LLG-0321-DRT`, `LLG-0821-SCL` (×2), `LLG-0820-MCR` (×2)
  became wiki links.
- `FREF-0410-SCLB` (draft): `LLG-0820-MCR` and `LLG-0821-SCL` became wiki
  links.
- `FREF-0420-ANCL` (draft): code-spanned `FREF-0570-APCR` became a wiki link;
  `LLG-0324-MAP` became a wiki link.
- `FREF-0430-EASP`: `LLG-0811-EG`, `LLG-0820-MCR`, `LLG-0324-MAP` became wiki
  links inside the existing bold doctrine labels.
- `FREF-0560-ADJC`: seven code-spanned cross-references became wiki links;
  `LLG-CREDITS-GTA` left plain (stem; canonical `lorelog/LLG-0005`), flagged
  needs-decision. `Minimum note:`/`Stronger note:` became run-in bold labels.
- `FREF-0570-APCR`: `LLG-0019-COMA`, `LLG-0020-COMA19-PBC`, `FREF-0260-BMDH`
  became wiki links; the two line-per-item provenance enumerations became
  verbatim lists; `Minimum note:`/`Stronger note:` run-in bold. Four tokens
  left plain and flagged: `LLG-DS-404-ALPHA`, `LLG-IA-8C-ANNEX`,
  `LLG-DMAIC-RITE`, `LLG-EL-0x7E` — filename-stem-shaped IDs whose canonical
  ids are `lorelog/DS-0404-ALPHA`, `lorelog/LLG-0008`, `lorelog/LLG-0006`,
  `lorelog/LLG-0007`.
- `FREF-0650-PBC`: `COMA-19` became a code span in prose (lines 13, 69); the
  occurrence inside the preserved blockquote stays plain.
- `FREF-0820-IELS`: `FREF-0822-ELRA` became a wiki link; the self-reference
  `FREF-0820-IELS` stays plain.

Reviewed unchanged: `FREF-0661-AGBX` (mascot mentions are filename-stem code
spans — `005.bricky-goldbricksworth`, `211.apex-goldbricker` — not canonical
ids; the taxonomy is already a table) and `FREF-0821-AVTL` (term-mapping list
already expresses its structure; no record IDs present).

## What was deliberately left alone

- All words, ordering, frontmatter, IDs, tags, relations, titles, and every
  `## Related *` verse tail, including the unattached limerick stanzas that
  sit between each record's `<Aside>` addendum and `## Related Aphorisms`.
- Every single-paragraph `**Archivist's Addendum**` inside `<Aside
  kind="note">` — none is a true multi-paragraph annex, so no `<Details>`
  conversion.
- Filename-stem tokens that are not canonical ids: `mascots083.ac-11-
  sealloop-auditor`, `mascots076.av-14-nullseal-register` (APCR),
  `005.bricky-goldbricksworth`, `211.apex-goldbricker` (AGBX), plus the six
  LLG-shaped stems listed above.
- Mascot/object designations (`AC-11`, `SI-9`, `SC-Λ`, `LC-04`, `LC-22`),
  classification names (`AAOA`, `STCP`), and directive acronyms (SOMA, COMA,
  C.U.N.T.I.E.R.) — names, not canonical ID tokens.
- `SOMA-14` (SAST) left plain — a persona/lane designation used as a name.
- Stray `## Haikus`/`## Archival Additions` residue headings inside Related
  sections (LBKP, EASP, ADJC, APCR) — pre-existing irregularity, preserved.
- No `parent`/`relations` edits; wiki links only where the record already
  asserted the reference.

## Verification performed

- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh`: passed — Boris
  graph diagnostics, full Cantilever compile, verse residue check, HTML ID
  audit (0 duplicates), filed certification.
- Compiled output inspected for all twelve changed records under
  `dist/cantilever/reference/`: every wiki link renders as `<a href>` to the
  verified canonical target (`lorelog/LLG-*.html`, `reference/FREF-*.html`),
  no stray `[[` delimiters, new lists render as `<li>`, code spans render,
  bold-label links render as linked strong text, and `LLG-CREDITS-GTA`
  correctly remains a plain code span.
- `python3 scripts/check_collection_counts.py`: PASS after count updates.

## Unresolved follow-up

- Six `LLG-*`-shaped tokens are filename stems, not canonical ids, and stay
  plain pending maintainer ruling on whether stem references should link to
  their resolved canonical targets: `LLG-BHDSS-TOAST` (BHDS, ~line 27),
  `LLG-CREDITS-GTA` (ADJC, ~line 83), `LLG-DS-404-ALPHA` (APCR, ~line 70),
  `LLG-IA-8C-ANNEX` / `LLG-DMAIC-RITE` / `LLG-EL-0x7E` (APCR, ~lines
  111–113). Posted to rolling tracker #970.
