---
title: "Presentation QA v2 Reference 08: Rich-Structure Review of Fourteen Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA v2 Reference 08: Rich-Structure Review of Fourteen Records

**Maintenance ID:** 0.1.00249.presentation-qa-reference-08
**Date:** 2026-10-09
**Scope:** `content/reference/` — the fourteen records assigned by workload issue #978 (FREF-0822-ACTN, FREF-0823-TSRT, FREF-0824-OVAA, FREF-0825-VHCN, FREF-0826-TSIN, FREF-0827-TSXL, FREF-0840-RWRR, FREF-0841-RWIN, FREF-0850-MARD, FREF-0875-DLAB, FREF-0900-CCC, FREF-0900-POET, FREF-0901-APIV, FREF-0902-CLLS)

## What changed

- Read all fourteen assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue in each. The worktree HEAD is the issue's snapshot commit `1ce4635c5dedba717dc42b40045228044940771c`; no assigned file moved or changed since the snapshot.
- `fref-0823-tsrt.md`: three record-mention→wiki-link conversions inside the existing bold Doctrinal Boundaries lead-ins (lines 40, 41, 43) — FREF-0070→`reference/FREF-0070-AOPT`, FREF-0815→`reference/FREF-0815-MAP`, LLG-0411→`lorelog/LLG-0411-RRC`, labels preserving the shorthand spellings.
- `fref-0824-ovaa.md`: `Status Note:` lead-in (line 11) became `**Status Note:**` run-in.
- `fref-0825-vhcn.md`: `Name under review:` lead-in (line 13) became `**Name under review:**` run-in.
- `fref-0826-tsin.md`: eight record-mention→wiki-link conversions — the seven code-spanned full IDs in Shelf contents (lines 15–21) and the plain `LLG-0408-DTS-DEP` mention at line 28.
- `fref-0827-tsxl.md`: six record-mention→wiki-link conversions — the code-spanned full IDs in Near doctrine (lines 15–17) and Near incidents (lines 21–23).
- `fref-0840-rwrr.md`: nine field-fragment→run-in labels (`Signs include:` ×6, `Common indicators include:`, `A key sign:`, `Ask:`, `Minimum note:`, `Stronger note:`, `Preferred phrases:`, `Disallowed phrases:`); the two curly-quoted specimen notes (lines 198, 202) became blockquotes, quotation marks retained.
- `fref-0841-rwin.md`: the four `Collection:` lead-ins in Suggested grouping labels (lines 19–22) became `**Label:**` run-ins; the coda `Indexed, not elevated.` (line 35) was bolded, matching the identical already-bold coda in sibling `fref-0826-tsin.md` line 31.
- `fref-0875-dlab.md`: five record-mention→wiki-link conversions (lines 82, 96, 97, 206, 207); twelve field-fragment→run-in labels (`Examples include:` ×4, `Cross-reference:` ×4, `Ask:`, `Minimum note:`, `Stronger note:`, `Preferred phrases:`, `Disallowed phrases:`).
- `fref-0900-ccc.md`: `Origin:` lead-in (line 22) became `**Origin:**` plus a wiki link to `lorelog/LLG-0811-EG`; five record-mention→wiki-link conversions inside the existing bold lead-ins of Interaction with Other Doctrine (lines 57–61, including bare-prefix shorthands LLG-0451 and LLG-0450, each resolving to exactly one canonical `id:`); eleven `M-NNNN` tokens in the Mascot Map table (lines 69–80) linked to their verified `mascots/M-0NNN` canonical IDs.
- Nine records changed, five reviewed unchanged. Totals reconcile against the fourteen-file assignment.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, status fields, tags, relations, `{#...}` heading anchors, existing emphasis, quoted/documentary material, verse stanzas, two-space hard breaks, and double-blank-line residue spacing — across all fourteen records.
- `fref-0822-actn.md` — reviewed unchanged: already lists its guidance and carries an earned bold pivot at line 29; no ID tokens, lead-ins, or annex structures present.
- `fref-0850-mard.md` — reviewed unchanged: the memorandum already carries `**TO:**`/`**FROM:**`/`**SUBJECT:**`, tier labels, four-condition labels, and `**A Practical Test:**`. A stray trailing space at line 27 was left as found (no whitespace cleaning).
- `fref-0900-poet.md` — reviewed unchanged: snapshot totals are already a table; `JULES-POET` and `.mdx` are a retired campaign name and a file extension, not record IDs.
- `fref-0901-apiv.md`, `fref-0902-clls.md` — reviewed unchanged: eleven-line historical-residue stubs; `INDEX_VAULT`/`LEDGER_STATIC` appear only in headings/titles where short-form codes stay plain.
- `FREF-0810` shorthand in `fref-0823-tsrt.md` line 42 — ambiguous per the issue ruling (resolves to both `FREF-0810-DSL` and `FREF-0810-SLNT`); left plain.
- Path/filename stems that are not canonical IDs: `reference/fref-0840-rwrr`, `lorelog/llg-04xx-*`, `posts/replacement-without-release` (canonical `posts/POST-0002`) in `fref-0841-rwin.md`; `938.vantage-hollow` (canonical `mascots/M-0938`), `v0.1.1-trust-surface-residue` (canonical `releases/REL-0002`), `trust-records-after-proof-decay` (canonical `posts/POST-0003`) in `fref-0826-tsin.md`; mascot stems `076.*`/`229.*`/`271.*`/`938.*` in `fref-0827-tsxl.md` — all left plain.
- `AAOA`/`STCP` managed-absence class codes (`fref-0875-dlab.md` line 208) and `SEAM-001`–`SEAM-010` seam keys (`fref-0900-ccc.md` table) — class/code names used plainly across the corpus, not record IDs; left plain.
- `*End of Doctrine FREF-0900-CCC.*` (line 104) — self-reference closing device; a self-edge was not earned, left plain.
- Clausal lead-ins (`Dead Labor must be distinguished from:`, `When this condition is identified:`, etc.) — full sentence fragments rather than field labels; left plain.
- No `<Details>`/`<Aside>` wraps: no `**Archivist's Addendum**` annexes exist in this slice, and no boilerplate interpretation annex was present. No enumeration→list splits, footnotes, or new tables earned.

## Verification performed

- `git diff` on the nine changed records confirms Markdown structure only; stripping `**`/`>`/`[[|]]` leaves every changed line byte-identical to its source.
- `python3 scripts/check_collection_counts.py` — PASS after this docket: changelog declared 204, actual 204; source 2,409 pages / 11 trunks / 2,398 satellites; README totals updated to match.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for exact outcome, including wiki-link resolution against the frozen graph.
- Compiled-article inspection of the changed records plus unchanged controls — see PR body for exact pages and results.

## Unresolved follow-up

- None. The ambiguous `FREF-0810` prefix is a known per-issue ruling, not a defect; no `needs decision` items were raised from this slice.
