---
title: "C4 Pipe-Table Records Audited — No Repairs Required"
parent: changelog
status: published
tags: ["changelog", "maintenance", "reference", "lorelog", "mascots"]
---

# C4 Pipe-Table Records Audited — No Repairs Required

**Maintenance ID:** 0.1.00287.c4-table-audit
**Date:** 2026-10-10
**Scope:** content/ — all 22 canon records carrying GFM pipe tables (27 tables total)

---

## What changed

Audited every pipe-table record in canon against the GFM pipe-table spec
(header row, delimiter row with matching column count, well-formed `---`
cells, escaped-pipe handling, blank-line separation, caption context). The
census — delimiter-row search plus a sweep of every line starting with `|` —
returns exactly the 22 records named in the spec-compliance manifest; no
latent unformed tables exist elsewhere in canon.

All 27 tables are structurally consistent. No malformed delimiters, no
column-count mismatches, no missing blank lines, no phantom columns, no
broken escapes. **Zero repairs were applied** — repairing nothing is the
finding. The irregularities present (labelled wiki links `[[id|label]]`
inside cells in eight records, three delimiter-row spacing styles, trailing
double-spaces inside LLG-0370's cells, `—` empty-cell conventions) are
uniform corpus conventions or inert residue, not spec violations.

Full per-record audit table, corpus-pattern notes, and data-room archetype
recommendations for the upcoming seed slice are filed in
`reports/c4-table-audit.md`.

## What was deliberately left alone

- `reference/empathegy/fref-0635-wwlv.md`, `fref-0636-wcr.md`,
  `fref-0660-glng.md`, `fref-0822-elra.md` — audited per slice scope but
  untouched under the empathegy out-of-scope ruling; all structurally
  consistent.
- `mascots/090.religious-administrative-seams.md` — audited, untouched under
  the religion-cluster-hub ruling; its 13-row registry is consistent.
- `content/spec-lab*` — absent from this checkout and excluded by ruling.
- `content/changelog.md` trunk count — bumped by coordinator at merge time.
- Frontmatter, verse tails, and hard breaks everywhere — no words changed.

## Files touched

- `content/changelog/2026-10-10-c4-table-audit.md` — this record
- `reports/c4-table-audit.md` — the audit deliverable (report, not a record)

No content records were modified.

## Verification performed

- Delimiter-row census: 22 files, matching the manifest's pipe-table count.
- Line-start `|` sweep: same 22 files; no stray pipe-joined prose anywhere
  else in `content/`.
- Every table verified by direct read: delimiter present, column counts
  consistent, blank line above, context intact.
- Coordinator spot-check: compiled `dist/cantilever/lorelog/LLG-0452-*.html`
  confirms `[[id|label]]` links render atomically inside table cells.
- `validate_graph.sh` run by coordinator — see PR body.

## Unresolved follow-up

- The `[[id|label]]`-inside-table-cell pattern (8 records) relies on Boris
  splitting cells around its own wiki-link atoms; verified in compiled
  output for LLG-0452; further instances presumed identical by convention.
