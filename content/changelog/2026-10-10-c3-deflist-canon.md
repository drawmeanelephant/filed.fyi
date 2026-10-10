---
title: "C3 Definition List Canon"
parent: changelog
status: published
tags: ["changelog", "definition-lists", "formatting"]
---

# C3 Definition List Canon

**Maintenance ID:** 0.1.00286.c3-deflist-canon
**Date:** 2026-10-10
**Scope:** `content/reference/`, `content/lorelog/`, `content/mascots/` — glossary-like term→definition sections (issue #1040, pass-4 C3 slice)

## What changed

- Converted term→definition sections to semantic definition lists per the C1 manifest's verified syntax. Native `Term` / `: definition` form used for all flat entries; raw `<dl>/<dt>/<dd>` used only where entries carry nested sub-lists (`fref-0150-mapa`, `fref-0160-maii`, `LLG-0360-RAGE-CHARTER`).
- MAP/assurance spine: `FREF-0815-MAP` Core Definitions; `fref-0150-mapa` + `fref-0160-maii` Working Glossary + informal failure-type mapping; `LLG-0324-MAP` Protocol Definitions; `fref-0030-avsg` Managed Absence anchors; `fref-0050-avoc` Scan Language Crosswalk; `fref-0821-avtl` Core Mapping Table; `fref-0823-tsrt` Interpretive Classes + Doctrinal Boundaries; `fref-0310-clop` softening crosswalk + ritual mappings; `LLG-0327-AVA` substitution table + retrospective classification; `LLG-0316-LC22` Assurance Vocabulary Overlay; `fref-0350-bhds` Error Response Protocol; `fref-0650-pbc` Disallowed and Translated Phrases; `fref-0810-DSL` Emotional Categories.
- Doctrine/taxonomy banks: `LLG-0357-DOGE-RID` operational definitions; `LLG-0350-DOGE-CHARTER` evaluated criteria; `LLG-0364-RAGE-BAIT-TAXONOMY` operational families; `fref-0850-mard` four conditions; `fref-0260-bmdh` Presence Taxonomy + Service and Credit; `fref-0320-cseq` Roles/Artifacts/Practices; `fref-0360-sast` Key components; restricted vocabulary in `fref-0190-slhr`, `fref-0210-cbhn`, `fref-0230-cmal`, `fref-0240-cmrc`, `fref-0250-prdm`.
- Mascot spec-sheet glossaries: `mascots/029` Glossary of Intentions + Legacy Echoes; `mascots/024` and `mascots/413` Status Behavior Profiles.
- Conventions: bullet/number markers and separator glyphs (`—`, `–`, `:`, `→`, `->`) dropped where the `:` definition marker assumes that role; term markup (bold, italic, code span, wikilink, quotes) and every word of definition text preserved verbatim; def+Example pairs merged into a single `: ` line with `**Example:**` inline; entry order unchanged.

## What was deliberately left alone

- All frontmatter, canonical IDs, headings, `{#…}` anchors, verse tails, aphorism/haiku/limerick regions, and all definition wording.
- **Deferred for ruling — Empathegy and adjacent:** every `content/reference/empathegy/` record (glossary-class sections incl. `fref-0650-elfr` Stable Terminology, `fref-0635-wwlv` Witness Protocol terms, `fref-0660-glng` Approved Substitutions, and Preferred/Disallowed phrase banks across the collection); `fref-0430-easp` Key Definitions (Empathegy-branded, outside the fenced directory); `fref-0920-rab` MAP Extensions and `fref-0923-manene-protocol` Form 51-E-MN fields (religion-cluster-adjacent); `mascots/086–092` (fenced cluster); `spec-lab` (fenced).
- Phrase lists without definitions, code-fenced crosswalks (`fref-0080-srbp`, `fref-0030-avsg` Core Mapping Table), pipe tables (`fref-0900-ccc`, `fref-0661-agbx`), stage→rule tables (`fref-0080-srbp` thresholds/appearances/evolution), header/redirect behavior logs (`mascots/024`, `mascots/413`), heading-based definitions (`forms/fref-0020-maps`, `fref-0280-cbnd`, `forms/fref-0870-qthr`, `fref-0370-dcst`), spec-sheet fields, and annotated record indices.
- `fref-0821-avtl` `->` notation — 0.1.00224.reference-022 recorded it as "the record's own notation; preserved"; converted here under the C3 class. Flagged for coordinator veto.
- `content/changelog.md` trunk `Count:` and README totals — coordinator reconciles at merge.

## Verification performed

- `validate_graph.sh` run by coordinator — see PR body; compiled `<dt>` wikilink rendering spot-checked in `fref-0823-tsrt`, `LLG-0364`, `fref-0360`.

## Unresolved follow-up

- Surfaces exceeding the C1-verified shape — wikilinks/markup inside `<dt>` (`fref-0823` boundaries, `LLG-0364` family names, `fref-0360` components) verified by coordinator in compiled HTML.
- `fref-0360-sast` is Empathegy-adjacent content outside fenced paths; hunk may be reverted independently if the Empathegy ruling prefers a uniform treatment.
- ~160 dt/dd pairs introduced corpus-wide; no prior `<dl>` usage existed — presentation QA may wish to review `<dl>` styling in `themes/cantilever/`.
