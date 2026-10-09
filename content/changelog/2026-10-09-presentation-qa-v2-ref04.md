---
title: "Presentation QA v2 Reference Slice 04: Fourteen Records Reviewed, Thirteen Changed"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA v2 Reference Slice 04: Fourteen Records Reviewed, Thirteen Changed

**Maintenance ID:** 0.1.00259.presentation-qa-v2-ref04
**Date:** 2026-10-09
**Scope:** `content/reference/` — the fourteen records assigned by workload issue #974 (six empathegy doctrine records `fref-0830-symc`–`fref-0880-wprt`, three forms-registry records `fref-0020-maps`, `fref-0860-dexe`, `fref-0870-qthr`, five top-level records `fref-0030-avsg`–`fref-0070-aopt`)

## What changed

- Read all fourteen assigned records in full, frontmatter through final verse tail, before editing. All files byte-matched snapshot `1ce4635c5dedba717dc42b40045228044940771c`; no intervening changes, no moves or identity shifts.
- `fref-0020-maps.md`: record mentions → wiki links. Nineteen in-body LLG tokens converted to `[[lorelog/<id>|<source-spelling>]]`, each target verified against canonical `id:` frontmatter. `relatedEntries` field name → code span. `Common CAAR exemplars include:`/`Examples:`/`Exemplars:` lead-ins → `**Label:**` run-ins. The `Marginal annotation (Forms Integrity Review):` margin note → `**Label:**` run-in + `>` blockquote.
- `fref-0070-aopt.md` (draft, reviewed like published per ruling): nine record mentions → wiki links, including the unambiguous bare prefix `FREF-0080` → `[[reference/FREF-0080-SRBP|FREF-0080]]` and the path-shaped code span `` `reference/fref-0823-tsrt` `` → `[[reference/FREF-0823-TSRT|reference/fref-0823-tsrt]]` with lowercase label preserved. Three code-spanned IDs (`FREF-0560-ADJC`, `FREF-0570-APCR`, `fref-0823-tsrt`) converted mechanism-style from code spans to links. Colon-less `Doctrine Note` lead-in bolded with no invented punctuation; `Boundary Note:` and `Typical steps include:` run-ins bolded.
- `fref-0030-avsg.md`: `` `FREF-0560-ADJC` `` code-span mention → wiki link; `assuranceVocabulary` field name → code span; `Example:`/`Example wording:` lead-ins → `**Label:**` run-ins.
- `fref-0050-avoc.md`: the addendum's legacy relative link `[DS-404-ALPHA](../lorelog/DS-404-ALPHA.md)` → `[[lorelog/DS-0404-ALPHA|DS-404-ALPHA]]` — mechanism change approved by the issue's first reference ruling; label preserves the `DS-404` spelling even though the canonical ID pads to `DS-0404`. `Scan reports may detect:`/`Example:`/`Preferred constructions:` lead-ins bolded.
- `fref-0060-acmn.md`: `SCAN:`/`WORDING:` speaker labels inside the existing blockquote → `**Label:**`; `Wording offers:`/`The recorded answer:` lead-ins bolded.
- Empathegy records (`fref-0830-symc`, `fref-0840-teh`, `fref-0850-vard`, `fref-0860-vex`, `fref-0870-wtsl`, `fref-0880-wprt`): field-fragment lead-ins → `**Label:**` run-ins throughout — the repeated `Examples:`/`Preferred phrases:`/`Disallowed phrases:` family plus record-specific labels (`Minimum caution note:`, `Strong indicator:`, `Ask:`, `Recognized signs:`, `Indicators include:`, `Witnessing establishes:`/`does not establish:`, `Witnesses may:`/`may not:` pair, `A witness may preserve:`, `Minimum boundary sentence:`, `Symptoms include:`, `Seals may indicate:`, `Preferred classification(s):`, `Common drift paths:`, `Approved phrases:`). Prescribed verbatim note texts in `symc`, `vex`, and `wprt` became `>` blockquotes under their bolded labels.
- `fref-0860-dexe.md`, `fref-0870-qthr.md`: `Preferred phrases:`/`Disallowed phrases:` lead-ins bolded; `Persuasion here includes:` bolded in `qthr`.
- `fref-0040-avdn.md`: reviewed unchanged — see below.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, status, tags, `relations`, `{#...}` heading anchors, existing emphasis and markup, and every Related Aphorisms/Haikus/Limericks tail including stanza structure and two-space hard breaks. No token in a `## Related *` region was touched.
- `fref-0040-avdn.md`: internal-notes record already carries its implied structure — opening blockquote, bullet list, existing `<Aside kind="note">` addendum, verse residue. No field-fragment lead-ins, no record-ID tokens, no annex material. Earns nothing; unchanged.
- `fref-0070-aopt.md` line 15: `(LLG-0327)` bare prefix resolves to two canonical IDs (`LLG-0327-AVA`, `LLG-0327-AVR`); left plain per the ambiguous-prefix ruling and flagged needs decision. Artifact/mascot designations `AV-14`, `LC-04`, `CE-5`, `AC-11`, `BX-6`, `LX-2`, `MA-LCGU`, `AVA`, `SOMA`, `COMA`, `C.U.N.T.I.E.R.` left plain — names, not identifier tokens.
- `fref-0020-maps.md`: form designations used as titles (`Form 40‑C`, `Form 51‑E`, `Form 12‑A`, `DS-404-ALPHA`, `32‑A`, `COMA-19`, `51‑E‑`) left plain per the designation convention; `CAAR`/`LCGU`/`STCP`/`AAOA`/`MAP` classification acronyms left plain as prose nouns; `DMAIC-RITE`/`Engagement Labyrinth` are filename-stem/natural-language mentions, not canonical IDs — plain.
- `fref-0860-dexe.md`/`fref-0870-qthr.md`: `RoboShirker` mascot mention is natural language with no ID token — out of scope; `CAAR`/`STCP`/`AAOA` and `QTHR-1`–`QTHR-5` designations left plain.
- `fref-0030-avsg.md`: `013.htaccessius-the-doorman` filename-stem cross-reference inside the existing `<Aside>` left plain — unverifiable, flagged needs decision. Verse-like residue lines after the `<Aside>` left untouched.
- Clause-length lead-ins that read as prose rather than labels (`A condition qualifies as Symbolic Completion when:`, `When a training echo is suspected:`, `Escalate witness handling to operational review when:`, etc.) left unbolded — only label-shaped lead-ins earned the run-in transform.
- Empty `## Related Haikus` heads in `dexe`/`qthr`/`aopt` are established corpus residue (44 instances); not flagged, not edited.

