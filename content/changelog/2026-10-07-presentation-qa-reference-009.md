---
title: "Presentation QA Reference 009: Read-First Review of Three Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA Reference 009: Read-First Review of Three Records

**Maintenance ID:** 0.1.00050.presentation-qa-reference-009
**Date:** 2026-10-07
**Scope:** `content/reference/empathegy/` — the three records assigned by workload issue #780

## What changed

- Read all three assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue appended to each.
- `fref-0720-itbd.md` line 16: bolded "process-compatible", the affirmative term of the record's self-declared foundational distinction. The record previously carried no emphasis. Asterisks only.
- `fref-0730-lcob.md` line 39: bolded "useful to remain unclear", the clause the Core Premise section turns on. The record previously carried no emphasis. The verbatim echo in Related Aphorisms at line 302 was left plain. Asterisks only.
- `fref-0740-moc.md` line 253: italicized "serving the trace", the inversion the Archive Position section closes on. The record already spends its one bold on the `**Provenance.**` run-in label at line 20, so italics were used. Asterisks only.

## What was deliberately left alone

- All frontmatter, canonical IDs, tags, headings, `{#...}` anchors, two-space hard breaks in the haiku and limerick sections, and quoted/documentary material.
- `fref-0720-itbd.md` lines 88–89 ("Residue is not error…") and 107–108 ("They reduce what counts as visible.") — candidate pivots passed over; each already carries weight through a verbatim aphorism echo, and the one-pivot rule applies.
- `fref-0730-lcob.md` line 146 ("more believed in than seen") and lines 178–180 — secondary to the section the record itself labels Core Premise.
- `fref-0740-moc.md` line 131 ("This has caused problems.") — already isolated as its own paragraph; its flatness is the joke, and emphasis would unflatten it.
- `fref-0740-moc.md` line 255 reads "the systems preference". Not corrected; that is a wording question, not a formatting one.

## Verification performed

- `./bin/validate_graph.sh` with the pinned Boris: passed.
- `python3 scripts/test_presentation_qa.py`: passed.
- Compiled-article inspection of all three records at desktop and mobile widths.

## Unresolved follow-up

- `content/changelog.md` read `Count: 68 records.` while source held 69 records before this docket — drift left by overlapping merges of the haiku hard-breaks and reference dockets. The count is set to 70 from source, not 68+1.
- `fref-0740-moc.md` line 255 "systems preference" is missing its apostrophe. Flagged for the maintainer to keep as residue or correct separately, same class as the `fref-0760-rscl.md` flag in 0.1.00049.
