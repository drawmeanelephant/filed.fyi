---
title: "Reference Authority: Metrics of Care and BHDSS Precedence Clarified"
parent: changelog
status: published
tags: ["changelog", "maintenance", "reference"]
---

# Reference Authority: Metrics of Care and BHDSS Precedence Clarified

**Maintenance ID:** 0.1.00024.reference-authority
**Date:** 2026-08-07
**Scope:** content/reference (three records) and content/reference/empathegy (one record)

---

## Records reviewed

- `content/reference/fref-0350-bhds.md` (FREF-0350-BHDS) — BHDSS
- `content/reference/fref-0400-metr.md` (FREF-0400-METR) — Metrics of Care (experimental framing)
- `content/reference/empathegy/fref-0740-moc.md` (FREF-0740-MOC) — Metrics of Care (doctrine)
- `content/reference/fref-0410-sclb.md` (FREF-0410-SCLB) — Service Continuity Listening Board (adjacent; audited, unchanged)
- `content/reference/fref-0070-aopt.md` (FREF-0070-AOPT) — Assurance Optics (adjacent)
- `content/reference/fref-0430-easp.md` (FREF-0430-EASP) — Empathegy Aesthetic Survival Protocol (adjacent; audited, unchanged)

## Boundary / authority ambiguity found

**Metrics of Care.** Two reference records carry the title "Metrics of Care": the draft experimental record FREF-0400-METR ("do not yet constitute their own system," "memorial to a system feature that never shipped") and the published mature doctrine FREF-0740-MOC (metric families, official care surfaces, coverage substitution). Neither file referenced the other, so a retrieval system could reasonably return "Metrics of Care do not yet constitute their own system" as current instruction when mature doctrine exists. The corpus already distinguishes them elsewhere (mascots/326 names FREF-0740-MOC "Metrics of Care doctrine" and FREF-0400-METR "metrics experiments"); the records themselves did not.

**BHDSS.** The top-of-file status line ("Semi-functional (polite degradation)") reads as the current state, while the same record later reports MAP reclassification to CAAR (operationally retired, conceptually active) and LLG-BHDSS-TOAST documents the archive's deliberate refusal to deprecate BHDSS as a pedagogical case study. Three chronological conditions — service era, MAP reclassification, current archival stance — were being presented as one timeless status.

## Exact clarification made

- **FREF-0400-METR:** added an "Authority boundary" note at the top routing readers to FREF-0740-MOC as current doctrine and marking the file as the earlier experimental framing.
- **FREF-0740-MOC:** added a "Provenance" note in Purpose naming FREF-0400-METR as the preserved experimental-era record and this file as current doctrine.
- **FREF-0350-BHDS:** added a "Precedence note — state chronology" directly under the System Overview, dating "Semi-functional (polite degradation)" as historical operational state, naming the MAP/CAAR reclassification as current authority, and cross-referencing FREF-0815-MAP and LLG-BHDSS-TOAST.
- **FREF-0070-AOPT:** added two routing sentences in "Interaction with Metrics of Care" naming the two Metrics of Care records and stating that doctrine governs where they differ.

All clarifications are cross-references and state-dating only; no new canon was introduced.

Maintenance ID assigned 0.1.00024.reference-authority: identifiers 0.1.00015 through 0.1.00023 were already claimed by dockets merged to main after this branch's base, and the filename `2026-08-07-fnf-mech-015.md` already exists on main with different content. This entry therefore uses a distinct slug and filename.

## What was deliberately left alone

- The historical contradiction in Metrics of Care was deliberately preserved: FREF-0400-METR's "do not yet constitute their own system" and its memorial addendum remain untouched as the record of the experimental era; FREF-0740-MOC's mature doctrine was not retroactively merged with or flattened into the earlier framing.
- BHDSS's own later-state sentences ("MAP doctrine later reclassified these conditions as a subtype of CAAR…") were left verbatim; only the boundary note was added.
- No frontmatter `status` changes: FREF-0400-METR stays `draft` (its own authority signal), FREF-0740-MOC stays `published`.
- FREF-0410-SCLB and FREF-0430-EASP were audited and left unchanged. SCLB's "metrics-of-care experiments LLG-0820-MCR" language is consistent with the experimental framing and needs no routing. EASP's "(LLG-0820-MCR, LC-04 Soft Green Seal)" anchor follows the established incident-anchor convention used in FREF-0800-SCRL and FREF-0820-SPC.
- `content/guides/managed-absence-and-forms.md` still links to FREF-0400-METR as its governing Metrics of Care reference; left as-is because the link sits in a Managed Absence context where the experimental record's managed-absence discussion is the relevant content.
- No files relocated, no IDs renamed, no graph repair performed. Poetry (verse annexes in all reviewed records) was not touched.

## Files touched

- `content/reference/fref-0350-bhds.md` — precedence note
- `content/reference/fref-0400-metr.md` — authority boundary note
- `content/reference/empathegy/fref-0740-moc.md` — provenance note
- `content/reference/fref-0070-aopt.md` — routing sentences
- `content/changelog.md` — trunk count updated (33 → 34 records; origin/main advanced to 33 records at 2a90a639 while this pass was in flight, so the count reflects the merged state)
- `content/changelog/2026-08-07-reference-authority.md` — this record

## Verification performed

- `./bin/validate_graph.sh` passed (Boris graph diagnostics, compiled Cantilever publication, HTML IDs, and publication checks).
- Diff inspected: four reference records carry body-text notes only; verse sections, frontmatter schema, IDs, and statuses unchanged.
- Trunk count basis: 33 records on origin/main (2a90a639) as of 2026-08-07 plus this entry equals 34. This branch's original base predated several merged dockets (fnf-voice-001..007, fnf-poet-001, fnf-stub-001, fnf-mech-013, fnf-mech-015); the count was reconciled against the merged tree.

## Unresolved follow-up

- Whether the mature doctrine (FREF-0740-MOC) should someday state an explicit position on Assurance Optics; the "context signal" claim currently lives only in FREF-0070-AOPT and is routed there. Left unresolved per the evidence standard (no corpus basis in the doctrine itself).
- The draft experimental record FREF-0400-METR may warrant future promotion, retirement, or a formal predecessor link once the archive decides how experimental-era records are to be typed; no such decision was made here.
