---
title: "Curve-Coherence Cohort Cleanup Pass"
parent: changelog
status: published
tags: ["changelog", "curve-coherence", "seam-survey", "mascots", "evidence-normalization", "verse-cleanup"]
---

# Curve-Coherence Cohort Cleanup Pass

**Maintenance ID:** 0.1.00027.curve-coherence-cleanup
**Date:** 2026-08-10
**Scope:** lorelog, reference, mascots, haikus, limericks, changelog

---

## What changed

- **Evidence and precision normalization.** The 0.1.00026 cohort contained many externally falsifiable figures (user counts, percentages, dollar amounts, city totals, pilot claims, dates, vendor rates) with no durable provenance in the repository. Those figures were removed, generalized, or converted into reported patterns. Counts, rates, and vendor-specific claims were not retained as findings; the archive does not maintain a citation layer, and none was invented.
- **Publication contradiction repaired.** LLG-0450 stated the survey would not be published and would not be indexed in the public sitemap; the survey was published and indexed. The filing notes now record the actual publication state and retain the intake error as an intake error. The same "filed, not found" closing convention was removed cohort-wide.
- **Doctrine boundary tightened.** FREF-0900-CCC was retitled "Curve-Coherence" and narrowed from a total economic metabolism to a doctrine defining a recurring archival condition: metric privilege, behavioral adaptation, and proxy stability treated as evidence. Added Boundaries, Known Limitations, and Filing Guidance; removed the theoretical Exit Conditions, the prescribing language, and the "$15 / $15B" symmetry claims.
- **Bridge overcoherence reduced.** LLG-0451 keeps the metric-legibility → behavioral-adaptation → performative-presence bridge but no longer claims one metabolism governing labor, finance, and surveillance. The ten-row seams↔capital correspondence table and the "shedding employees to buy AI" equation were removed.
- **Mascot de-templating.** All eleven seam mascots (M-0436 through M-0446) lost the shared generation skeleton: "Spawned in the gap between," genetic lineage, weight class, credentials, slogans, fun-facts blocks, "logical terminus," "This is not speculative," and the roadmap/pilot closers. Each mascot now keeps its causal anchor, procedural failure, function, distinction, strongest observed behavior, and residue. Mascot files shrank by roughly half.
- **Authorial prosecution reduced.** Aphoristic verdict lines ("The Hippocratic Oath compiled to bytecode," "the meat is the machine," "the Fourth Amendment is a subscription tier," "the AI is the OEM replacement") were removed or converted into procedural descriptions. Where a strong line survived, it is the record's own accusation, not the narrator's.
- **Verse cleanup.** Weak generated verse was removed or rewritten: the "spukes" limerick, forced rhymes, thesis-slogan haiku, and fake-precision lines ("$35/click," "47 cities," "3:47 AM," "0.4% gunfire"). Embedded verse and companion records were kept in sync; no companion records were deleted.
- **Tags trimmed.** One-off rhetorical and slogan tags ("capital-metabolism," "metabolic-loop," "dystopian-present," "reality-consensus-protocol") were removed from the cohort; durable archival categories were kept.
- **Relations left unchanged.** All `relations` edges from the cohort resolve and were preserved. No edge was removed for content reasons, and none was added.

## What was deliberately left alone

- The Boris relations/backlinks mechanism, the Cantilever layout slots, and `metadata/boris-version.json` were not touched; no implementation defect was found.
- No record IDs, filenames, or parent assignments were changed. The doctrine keeps the FREF-0900-CCC identifier despite the retitle; IDs are permanent.
- The poetry mirror convention (embedded verse + companion record) predates this cohort and was not redesigned. Whether the mirror duplicates retrieval surfaces is recorded as a follow-up for the planned RAG work, not resolved here.
- No new doctrine family, no new relations corpus-wide, no new mascots, and no replacement verse were introduced to compensate for deletions.

## Verification performed

- `./bin/validate_graph.sh` — Boris graph diagnostics passed; full Cantilever compile succeeded; verse-residue, HTML ID, and certification checks passed.
- Token sweep of the changed cohort for `This is not speculative`, `pilot in`, `roadmap`, `%`, `$`, `million`, `billion`, `trade secret`, `warrant`, `FERPA`, `owns your data`, `already filed`, `the contract`, `logical terminus`; every remaining match was reviewed manually (see below).
- Trunk counts re-verified against directory contents.

## Unresolved follow-up

- Verse companions mirror verse embedded in their subject records; this is the established convention, but it doubles the retrieval surface for the same content and should be revisited under the planned content-focused RAG system.
- Corpus-wide adoption of `relations` on legacy records remains open from 0.1.00026; unchanged by this pass.
