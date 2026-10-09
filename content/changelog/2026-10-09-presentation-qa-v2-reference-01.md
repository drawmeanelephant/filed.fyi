---
title: "Presentation QA Reference v2-01: Second-Pass Review of 14 Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA Reference v2-01: Second-Pass Review of 14 Records

**Maintenance ID:** 0.1.00250.presentation-qa-v2-reference-01
**Date:** 2026-10-09
**Scope:** `content/reference/` — the 14 records assigned by workload issue #971 (pass 2, rich structure)

## What changed

Read all 14 assigned records in full, frontmatter through final line, including each record's Related Aphorisms/Haikus/Limericks residue. All 14 files are byte-identical to snapshot `1ce4635c5dedba717dc42b40045228044940771c` (current `main`); nothing moved since the assignment was cut.

- `FREF-0810-DSL.md`: `(FREF-0815)` shorthand linked to `[[reference/FREF-0815-MAP|FREF-0815]]` — the prefix resolves to exactly one reference record (line 15). `LLG-0244-FSC` and `LLG-0218-FSD` in the Mapping line became wiki links (line 107); both are already this record's `relations` targets. `FREF-0823-TSRT` linked at line 112. Run-in labels bolded: `**Boundary Note:**`, `**Examples include:**`, `**Example:**` ×5, `**Mapping:**`, `**Complimentary Ghostline:**`, `**Archive position:**`.
- `FREF-0815-MAP.md`: `Training Echo Handling (FREF-0840-TEH)` linked at line 55; `FREF-0823-TSRT` linked at line 103. Short codes `SOMA-72` and `COMA-19` code-spanned at lines 97 and 106, per the pilot note that short form codes may span with per-record consistency. Run-in labels bolded: `**Boundary Note:**` ×2, `**Example:**`, `**Failure domain:**`, `**Archive position:**`.
- `audits/fref-audt-case.md`: legacy field names `caseNumber` (×2), `relatedEntry`, `parentEntry` became code spans (line 21), matching the already-spanned `CASENUM`, `FREF-0901`, `FREF-0918`, `docs/` in the same sentence.
- `directives/tri-directive-doctrine.md`: the eight bolded exemplar IDs in Single-Directive Exemplars became `**[[lorelog/…|…]]**` wiki links inside their existing bold (lines 14–25); all eight targets verified against canonical `id:` frontmatter. Prose form numbers `23-O`, `24-O` and the provisional code range `F17–F93` became code spans.
- `empathegy/fref-0500-egyx.md`: the record is a spec-sheet taxonomy carrying `Definition:` / `Characteristics:` / `Operational Handling:` / `Notes:` lead-ins on their own lines across five state classes — all 20 bolded as run-in labels.
- `empathegy/fref-0510-akdb.md`: `**Examples:**` ×5, `**Signs include:**`, `**A key sign:**`, `**Ask:**`, `**Minimum note:**`, `**Stronger note:**`, `**Preferred phrases:**`, `**Disallowed phrases:**` bolded. The colon-less `Doctrine Note` lead-in (line 274) bolded without inventing punctuation, per the reference ruling.
- `empathegy/fref-0520-estl.md`: `**Preferred phrases:**` and `**Disallowed phrases:**` bolded only.
- `empathegy/fref-0530-anxr.md`: `**Common sources:**` ×5, `**Minimum disclaimer:**`, `**Examples:**`, `**Preferred phrases:**`, `**Disallowed phrases:**` bolded.
- `empathegy/fref-0540-anxt.md`: `**Examples:**` ×5, `**A crucial sign:**`, `**Ask:**`, `**Minimum note:**`, `**Stronger note:**`, `**Preferred phrases:**`, `**Disallowed phrases:**` bolded. Code-spanned `FREF-0560-ADJC` became `[[reference/FREF-0560-ADJC|FREF-0560-ADJC]]` (line 265); target verified.
- `empathegy/fref-0550-apan.md`: code-spanned `FREF-0560-ADJC` (line 40) and `FREF-0570-APCR` (line 60) became wiki links; both targets verified. `**Preferred phrases:**` / `**Disallowed phrases:**` bolded.
- `empathegy/fref-0560-asar.md`: `**Examples:**` ×4, `**Common patterns:**`, `**Preferred phrases:**`, `**Disallowed phrases:**` bolded.
- `empathegy/fref-0570-celc.md`: `**Typical properties:**`, `**Risk:**`, `**Examples:**` ×2, `**Possible routes:**`, `**Possible outcomes:**`, `**High-survival traces:**`, `**Low-survival traces:**`, `**Mascot Note:**` bolded; colon-less `Coverage Axis Note` (line 252) bolded verbatim.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, `relations`, `{#...}` heading anchors, quoted/documentary material, verse stanzas, indentation, and two-space hard breaks. No `## Related *` tail was touched.
- `audits/fref-audt-cont.md` reviewed unchanged: the one flagged item already carries `325.peppy-clerk.mdx` and the four missing-tag names as code spans; `Bin 8C` is a name, not an identifier.
- `audits/fref-audt-intg.md` reviewed unchanged: `INTEGRITY` already spanned; the record reports zero gaps and carries no further identifier tokens.
- `FREF-0815-MAP.md` line 15 `(FREF-0810)` stays plain: the prefix resolves to both `FREF-0810-DSL` and `FREF-0810-SLNT` — the issue's own ambiguity example.
- `tri-directive-doctrine.md`: `51-E`, `SOMA-14` occur inside record titles (names, not identifiers) and stay plain.
- `fref-0520-estl.md`: `ATDE-1`–`ATDE-5` sit inside headings (short codes stay plain in headings); `*This is working as designed*.` italic-marker quirk at line 87 preserved as residue.
- `fref-0570-celc.md` line 316 `SI-9`: mascot token that does not verify verbatim against a canonical `id:` (canonical is `mascots/M-0078`); left plain and flagged needs-decision.
- Sentence-shaped lead-ins (`Annex Recovery may be initiated when:`, `Outputs may include:`, `Appeals may challenge:` and kin) left plain — they are clauses, not field fragments.
- No `**Archivist's Addendum**` annex exists in any assigned record; the annex transform never fired.

## Verification performed

- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for exact outcome.
- `python3 scripts/check_collection_counts.py` — see PR body for exact outcome.
- Compiled-article inspection of every changed record in `dist/cantilever/reference/` — see PR body.

## Unresolved follow-up

- **needs decision** — `fref-0570-celc.md` line 316: `SI-9` does not verify verbatim against a canonical `id:` (`mascots/M-0078`); possible dangling reference.
- **needs decision** — `fref-0570-celc.md` line 86: "The subjects account is affirmed" — missing apostrophe; word-level defect, not a presentation fix.
- **needs decision** — `fref-0540-anxt.md` line 62: "Interpretations 2 hidden behind the headline" — reads as a fragment; possibly intentional residue.
- **needs decision** — `fref-0520-estl.md` line 87: `*This is working as designed*.` — italic close precedes the period; markup placement quirk left as-is.
