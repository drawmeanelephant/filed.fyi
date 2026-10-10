# C4 Table Audit — Pipe-Table Records (Pass 4, issue #1040)

**Date:** 2026-10-10
**Branch:** `freebuff/pass4-c4-tables`
**Scope:** All canon records under `content/` carrying GFM pipe tables (delimiter-row census).
**Census method:** searched `content/` for delimiter rows (`|`-separated cells of `-`/`:-`/`-:`/`:-:` runs, leading pipe optional) and for all lines starting with `|`. Both searches return the same 22 files — the full set. `content/spec-lab*` does not exist in this checkout and is excluded by ruling regardless.
**Reference:** `reports/spec-compliance-manifest.md` §2 (22 canon records, PARSES-RENDERED `<table>/<td>` [verified]).

## Audit result — summary

| Class | Records | Tables |
|---|---|---|
| COMPLIANT (in scope, audited, no repair needed) | 17 | 22 |
| FLAGGED (audited, scope-excluded by maintainer ruling) | 5 | 5 |
| REPAIRED | 0 | 0 |
| **Total** | **22** | **27** |

Every table in the census is structurally consistent with the GFM pipe-table
spec: header row present, delimiter row present with a cell count matching the
header, well-formed `---` delimiter cells, no stray pipes creating phantom
columns, a blank line above every table, and intact caption/heading context.
**No mechanical deviations were found, so no repairs were applied.** Repairing
nothing is the correct result for this slice: these records already compile as
real tables in production, and every irregularity observed is a uniform,
deliberate corpus convention rather than a spec violation.

## Per-record audit table

| File | Tables | Status | Detail |
|---|---|---|---|
| `content/reference/fref-0900-ccc.md` | 2 | compliant | T1 "Scope" lines 30–41 (3 cols, 11 rows); T2 "Mascot Map" lines 67–80 (3 cols, 12 rows). Delimiter `|---|---|---|` matches header. T2 cells carry `[[id\|label]]` wiki links — see Pattern note P1. Blank lines above both tables. |
| `content/reference/fref-0900-poet.md` | 1 | compliant | "Snapshot Archive Totals" lines 19–23 (3 cols, 3 rows). Cells carry `[[haikus\|Haikus]]`-style labelled links (P1). Historical snapshot record; table reads as intended. |
| `content/reference/fref-0661-agbx.md` | 1 | compliant | Tier table lines 21–26 (3 cols, 4 rows). Backtick-quoted mascot filenames in cells; no pipes in code spans. |
| `content/reference/fref-0920-rab.md` | 2 | compliant | T1 "Comparative Doctrine Matrix" lines 18–34 (11 cols, 15 rows); T2 "Capture Taxonomy" lines 51–57 (3 cols, 5 rows). The 11-col matrix is the widest table in canon; every row carries all 11 cells. `[^map]` footnote residue elsewhere in record is pre-existing and unrelated. |
| `content/reference/fref-0921-bpl.md` | 1 | compliant | Breeding Program Log lines 16–25 (5 cols, 8 rows), padded delimiter `|------|...|`. Blank line separates the header blockquote from the table. Status vocabulary consistent (`Confirmed`/`Pending`/`Denied`/`Recursive`). |
| `content/reference/fref-0922-cvs.md` | 1 | compliant | Capture Vector Sightings lines 16–35 (6 cols, 18 rows). Backticked lorelog IDs in Notes column; Seal Status vocabulary consistent. |
| `content/reference/fref-0923-manene-protocol.md` | 3 | compliant | T1 "Exhumation Calendar" lines 20–23 (9 cols, 2 rows); T2 "Shroud Versions" lines 39–43 (4 cols, 3 rows); T3 "Outcome Codes" lines 47–52 (2 cols, 4 rows). `—` em-dash empty-cell convention in T1's unexecuted cycle row; each cell still a real cell. |
| `content/lorelog/LLG-0352-DOGE-RUBRIC.md` | 1 | compliant | DOGE rubric lines 18–22 (5 cols, 3 rows). Only record in canon using spaced delimiter `| --- | --- |`; valid variant. Follows a `---` rule — blank line between them prevents any setext ambiguity. |
| `content/lorelog/LLG-0370-XEV.md` | 1 | compliant | Comparative treatment table lines 19–24 (5 cols, 4 rows). Cells end in two trailing spaces before the closing pipe (P3). |
| `content/lorelog/LLG-0450-SEAMS-PRESENT-TENSE.md` | 1 | compliant | "Cross-Seam Patterns" lines 105–111 (2 cols, 5 rows). |
| `content/lorelog/LLG-0451-JIGGLER-EMPATHEGY-BRIDGE.md` | 1 | compliant | "Adaptation" table lines 34–40 (2 cols, 5 rows). Last row carries `[[reference/FREF-0430-EASP\|FREF-0430-EASP]]` inside a cell (P1). |
| `content/lorelog/LLG-0452-SOMA-COMA-CHRONOLOGY.md` | 1 | compliant | "Chronological Thread" lines 20–29 (4 cols, 8 rows). `[[id\|label]]` links in the Entry column of every row, plus one inside an Outcome cell (P1). |
| `content/lorelog/LLG-0939-CORPORATE-MANENE.md` | 1 | compliant | Outcome-count table lines 28–33 (2 cols, 4 rows). Tallies with the MN-0001 row in fref-0923 (191/6/2/1). |
| `content/mascots/436.jiggler-jimmy.md` | 1 | compliant | "Metric Effect" lines 41–46 (3 cols, 4 rows). Before/after comparison shape. |
| `content/changelog/2026-08-07-fnf-mech-010.md` | 1 | compliant | Disposition table lines 31–41 (3 cols, 9 rows). |
| `content/changelog/2026-08-07-fnf-mech-011.md` | 1 | compliant | Disposition table lines 31–41 (3 cols, 9 rows). |
| `content/changelog/2026-08-07-fnf-haiku-contextual-qa.md` | 1 | compliant | Per-record removal table lines 24–32 (3 cols, 7 rows). Long prose cells; no stray pipes. |
| `content/mascots/090.religious-administrative-seams.md` | 1 | flagged | **Scope-excluded** (religion cluster hub owned by another slice/ruling). Audited anyway: "Registry" lines 28–42 (6 cols, 13 rows) is structurally consistent; every row's Paired Lorelog cell carries a `[[id\|label]]` link (P1). No repair indicated even if in scope. |
| `content/reference/empathegy/fref-0635-wwlv.md` | 1 | flagged | **Scope-excluded** (empathegy maintainer out-of-scope ruling). "Distinguishing Rules" lines 62–68 (3 cols, 5 rows); structurally consistent; `[[id\|label]]` links in cells (P1). |
| `content/reference/empathegy/fref-0636-wcr.md` | 1 | flagged | **Scope-excluded** (same ruling). "Current Entries" lines 37–41 (5 cols, 3 rows); structurally consistent; `[[id\|label]]` links in Case column (P1). |
| `content/reference/empathegy/fref-0660-glng.md` | 1 | flagged | **Scope-excluded** (same ruling). "Approved Substitutions" lines 34–48 (2 cols, 13 rows); structurally consistent. |
| `content/reference/empathegy/fref-0822-elra.md` | 1 | flagged | **Scope-excluded** (same ruling). "Routing Boundary Rules" lines 91–97 (2 cols, 5 rows); structurally consistent; `[[id\|label]]` links in cells (P1). |

