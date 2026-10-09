---
title: "Religion Pass: Aphorism Records (APH-LLG-0921..0938 + Seam Set)"
parent: changelog
status: published
tags: ["changelog", "aphorisms", "religion-pass"]
---

# Religion Pass: Aphorism Records (APH-LLG-0921..0938 + Seam Set)

**Maintenance ID:** 0.1.00279.religion-pass-aphorisms
**Date:** 2026-10-09
**Scope:** `content/aphorisms/` — twenty-three new records converted from the religion-pass poetry artifacts

## What changed

- Converted all 23 aphorism MDX sources from the focused poetry pass into Boris-compliant Markdown under `content/aphorisms/`, per the canonical ID map (`.inbox/religion-pass/ID-MAP.md`).
- Eighteen mascot-bound records filed as `APH-LLG-0921-CURIA-ARCHIVE` through `APH-LLG-0938-CAPTURE-VECTOR`, each bound by LLG infix to its paired lorelog record and by `relates_to` edge to its canonical mascot (M-0086–M-0089 for sources 074–077; M-0090 consolidated registry for sources 078–090; M-0091 for Capture Vector).
- Five seam records filed as `APH-SEAM-CLER`, `APH-SEAM-DOCT`, `APH-SEAM-PROP`, `APH-SEAM-STAT`, `APH-SEAM-SUCC`; their source `coreCounterpart` pointed at `reference/FREF-0920-RAB` and was remapped to `mascots/M-0090` per the ID map ruling.
- Frontmatter reduced to the Boris closed schema (`title`, `id`, `parent`, `status`, `tags`, `relations`); `coreCounterpart` folded into `relations` plus a `**Core counterpart:**` wikilink line per the conversion rules. Source tag `poetry` normalized to the collection tag `aphorisms`; `religious-administration` and `core-bound` retained.
- Titles taken from the paired lorelog records; headings follow the collection's `… Aphorisms` convention. Aphorism text preserved verbatim.
- `content/aphorisms.md` trunk count 542 → 565; `content/changelog.md` count advanced for this docket; README totals updated to match source.

## What was deliberately left alone

- No edits to existing aphorism records, including the lowercase `aph-LLG-*` residue.
- No `relates_to` edges to the paired `lorelog/LLG-09xx` records were added; the binding is carried by the LLG ID infix alone, matching the instruction set for this slice.

## Verification performed

- `python3 scripts/check_collection_counts.py` — PASS.
- `./bin/validate_graph.sh` — see PR body for exact output. `relates_to` targets `mascots/M-0086`–`M-0091` are expected-pending-merge dangling findings; the mascot slice lands on a sibling branch.

## Unresolved follow-up

- Aphorism coverage was not enumerated in epic #1028; the records were present in the source artifacts and are converted here. Flagged in the PR body for maintainer awareness.
