---
title: "Presentation QA v2 — lorelog 09: 14 records reviewed, 7 changed"
parent: changelog
status: published
tags: ["changelog", "presentation", "lorelog"]
---

# Presentation QA v2 — lorelog 09: 14 records reviewed, 7 changed

**Maintenance ID:** 0.1.00239.presentation-qa-v2-lorelog-09
**Date:** 2026-10-09
**Scope:** `content/lorelog/` (LLG-0401-SCAS-ECHO through LLG-0408-DTS-DEP), `content/changelog/`

Second-pass ("rich structure") presentation review of the 14 lorelog records assigned by issue #943 at snapshot `4e6a82e8`. HEAD matched the snapshot; no intervening diffs. All 14 records read in full, frontmatter through verse tails. Seven records earned a transform; seven reviewed unchanged.

## What changed

- `LLG-0401-SCAS-ECHO.md`: `LLG-0400-SCAS` (line 14) → `[[lorelog/LLG-0400-SCAS|LLG-0400-SCAS]]` — unambiguous record-ID mention; target confirmed via `id:` and existing `relations`. `END-OF-EXPERIMENT` (lines 51, 127) → code span — literal form designation.
- `LLG-0402-FSR.md`: `LLG-0400-SCAS` (line 78) → wiki link, same confirmed target.
- `LLG-0403-WBA.md`: Bricky's one-line deviation report (line 24) moved from inline italics into a `>` block — verbatim filing already introduced as quotation; wording, italics, and quotes preserved.
- `LLG-0404-DCP.md`: `LLG-0334-CSI` and `LLG-0339-SIRC` (line 14) → wiki links — both IDs confirmed via `id:` and `relations`.
- `LLG-0405-DEV.md`: code spans on document/form codes that are the record's subject — `DEV-2026-0041`, `DEV-2026-0042`, `DEV-3A`, `DEV-4B`, `SOP-089`, `CA-7`, `CA-8` (lines 14–21, 35–37). Existing bold on `DEV-3A` and the `CA-8` sentence retained around the spans.
- `LLG-0405-MEL.md`: code spans on method-registry tokens — `perform`, `escalate`, `document`, `reassure` in the approved list (lines 19–22) and catalog excerpt (lines 68–71); `~~pause~~`, `~~stop~~`, `~~refuse~~` in the struck marginalia (lines 75–77); inline verb tokens `stop` (line 13, inside existing bold) and `stop`, `cancel`, `refuse`, `document` (lines 97–98). Proposed normalizations ("perform at a reduced rate", lines 26–28) left plain — they are phrasings, not registry tokens.
- `LLG-0405-SAC.md`: `(LLG-0400-SCAS)` parenthetical (line 15) → wiki link; `END-OF-EXPERIMENT` (lines 21, 65) → code span, consistent with SCAS-ECHO treatment.
- `LLG-0408-AH1.md`: `END-OF-EXPERIMENT` (line 82) → code span, consistent treatment of the same form designation.

## Reviewed unchanged (successful reviews)

- `LLG-0402-GMP.md` — Kindy's note is already a verbatim blockquote (lines 23–25); `Form 51-E` inside quoted material and `Batch 7714-C` (line 14) left plain per form-name precedent and doubt-leaves-plain rule.
- `LLG-0403-CWR.md` — rituals already expressed as bold run-in list items (lines 36–46); classifications at lines 64–65 already bolded; no ID tokens in body.
- `LLG-0404-UPLC.md` — incident list (lines 16–21) and Kindy's blockquoted note (lines 27–32) already express the structure; `Compound 17-F` is a name, not an identifier.
- `LLG-0406-FSD.md` — already the most code-spanned record in the batch (lines 32–34, 44, 83, 105–109, 118). `SA-SS-TEL` (line 156) is a doctrine-node name with no canonical `id:` — left plain, noted here.
- `LLG-0407-SSP.md` — thresholds already sectioned and listed; body references (SCAS, SAC, CNTR, UIS) carry no ID tokens, so wiki-link transform is out of scope.
- `LLG-0408-DTS-DEP.md` — chronology already a bold-labelled list (lines 15–20); table conversion considered and declined — the run-in labels already express the timeline, and tabular transform is expected to be rare.

## What was deliberately left alone

- All frontmatter, canonical IDs, tags, relations, titles, and the `## Related *` aphorism/haiku/limerick tails — including two-space hard breaks and struck-through marginalia semantics.
- `LLG-0XXX: FeelingSeeder, But With a Different Hat` (LLG-0406-FSD line 141) — a reserved placeholder, not a resolvable record.
- Natural-language references without ID tokens (e.g. "see FSR", "the Dual-Certification Protocol", TNS) — out of scope for pass-2 slices.
- `SA-SS-TEL` mentions — no canonical ID exists; left plain rather than hard-erroring the graph.

## Verification performed

- `python3 scripts/check_collection_counts.py`: PASS after updating `content/changelog.md` Count and README totals.
- `BORIS_BIN=~/.local/bin/boris ./bin/validate_graph.sh`: see PR body for exact outcome.
- Compiled-article inspection of all seven changed records in `dist/cantilever/`: see PR body for exact pages and results.

## Unresolved follow-up

- None blocking. `SA-SS-TEL` (Synthetic Affect Successor Suite) is referenced as a doctrine node in at least four records (LLG-0406-FSD, LLG-0408-AH1, LLG-0409-PRE, LLG-0811-EG) but has no canonical record; a maintainer may want a real node someday. Not filed as a defect — unlinked states are valid archive conditions.
