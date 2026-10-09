---
title: "Religion Pass Extensions: Breeding Log, Capture Sightings, Corporate Ma'nene'"
parent: changelog
status: published
tags: ["changelog", "reference", "mascots", "lorelog", "religion-pass"]
---

# Religion Pass Extensions: Breeding Log, Capture Sightings, Corporate Ma'nene'

**Maintenance ID:** 0.1.00280.religion-pass-extensions
**Date:** 2026-10-09
**Scope:** `content/reference/`, `content/mascots/`, `content/lorelog/` — five greenfield records authored from issues #1029, #1030, and #1031 (extensions to the religion pass tracked under #1028)

## What changed

- `content/reference/fref-0921-bpl.md` — `reference/FREF-0921-BPL` "Breeding Program Log". Append-only cross registry per #1029: Date | Cross | Rot Affinity Product | Filed By | Status. Seed rows cover the religion-cluster crosses under the canonical ID map (`M-0086..M-0091`), including one `Recursive` row (`M-0090 x M-0090 -> M-0090`) and one `Denied` row (`[none]` product). Header blockquote filed by [[mascots/M-0019|Kindy]]; a Kindy's Recursion Echo blockquote is appended per the issue's living-document protocol.
- `content/reference/fref-0922-cvs.md` — `reference/FREF-0922-CVS` "Capture Vector Sightings". Append-only migration log per #1030: Date | Tradition / Institution | Mode | Vector Signature | Seal Status | Notes. Eighteen seed sightings, one per seam lorelog `LLG-0921` through `LLG-0938`.
- `content/mascots/092.corporate-manene.md` — `mascots/M-0092` "Corporate Ma'nene'", Exhumation Officer, status `archived` per mascot convention. Biography, Known Failures (2021 Mass Exhumation, Fresh Shroud Incident), six Ceremonial Tasks, System Messages, and an Archivist's Note recording the Torajan provenance of the name.
- `content/lorelog/LLG-0939-CORPORATE-MANENE.md` — `lorelog/LLG-0939-CORPORATE-MANENE`. Incident record of the first cycle: 200 exhumed; 12% dangling `relations`, 8% deprecated `tags`, 3% more current than their live replacements; outcome table (191 REBURIED / 6 REANIMATED / 2 DISPLAYED / 1 DISSOLVED); officer recommendation filed.
- `content/reference/fref-0923-manene-protocol.md` — `reference/FREF-0923-MANENE-PROTOCOL`. Exhumation Calendar (append-only table, cycles MN-0001 and scheduled MN-0002), Pull List Query, Shroud Versions, Outcome Codes, and Form 51-E-MN.
- Trunk `Count:` lines updated: reference 128 -> 131, mascots 249 -> 250, lorelog 189 -> 190, changelog 228 -> 229. README totals updated (+6 pages/satellites).

## What was deliberately left alone

- Pending-merge IDs. `relations` edges and body references to `mascots/M-0086..M-0091`, `lorelog/LLG-0921..0938`, and `reference/FREF-0920-RAB` target records that land in the rel-core slice; body references to those IDs are code-spans, not wiki links, until the targets exist. Edges among the five new records and to existing records (`mascots/M-0019`, `reference/FREF-0815-MAP`) are wiki-linked.
- CVS `Mode` column normalized to the FINA/CRED/GOVC/LEGA/STAT/HYBRID taxonomy per the record's own filing rules; the issue seed's MAP-style codes (AAOA-WQF, LCGU-FAT, AAOA-CNS, AAOA-REQ, CAAR-HER, LCGU-CAN) are preserved in the Vector Signature column as filing codes in parentheses.
- No verse blocks authored for `mascots/M-0092`; the issue spec defines the record without them.
- Maintenance ID `0.1.00280` used per the religion-pass allocation; intervening IDs belong to sibling slices.

## Verification performed

- `python3 scripts/check_collection_counts.py` — PASS after count updates.
- `BORIS_BIN=<pinned sibling binary> ./bin/validate_graph.sh` — output recorded in the PR body; dangling-edge findings are limited to the rel-core pending-merge IDs listed above.

## Unresolved follow-up

- The dangling `relations` edges to `mascots/M-0086..M-0091`, `lorelog/LLG-0921..0938`, and `reference/FREF-0920-RAB` resolve when the rel-core slice merges. The `publish-export` CI job is expected to report FINDINGS on this branch until then.