## Corpus patterns observed

- **P1 — `[[id|label]]` pipes inside table cells.** Eight records place Boris
  wiki links with labels inside cells (fref-0900-ccc, fref-0900-poet,
  LLG-0451, LLG-0452, mascots/090, fref-0635-wwlv, fref-0636-wcr,
  fref-0822-elra). Under strict GFM cell-splitting an unescaped `|` would
  create a phantom cell, but these records ship as verified rendered tables —
  Boris treats `[[…]]` as an atomic inline during cell splitting (or resolves
  it upstream of the table pass). This is a uniform, deliberate corpus
  convention. **Do not "repair" it by escaping to `[[id\|label]]`** — a
  backslash inside `[[…]]` would likely corrupt the link itself. The correct
  mechanical fix, if ever needed, is `` `code span` `` or a bare `[[id]]`;
  neither is currently needed. **Coordinator verification:** confirmed in
  `dist/cantilever/lorelog/LLG-0452-SOMA-COMA-CHRONOLOGY.html` — cell emits
  `<td>…(<a href="LLG-0339-SIRC.html">LLG-0339-SIRC</a>)</td>`, single cell,
  link resolved, no phantom column.
- **P2 — Delimiter style variants.** Three styles coexist: compact
  `|---|---|`, padded `|------|-------|`, and spaced `| --- | --- |`
  (LLG-0352 only). All are spec-legal. No alignment colons exist anywhere in
  canon — the corpus has never used `:-`, `-:`, or `:-:` cells.
- **P3 — Trailing double-spaces inside cells (LLG-0370 only).** Every cell in
  the comparative table ends with two spaces before `|`. Cell-edge whitespace
  is stripped before inline parsing, so this is inert stylistic residue; left
  alone per the residue rule.
