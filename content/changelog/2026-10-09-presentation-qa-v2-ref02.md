---
title: "Presentation QA v2: Reference Slice 02 (Empathegy FREF-0580–0690)"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA v2: Reference Slice 02 (Empathegy FREF-0580–0690)

**Maintenance ID:** 0.1.00249.presentation-qa-v2-ref02
**Date:** 2026-10-09
**Scope:** `content/reference/empathegy/` — the fourteen records assigned by issue #972 (`fref-0580-cmps` through `fref-0690-gbhm`)

## What changed

- Read all fourteen assigned records in full, frontmatter through final verse line, before editing. Branched from `origin/main` (`1ce4635c`, the issue's assigned snapshot).
- `fref-0580-cmps.md`: field fragments→run-in labels. `Value:` ×4 and `Failure Mode:` ×4 under Surface Classes bolded as `**Value:**`/`**Failure Mode:**`; `Preferred classification:` (line 95) bolded.
- `fref-0590-cpsp.md`: `Examples:` ×5 (Primary Classes), `Additional indicator:` (line 162), `Minimum note:`/`Stronger note:` (lines 231/234) bolded.
- `fref-0600-ccph.md`: `Examples:` ×3 (Phrasebook Bands), `Approved warning:` (line 171), and the `Direct:`/`Continuity-compatible:`/`Unsafe reassurance drift:` label triad ×4 sections in Comparative Examples bolded.
- `fref-0620-cwsh.md`: `Examples:` ×4 (Primary Classes) and `Non-binding recommendation:` (line 213) bolded.
- `fref-0630-cwlv.md`: record mention→wiki link — `FREF-0635-WWLV` at lines 51 and 246 became `[[reference/FREF-0635-WWLV|FREF-0635-WWLV]]`. `Examples:` ×5, `Approved note:`, `Stronger note where needed:` bolded.
- `fref-0635-wwlv.md`: record mention→wiki link — `FREF-0630-CWLV` (lines 16, 64, 152), `FREF-0640-DCER` (lines 66, 153), `FREF-0410-SCLB` (line 154), `LLG-0821-SCL` (155), `LLG-0857-WLI` (156), `LLG-0864-WRC` (157), `FREF-0636-WCR` (158) became `[[canonical-id|source-spelling]]` links. Existing `**bold**` wrappers kept around the interlocks links, matching the `**[[lorelog/LLG-0007-COMA|LLG-0007-COMA]]**` convention in `LLG-0452-SOMA-COMA-CHRONOLOGY`.
- `fref-0636-wcr.md`: registry table cases `LLG-0864-WRC`, `LLG-0821-SCL`, `LLG-0857-WLI` (lines 39–41), `FREF-0635-WWLV` (line 51), and interlocks `FREF-0635-WWLV`/`FREF-0410-SCLB`/`LLG-0864-WRC` (lines 63–66) became wiki links.
- `fref-0640-dcer.md`: `FREF-0635-WWLV` (line 19) became a wiki link; `Examples:` ×5, `Minimum contradiction note:`, `Minimum compression warning:` bolded.
- `fref-0650-elfr.md`: `Examples:` ×5, `Minimum note:`/`Stronger note:` bolded.
- `fref-0670-gtcap.md`: `Examples:` ×5, `Minimum note:`/`Stronger note:` bolded.
- `fref-0690-gbhm.md`: `Examples:` ×4, `Recommended note:`/`Stronger note:` bolded.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, status, tags, `relations`, `{#...}` heading anchors, existing emphasis, and every `## Related Aphorisms`/`## Related Haikus`/`## Related Limericks` tail including stanza structure, hyphenated haiku residue (`fref-0636-wcr` lines 96–122), and two-space hard breaks.
- `fref-0610-cthr.md` and `fref-0660-glng.md`: reviewed unchanged. No field-fragment lead-ins, ID tokens, or implied-but-unexpressed structures exist in either record.
- `fref-0680-gtlm.md`: reviewed unchanged. `Preferred classifications include:`/`Disallowed shorthand includes:` are full clauses, not field fragments; no ID tokens present.
- `fref-0635-wwlv` / `fref-0636-wcr` left plain: `Witness Protocol` mentions (natural-language name of `reference/FREF-0880-WPRT`, no ID token — out of pass-2 scope) and `Minutes Without Motion (mascot 327)` (resolves to `mascots/M-0327` but the token is not a verbatim canonical ID). Flagged as needs decision.
- `fref-0636-wcr` table cell `COMA / SOMA / C.U.N.T.I.E.R.` — ambiguous directive tokens, not record IDs; left plain.
- Truncated text at `fref-0580-cmps` line 145 and `fref-0640-dcer` line 174 left untouched; flagged needs decision, matching the standing `fref-0200-cbac` precedent.
- No `<Details>`/`<Aside>`, footnotes, tables, or list splits were earned. No `**Archivist's Addendum**` annexes exist in this slice.

## Verification performed

- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — passed: Boris graph diagnostics and full Cantilever compile.
- `git diff` confirms Markdown structure only: `[[id|label]]` wrappers and `**` emphasis. No word, order, ID, frontmatter, or verse changes.
- Compiled-article inspection in `dist/cantilever/reference/`: wiki links resolve to real `.html` hrefs in `FREF-0630-CWLV` (2), `FREF-0635-WWLV` (10), `FREF-0636-WCR` (7), `FREF-0640-DCER` (1), including links inside `<td>` table cells; bold labels render as `<strong>`; verse `<br>` breaks intact in all eleven changed records and in unchanged controls `FREF-0610-CTHR`, `FREF-0660-GLNG`, `FREF-0680-GTLM`; zero literal `[[` remain on changed pages.

## Unresolved follow-up

- `fref-0580-cmps.md` line 145: sentence ends mid-word ("such systems sometimes mak") — possible source truncation defect; needs decision, posted to #970.
- `fref-0640-dcer.md` line 174: Handling Protocol list ends at `4. Mark` — possible source truncation defect; needs decision, posted to #970.
- `fref-0635-wwlv.md`/`fref-0636-wcr.md`: `Witness Protocol` and `Minutes Without Motion (mascot 327)` resolve to real records (`reference/FREF-0880-WPRT`, `mascots/M-0327`) but carry no canonical ID tokens; left plain, needs decision, posted to #970.
