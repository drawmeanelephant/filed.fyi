---
title: "Presentation QA Reference 010: Read-First Review of Three Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA Reference 010: Read-First Review of Three Records

**Maintenance ID:** 0.1.00049.presentation-qa-reference-010
**Date:** 2026-10-07
**Scope:** `content/reference/empathegy/` — the three records assigned by workload issue #781

## What changed

- Read all three assigned records in full, frontmatter through final line, including the appended Related Aphorisms/Haikus/Limericks residue in each.
- `fref-0750-pxcm.md` line 26: italicized "whether the warmth had leverage", the second half of the record's self-declared "decisive question". The record already spends its bold on the defined term and the Interlocks labels, so italics were used instead. Asterisks only.
- `fref-0760-rscl.md` line 173: bolded "cannot be repaired by polishing the same language harder", the Handling Protocol's one categorical rule and the record's single bold pivot. The record previously carried no bold. Asterisks only.
- `fref-0770-rhkd.md` was reviewed unchanged.

## What was deliberately left alone

- All frontmatter, canonical IDs, tags, headings, `{#...}` anchors, hard breaks, the residue sections, and the Related Entries / Incident Anchors lists, including the `LLG-08xx` placeholders.
- `fref-0760-rscl.md` line 13 still introduces its term in plain text, where its neighbours bold theirs. Matching them would be cross-record standardization, not a decision about this record.
- `fref-0770-rhkd.md` line 26 has the same "the question is not X; the question is Y" shape as 0750 line 26. Giving it the same italic would be a template, and the record already carries six bold spans plus "A key sign:" at line 114.
- `fref-0760-rscl.md` line 158 reads "The systems ability". It was not corrected; that is a wording question, not a formatting one.

## Verification performed

- `./bin/validate_graph.sh` with the pinned Boris: passed.
- `python3 scripts/test_presentation_qa.py`: passed.
- Compiled-article inspection of all three records.

## Unresolved follow-up

- The missing apostrophe at `fref-0760-rscl.md` line 158 is flagged for the maintainer to keep as residue or correct separately.
