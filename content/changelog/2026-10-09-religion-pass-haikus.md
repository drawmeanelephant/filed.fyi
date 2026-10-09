---
title: "Religion pass: haiku records — HAI-LLG-0921..0938 + seam set (23 records)"
parent: changelog
status: published
tags: ["changelog", "religion-pass", "haikus"]
---

# Religion pass: haiku records — HAI-LLG-0921..0938 + seam set (23 records)

**Maintenance ID:** 0.1.00277.religion-pass-haikus
**Date:** 2026-10-09
**Scope:** `content/haikus/` — religion pass poetry slice under #1027/#1028 (23 records: `hai-LLG-0921-CURIA-ARCHIVE` … `hai-LLG-0938-CAPTURE-VECTOR`, `hai-seam-CLER`/`DOCT`/`PROP`/`STAT`/`SUCC`)

## What changed

23 haiku records were converted from the focused-poetry-pass MDX sources into Boris-compliant Markdown.

- 18 mascot-named records were bound through the LLG infix convention: `hai-<slug>.mdx` → `haikus/HAI-LLG-<paired-num>-<LLG-SLUG>` (e.g. `hai-curial-archivist.mdx` → `haikus/HAI-LLG-0921-CURIA-ARCHIVE`), each carrying `relations:` edges to its consolidated mascot ID and its paired lorelog record.
- 5 seam records (`CLER`, `DOCT`, `PROP`, `STAT`, `SUCC`) were bound as `haikus/HAI-SEAM-<CODE>`, each related to `mascots/M-0090` (the consolidated Religious Administrative Seams registry per the Option B ruling).
- Source `coreCounterpart` frontmatter was folded into `relations:` and the `**Core counterpart:**` body line was rewritten as a `[[canonical-id|label]]` wikilink. For the 13 failure-signature sources consolidated under `mascots/M-0090`, the wikilink label preserves the source mascot name (e.g. `[[mascots/M-0090|Waqf Administrator]]`).
- `/`-joined single-line verse was split into three-line stanzas with two-space hard breaks on non-final stanza lines, matching the collection's verse convention.
- Frontmatter uses Boris keys only; source `published` status was normalized to `archived` per the haiku collection convention, and `tags` were remapped to `["haikus", "religious-administration", "core-bound"]`.
- Trunk counts updated: `content/haikus.md` 520 → 543, `content/changelog.md` 228 → 229, README totals 2,433 → 2,457 pages / 2,422 → 2,446 satellites.

## What was deliberately left alone

- The seam sources' `coreCounterpart` value of `reference/FREF-0920-RAB` was not carried into `relations:` or the body wikilink; seam poems relate to `mascots/M-0090` per the pass directive. The FREF edge can be asserted once the reference record lands in the rel-core PR if wanted.
- Cluster-zip templated verse for shared names (superseded by the focused poetry pass) and the held cluster-only seam verse (DISP/EDUC/FAML/GRIE/RECD) were not touched.
- No mascot, lorelog, or reference records were created here; those land in sibling religion-pass slices.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `./bin/validate_graph.sh` — see PR body for outcome.
- `python3 scripts/fix_verse_hard_breaks.py content --check` runs inside the validation gate.

## Unresolved follow-up

- `relations:` and `[[wikilink]]` targets `mascots/M-0086`..`M-0091` and `lorelog/LLG-0921`..`LLG-0938` resolve only after the rel-core PR merges; dangling-target findings against those IDs are expected pending that merge.