- **P4 — Escaped pipes: none.** `\|` appears nowhere in `content/`. No cell
  requires a literal pipe today; `\|` remains the documented mechanism if one
  ever does.
- **P5 — Empty-cell convention.** fref-0923 uses `—` (em dash) rather than
  truly empty cells for "not yet" values (MN-0002 row); fref-0661 uses `—`
  for "no representative." Both render as real cells — deliberate house
  convention, not malformed rows.
- **P6 — Section anatomy.** Every table is preceded by a blank line and
  introduced by a heading or a short line ("Per record:", "Findings as
  filed:", "Append-only…"), and followed by an interpretive note or a filing
  section. No table floats context-free.

## Flags for maintainer

1. **Scope-excluded records audited but untouched** per rulings:
   `reference/empathegy/fref-0635-wwlv.md`, `fref-0636-wcr.md`,
   `fref-0660-glng.md`, `fref-0822-elra.md`, and `mascots/090…seams.md`. All
   five are structurally consistent; nothing is pending except the ruling
   itself. If the owning slices later modify these tables, P1 applies.
2. ~~**P1 is a Boris-behavior assumption**~~ — RESOLVED by coordinator: one
   compiled `[[id|label]]`-in-cell instance (LLG-0452) spot-checked in
   `dist/cantilever/`; link renders inside its cell with no phantom column.
3. **No spec-lab in this checkout.** The C10 testbed (expected-rendering
   documentation for `tables.md`) is gitignored; its expectations are
   consistent with the pattern notes above (tables render; alignment colons
   legal-unused).

## Verification gap

This audit ran with read/write access only — no shell, no Boris binary, no
`boris check`, no `./bin/validate_graph.sh`. Structural findings are from
direct file inspection; rendering behavior is inferred from the manifest's
[verified] verdicts, the corpus's shipped state, and the coordinator's
compiled-output spot-check of the P1 pattern. `validate_graph.sh` to be run
by coordinator before merge.

## Recommendations — "data room" archetype seed slice

The archive's bureaucracy already converged on a small set of table shapes.
A seed slice should clone these anatomies rather than invent new ones:

| Archetype | Canonical exemplar | Shape | Anatomy |
|---|---|---|---|
| Append-only event log ("breeding log") | `fref-0921-bpl`, `fref-0922-cvs` | 5–6 cols: `Date \| Subject/Cross \| Pattern/Product \| Filed By \| Status [| Notes]` | Header blockquote naming the log + filing officer; one row per event; controlled status vocabulary; Filing Rules + Living Document Protocol sections beneath; optional blockquote marginalia |
| Registry / index of signatures | `mascots/090`, `fref-0636-wcr` | 5–6 cols: `Entity \| Code \| Function \| Classification \| … \| Paired record` | Last column links each row to its witness record (lorelog/mascot); registry states it is "additive" and "not a complaint ledger" |
| Scoring rubric | `LLG-0352` | 5 cols: `Dimension \| Weight \| Full condition \| Partial condition \| Disqualifying condition` | Wide condition cells; score-interpretation list below the table; staff-guidance note |
| Comparative matrix | `fref-0920` T1, `LLG-0370` | N×M: entity rows × department/seam columns | Condensed vocabulary cells ("lifecycle files", `B-4A`); immediately followed by an "it is not a claim that…" disclaimer |
| Outcome-code glossary | `fref-0923` T3, `LLG-0939` | 2 cols: `Code \| Disposition` (or `Outcome \| Count`) | Controlled ALL-CAPS vocabulary; referenced by form names (Form 51-E-MN) |
| Before/after effect table | `mascots/436` | 3 cols: `Metric \| Without X \| With X` | Satirical ledger voice; interpretation paragraph beneath |
| Disposition / audit-form enumeration | changelog dockets | 3 cols: `ID \| Item \| Disposition` | Maintenance-bookkeeping shape; pairs with bulleted field lists for the form itself (fref-0923 Form 51-E-MN shows fields as bullets, not a table — fields-with-help-text stay bulleted) |

Conventions any new data-room table must keep:

- Plain `---` delimiter cells only; **no alignment colons** (none exist in
  canon; introducing `:-` would be a novel convention, not a repair target).
- Leading and trailing `|` on every row — the corpus is uniform.
- One entity per row; append-only logs append at the bottom and never
  reconcile.
- Blank line above the table; a short naming line above that; an
  interpretive or limitation note below.
- Cells may carry wiki links (`[[id]]` or `[[id|label]]`), code spans,
  em-dash empties, and controlled status vocabularies — all established.
- The table is the record: prose explains what the table is *not* claiming,
  never restates its rows.