## Verification performed

- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — passed: Boris graph diagnostics, full Cantilever compile (2,408 pages), verse residue check, 0 duplicate HTML IDs, Filed certification.
- `git diff` confirms Markdown structure only — `[[id|label]]` wrappers, `**Label:**` emphasis, `> ` blockquote markers, one `relatedEntries`/`assuranceVocabulary` code span. No word, order, ID, frontmatter, or verse changes; pre-existing trailing-space hard breaks preserved.
- Compiled-article inspection of all thirteen changed records plus the `FREF-0040-AVDN` unchanged control: every wiki link resolves to a real `.html` href (19 in MAPS, 10 in AOPT including `FREF-0080-SRBP`, `DS-0404-ALPHA` inside the AVOC `<Aside>`), zero literal `[[` delimiters remain, `<strong>` label and `<blockquote>` counts match applied transforms, verse `<br>` hard breaks intact.
- `python3 scripts/check_collection_counts.py` — PASS after this docket; changelog trunk recounted (204), README totals updated (2,409 pages / 2,398 satellites).

## Unresolved follow-up

- `fref-0070-aopt.md` line 15: `(LLG-0327)` shorthand is prefix-ambiguous (`AVA` vs `AVR`) even though the prose names the Assurance Vocabulary Annex; left plain, flagged needs decision on #970.
- `fref-0030-avsg.md` line 184: `013.htaccessius-the-doorman` addendum cross-reference has no canonical `id:` match; flagged needs decision on #970 as a possible dangling reference.
