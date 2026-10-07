---
title: "Presentation QA Reference 008: Read-First Review of Three Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA Reference 008: Read-First Review of Three Records

**Maintenance ID:** 0.1.00051.presentation-qa-reference-008
**Date:** 2026-10-07
**Scope:** `content/reference/empathegy/` — the three records assigned by workload issue #779

## What changed

- Read all three assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue appended to each. All three verified byte-identical to snapshot `8997eebee2a4e620c5dd47fcea97abf515c4cac6` (471/556/364 lines).
- `fref-0690-gbhm.md` line 24: bolded "a representational event", the affirmative term of the Foundational Rule's first/second distinction. The record previously carried no emphasis. The verbatim echo in Related Aphorisms at line 273 was left plain. Asterisks only.
- `fref-0700-hiar.md` line 32: bolded "the easiest available reading", the clause the artifact/proof distinction closes on. The record previously carried no emphasis. The verbatim echo in Related Aphorisms at line 358 was left plain. Asterisks only.
- `fref-0710-ikfr.md` line 16: bolded "prevent full reality from arriving all at once", the affirmative clause of the Purpose section's not/but pair. The record previously carried no emphasis. The verbatim echo in Related Aphorisms at line 158 was left plain. Asterisks only.

## What was deliberately left alone

- All frontmatter, canonical IDs, tags, headings, `{#...}` anchors, two-space hard breaks in the haiku and limerick sections, and quoted/documentary material.
- `fref-0690-gbhm.md` line 32 ("decorative continuity") and line 258 ("Empathegy slows the eye down…") — candidate pivots passed over; the Foundational Rule's affirmative term is the one the record itself declares foundational, and the one-pivot rule applies.
- `fref-0700-hiar.md` line 164 ("They become doctrine once removal requires justification and addition does not.") and lines 342–343 — secondary to the definitional pair the Foundational Rule closes on.
- `fref-0710-ikfr.md` line 48 ("The final question is seldom written and often decisive.") and lines 134–135 — already isolated as standalone declarations; emphasis would not add what placement already supplies.
- `fref-0710-ikfr.md` line 151 ends mid-sentence ("Under such conditions, the filing") directly before the residue appendix. Not corrected; completing it would require adding words, and incomplete sentences are preserved residue.

## Verification performed

- `./bin/validate_graph.sh` with the pinned Boris: passed.
- `python3 scripts/test_presentation_qa.py`: passed.
- Compiled-article inspection of all three records at desktop and mobile widths.

## Unresolved follow-up

- `content/changelog.md` read `Count: 70 records.` while source held 71 records before this docket — drift left by overlapping merges, same class as the 68/69 drift noted in 0.1.00050. The count is set to 72 from source, not 70+1.
- `fref-0710-ikfr.md` line 151 truncates the Admissibility Drift section mid-sentence. It has stood that way since the original Boris migration (8e7db007); flagged for the maintainer to keep as residue or complete separately — a wording question, not a formatting one.
