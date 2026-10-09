---
title: "Issue #833 residue dispositions: Aside restoration, mascot verse breaks, defect repairs"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "maintenance", "disposition"]
---

# Issue #833 residue dispositions: Aside restoration, mascot verse breaks, defect repairs

**Maintenance ID:** 0.1.00248.833-residue-dispositions
**Date:** 2026-10-09
**Scope:** the consolidated `needs decision` residue items carried on issue #833 itself, plus the two flags surfaced by the v2 pilot clarification docket (0.1.00247)

This docket closes the remaining adjudication items on #833 — the ones scoped to the umbrella issue rather than to leaf review issues (the leaf flags were dispositioned in 0.1.00245).

## What changed

### 1. `:::note` fences restored to the Aside component — 29 files

Commit `ee4768f38e7178d9c0b916c6637a421eac1207f0` converted legacy Aside wrappers — the component open tag with `kind="note"` — to `:::note`/`:::` fences on the assumption they were Boris-native. Compiled output confirms they are not: the fences render literally as paragraph text (`<p>:::note</p>` … `<p>:::</p>`), leaving raw `:::note`/`:::` visible on every affected page.

`kind="note"` is a sanctioned value and the wrapper is the historically faithful markup, so the conversion is reversed: each `:::note`/`:::` pair becomes an Aside open/close pair with `kind="note"` — the exact original form, no rewording of interior content.

Affected: `content/lorelog/DS-404-ALPHA.md`, `content/mascots/938.vantage-hollow.md`, and 27 records under `content/reference/` (`fref-0030-avsg`, `fref-0040-avdn`, `fref-0050-avoc`, `fref-0070-aopt`, `fref-0080-srbp`, `fref-0090-srbg`, `fref-0100-dacb`, `fref-0120-dcsc`, `fref-0130-ocvh`, `fref-0140-ocvs`, `fref-0170-lgef`, `fref-0180-tdci`, `fref-0260-bmdh`, `fref-0280-cbnd`, `fref-0290-ocvh`, `fref-0310-clop`, `fref-0320-cseq`, `fref-0330-tsac`, `fref-0340-tsab`, `fref-0350-bhds`, `fref-0360-sast`, `fref-0370-dcst`, `fref-0380-lbkp`, `fref-0400-metr`, `fref-0410-sclb`, `fref-0420-ancl`, `fref-0430-easp`).

### 2. Mascot verse-log hard breaks — `003.blamey-mctypoface`, `004.boily-mcplaterton`

Extends the established verse-break convention (PR #824, expanded in 0.1.00245) to the two records #833 still listed as open. Additive two-space breaks on non-final stanza lines only; fused stanzas separated where they compile as one run-on block:

- `003.blamey-mctypoface.md` — `## 📜 Blamey's Limerick Log` (two fused 5-line stanzas separated and broken), `## Haiku Log` residue stanzas (4 haikus), final `Sidecar Conflict Porter` limericks (2 stanzas).
- `004.boily-mcplaterton.md` — `## 📟 Error Loop Quotables` blockquote (4 quotes were merging into one paragraph), `## Haiku Log` residue stanzas (4 haikus incl. the `Core begins to melt` tail), `## Limerick Log` / `### Obsolescence Steward` regions (12 stanzas).
- `content/reference/fref-0260-bmdh.md` — the orphan limerick directly beneath the restored Aside block (5 lines) carried no breaks; fixed while the region was being repaired.

### 3. Word-level and apparatus defects

- `LLG-0325-ORT.md` — `rubbed "til it shone` → `rubbed 'til it shone`. Inside a protected limerick, but the `"` is a plain typo: the sibling stanza in `LLG-0326-DCB` uses `'til they bled`, and `'til` is the established contraction. One character, punctuation only.
- `LLG-0326-DXS.md` — the ````md`-fenced `Brickys Filing Notes` block unfenced to match the `LLG-0324-MAP` sibling presentation (plain label + bullet list), and `Brickys` → `Bricky’s` (curly, matching the sibling's exact spelling).
- `LLG-0453-MASCOT-CHARACTER-ARC-MAP.md` — `**Defining Action**:` normalized to `**Defining Action:**` at 2 sites (lines 91, 116); the colon-inside-bold form is the record's own majority (lines 21, 47, 69).
- `LLG-0322-FTD.md` — added `relations: [relates_to=lorelog/LLG-0324-MAP]` to frontmatter. The body already wiki-links the doctrine at line 25 but the record carried no `relations` field at all; siblings `LLG-0052-MFX`, `LLG-0115-TNS`, and `LLG-0338-SBI` all express this citation as a `relates_to` edge.

## Ruled as sanctioned residue — documented, no edit

- **Mascot stat blocks** (`**Role:**`-style consecutive bold-label lines compiling as a run-on paragraph across 60+ records): a collection-wide ingest convention, not an isolated defect. Normalizing would touch every mascot record; waived pending a dedicated collection-level decision. Same disposition as 0.1.00245's emphasis-density and dual-style-batch rulings.
- **`fref-0260-bmdh` dangling `- ` bullet** (line ~241, immediately above the restored Aside block): lone unmatched list marker in source; removing it silently would erase ingest-era residue. Left intact; flagged here so the observation has a home.
- **`003.blamey-mctypoface` / `004.boily-mcplaterton` residual non-verse lines** inside flagged ranges (list items, `>` separator lines, stanza-final lines without breaks): correct as-is under the verse-break contract — breaks are additive on non-final verse lines only.

## Validation

- `python3 scripts/check_collection_counts.py` — PASS (counts recounted to actuals).
- `./bin/validate_graph.sh` — PASS.
- Compiled HTML spot-check: `dist/cantilever/lorelog/DS-0404-ALPHA.html` no longer emits literal `:::note`/`:::` paragraphs; the addendum renders inside the `<aside>` component, and the trailing limerick preserves its line breaks.
