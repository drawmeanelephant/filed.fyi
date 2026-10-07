---
title: "Presentation QA Reference 007: Read-First Review of Four Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA Reference 007: Read-First Review of Four Records

**Maintenance ID:** 0.1.00051.presentation-qa-reference-007
**Date:** 2026-10-07
**Scope:** `content/reference/empathegy/` — the four records assigned by workload issue #778

## What changed

- Read all four assigned records in full, frontmatter through final line, including the Related Aphorisms/Haikus/Limericks residue appended to each.
- `fref-0650-elfr.md` line 50: bolded "dressed for inspection", the clause the Core Premise section turns on. The record previously carried no emphasis. Asterisks only.
- `fref-0660-glng.md` line 16: bolded "representational continuity", the affirmative term of the record's self-declared purpose distinction. The record previously carried no emphasis. The Approved Substitutions table at lines 34–48 was untouched. Asterisks only.
- `fref-0670-gtcap.md` line 31: bolded "an outcome measure", the affirmative term of the shift the Foundational Rule names. The record previously carried no emphasis. Asterisks only.
- `fref-0680-gtlm.md` line 17: bolded "analytically unstable", the caution the Purpose section and the Foundational Rule both depend on. The record previously carried no emphasis. Asterisks only.

## What was deliberately left alone

- All frontmatter, canonical IDs, tags, headings, `{#...}` anchors, two-space hard breaks in the haiku and limerick sections, and quoted/documentary material.
- `fref-0650-elfr.md` line 32 ("Echo literacy concerns format, not authenticity.") and line 257 (the Archive Position thesis) — candidate pivots passed over; the Core Premise clause is the sharper hinge and the one-pivot rule applies.
- `fref-0660-glng.md` line 110 ("truth after passing through an institution that cannot act on everything it can describe") — already carries weight through a verbatim aphorism echo at line 119.
- `fref-0670-gtcap.md` line 170 ("A gratitude rise without a leverage rise is a capture risk.") — already isolated as its own paragraph; flatness is the instrument. The missing `---` between lines 170 and 172 is layout residue and was preserved.
- `fref-0680-gtlm.md` line 111 — the sixth "review" item is phrased as an imperative, not a question. Residue; preserved.
- `fref-0680-gtlm.md` lines 296–308 and 328–340 — the limerick appendix already contains breeding-accord vocabulary. Existing residue, left as found; nothing imported and nothing removed.

## Verification performed

- `./bin/validate_graph.sh` with the pinned Boris: passed.
- `python3 scripts/test_presentation_qa.py`: passed.
- Compiled-article inspection of all four records at desktop and mobile widths.

## Unresolved follow-up

- `content/changelog.md` read `Count: 70 records.` while source held 71 records before this docket — drift left by overlapping merges. The count is set to 72 from source, not 70+1.
- `fref-0680-gtlm.md` line 344 reads "The user expressed a polite." — an incomplete sentence. Preserved as residue; flagged for the maintainer to keep or correct separately.
