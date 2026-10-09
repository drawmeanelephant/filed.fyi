---
title: "Presentation QA Reference 018: Read-First Review of Five Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA Reference 018: Read-First Review of Five Records

**Maintenance ID:** 0.1.00220.reference-018
**Date:** 2026-10-08
**Scope:** `content/reference/` — the five records assigned by workload issue #789

## What changed

- Read all five assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue appended to each.
- `fref-0310-clop.md` line 81: bolded "The authority does not arrive with them.", the closing pivot of the "Certification as Fossil" section — the packet's thesis that prior titles carry over while their authority does not. Asterisks only.
- `content/changelog.md`: trunk count set from 123 to 124 by recounting the Markdown source under `content/changelog/` (123 before this docket, plus this docket). README totals updated to match (2,329 pages, 2,318 satellites).

## What was deliberately left alone

- All frontmatter, canonical IDs, tags, headings, `{#...}` anchors, two-space hard breaks in the haiku and limerick sections, and quoted/documentary material.
- `fref-0270-bmdc.md` — reviewed unchanged. The transcript already carries roughly three dozen bold spans (cast list, band names, gauge labels, disposition fields); the record's real pivot ("Reception is not approval", line 139) already sits inside the bolded "Language adopted" disposition line. More emphasis would decorate, not pivot.
- `fref-0280-cbnd.md` — reviewed unchanged. The legend's "**What it counts**" / "**What it means**" label pairs and four inline bold pivots already mark the emphasis structure.
- `fref-0290-ocvh.md` — reviewed unchanged. All six indicator names, the desk names, and "three or more" are already bold; the closing "the archive will eventually grow one" lands plainly by position.
- `fref-0300-clob.md` — reviewed unchanged. A transcript fragment tagged `partial-record`; every candidate pivot ("It has optics.", "Degree one is for visitors.", the closing exchange) lives inside blockquoted speech, which is quoted material and protected by default.
- The intervening diff since the issue snapshot (`8997eebee`) was inspected before editing: commit `ed4ff55b` (0.1.00056.verse-hard-break-consistency) restored missing two-space hard breaks in the Related Haikus of `fref-0290-ocvh.md`. Whitespace-only; no words changed. The other four records are unchanged since the snapshot.
- Residue preserved, not corrected: `fref-0270-bmdc.md` line 12 "last years parade route" and line 43 "halls moral architecture" (apostrophes absent); mixed straight/curly apostrophes across all five records.
- The `## Related Haikus` → `### <title>` → `## Haikus` triple-heading pattern (present in `fref-0270` and `fref-0300`, and 29 reference records overall) is corpus-wide generator residue. Preserved, not normalized.

## Needs decision (flagged, not changed)

- `fref-0280-cbnd.md` lines 89–100, `fref-0290-ocvh.md` lines 138–149, `fref-0310-clop.md` lines 226–237: each `:::note` "Archivist's Addendum" block opens without a blank line after the preceding paragraph and is immediately followed (no blank line) by an unlabeled five-line limerick carrying no hard breaks. In the compiled article, `:::note` and `:::` render as literal paragraph text and the orphan verse merges into the closing fence's paragraph — e.g. `<p>:::\nA pencil rolled off of the desk,…`. The same shape appears in at least 24 other `content/reference/` records (fref-0030 through fref-0430 surveyed), so it reads as systematic migration-era residue from the Aside→note-fence conversion rather than local damage. Flagged for maintainer decision; nothing normalized and no verse structure touched.

## Verification performed

- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./bin/validate_graph.sh` exited 0 after the edit: "Boris graph diagnostics passed"; "Verse residue check passed"; "HTML ID audit: 0 pages with duplicate IDs"; "Filed certification passed"; "Filed build passed: dist/cantilever".
- `python3 scripts/check_collection_counts.py`: PASS — all trunk counts and README totals match Markdown source.
- Compiled `FREF-0310-CLOP.html`: exactly one `<strong>` added (`The authority does not arrive with them.`, font-weight 700 confirmed in rendered DOM); 10 `<strong>` total versus 9 pre-edit, no stray asterisk text. Headings, `{#...}` anchors, breadcrumb, and verse-residue section intact.
- Browser spot-checks against `dist/cantilever` on a local static server: `FREF-0310-CLOP` at 1280×800 and 390×1400 — pivot renders bold, no horizontal overflow; `FREF-0270-BMDC` (largest assigned record, deliberately unchanged) at 390×1400 and 1280×1400 — no overflow, 19 dialogue blockquotes and 75 hard-break `<br>` elements intact.

## Unresolved follow-up

- The three flagged `:::note`/orphan-verse sites above await maintainer decision; identical residue exists in roughly two dozen other reference records, so any fix likely belongs to a corpus-wide pass, not this issue.
