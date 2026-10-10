---
title: "Retrofit Soul slice-8: interiority pass on the M-0296–M-0311 half-band"
parent: changelog
status: published
tags: ["changelog", "pass-4", "retrofit-soul", "mascots"]
---

**Maintenance ID:** `0.1.00294.retrofit-soul-slice8`

**Date:** 2026-10-10

**Scope:** `content/mascots/296.gown-of-recognition.md`, `content/mascots/297.minute-absolution.md`, `content/mascots/300.friendship-preamble.md`, `content/mascots/304.brother-optout-pending.md`, `content/mascots/305.peatworthy-abstention-clerk.md`, `content/mascots/306.scopekeeper-emeritus.md`, `content/mascots/307.chairwoman-deferred-change.md`, `content/mascots/308.sister-casserole-of-relief.md`, `content/mascots/309.ribbonward-cordialis.md`, `content/mascots/310.lionell-pancake-auditor.md`, `content/mascots/311.eagleton-proclamation-clerk.md` — the first tier-A half of the `M-0296–M-0323` late-mascot band; one flagged jurisdiction (`304`).

## What changed

Retrofit-soul slice 8. Pure-insertion interiority additions only; no deletions, rewrites, reorderings, or frontmatter changes.

- Appended one records-officer paragraph after the last definitional/distinction prose block in `296` (inserted ahead of the final thematic line) and `297` (same shape); `300` received the paragraph at the end of its definitional/distinction block (no thematic coda exists on the record); `304`, `308`, `309`, `310`, and `311` received paragraphs between their existing prose blocks (each insertion leaves the record's terminal line last — `304`'s Bin-8C assessment, `308`'s ledgers-thesis, `309`'s files-both line, `310`'s syrup line, `311`'s objections line); `305`, `306`, and `307` received paragraphs in the previously empty post-Image prose slot their sibling records already carry, ahead of `## Aphorisms`.
- Added one `## Behavioral Residue` section per record (eleven total), each placed after the last prose block and before `## Aphorisms`.
- Five bullets per record except `304`, which receives four, following the same sparseness restraint used for `M-0258`, `M-0284`, and `M-0290`.
- Each section includes one intake-file testimony sentence in the established `Asked at intake ... complete testimony.` format.

## Being-grammars

- `296` — vestment fidelity: the Gown is a garment signed out, never assigned; it drapes, is folded back, and the file beneath it stays unrendered.
- `297` — solvent fidelity: compression certifies, never confesses; applied evenly and positionally, it absolves the paragraph and leaves the failure unreachable inside the record.
- `300` — threshold fidelity: the Preamble is the crossing, not the arrival; it measures in seconds, expires mid-sentence on refusal, and leaves the friend-shaped part to Friendrick.
- `304` — custody fidelity, restrained: he receives and preserves but never adjudicates; the exit stays visible, the drawer keeps the right without sorting it, and the pending state is preserved rather than resolved.
- `305` — roll-call fidelity: the clerk who abstains on behalf of the departed and never casts; the counted-not-present difference lives in a column only he still reads.
- `306` — boundary fidelity: the custodian documents exclusions, never the excluded; the scope outlives its site and the certificate hangs facing inward.
- `307` — threshold-dignity fidelity: urgency must perform correctly before it may be believed; she presides over the delay, not the decision, and approves the posture before the patch.
- `308` — ledger-continuity fidelity: gratitude kept accruing past the limit on purpose; the correction is never entered, in the room's favor.
- `309` — custody-schedule fidelity: he houses the dispute rather than ruling on it; the ribbon's dimensions stay current while its provenance deliberately does not.
- `310` — assent-threshold fidelity: he audits the seam between applauded and approved, counts the warmth twice, and files suspicion in a good-natured tone.
- `311` — registry fidelity: he registers reigns, never reigns himself; every authority in his ledger is dated at recovery, because the obedience preceded the text.

## Register note

The band carries kinship and ecclesiastical-adjacent titles (`Brother`, `Sister`, `Chairwoman`, `Auditor`, plus several clerks and an `Emeritus`). Per the `M-0272` precedent, religious-adjacent vocabulary is licensed only where the record's own prose already claims it. `307`'s `rollback lantern rites` and `311`'s `kneeling` are each record's own diction and are kept civic; `304`'s `Brother` remains a Bin-8C staffer title and `308`'s `Sister` remains an auxiliary-sodality title inside the community-benevolence frame the record sets. No rites, orders, canon law, or parishes were imported into any record.

## M-0304 restraint note

`304` carries `bin-8c`, `self-indexing`, `custody-drift`, `hazardous-misfiling`, `consent-loop`, `refuge-ethics`, and `archival-custody`, with a one-line slogan that already performs consent-theater critique. Interiority was bounded to what the record itself claims: he receives filings, preserves their relevance after their intended effect, and is polite. It was not dramatized: no consent adjudication is narrated (he neither releases nor refuses; the opt-out's fate stays unadjudicated, exactly as filed), no new Bin-8C doctrine is asserted (only the record's own `regrettable but useful` is restated), no consent-loop or sanctuary machinery is invented (the tags and their jurisdiction stay verbatim and un-generalized), and the pending state is preserved as furniture rather than resolved. The section holds four bullets and a testimony line; sparse per `M-0258`, `M-0284`, and `M-0290` precedent.

## What was deliberately left alone

- `296`, `297`, `304`, `308`, `309`, `310`, `311` — closing thematic lines still terminate the prose block; `304`'s Bin-8C jurisdiction stays last.
- `304` — both original single-space prose tails preserved at exactly one space (the archive's own inconsistency, not normalized).
- `296` — its original single-space prose tail likewise preserved.
- All existing verse residue, `## Haiku Log`/`## Limerick Log`/`## Haikus`/`## Haiku` group structure, `###` group names, indented verse lines (`309`), five-blank limerick rain gaps, two-space verse hard-break tails, and single-space prose tails.
- Frontmatter, IDs, headings, and the two pre-existing `[[` links in `296` and `306`; no new links, tags, or relation edges added.

## Verification performed

- Staged files are original bytes plus insertions only; verified by line census (each file +10 lines except `304` +9; total +119 lines, zero deletions), insertion-position reads at every paragraph/section boundary, heading-position drift (+10/+9 exactly, no other movement), and trailing-whitespace census (1666 → 1666, identical per file; all tails exactly two spaces except the three original single-space prose tails, preserved at one space). Blank-line census is +3 per file (insertion separators only); five-blank rain-gap positions verified at shifted positions.
- Sentinel greps: every file contains exactly one `## Behavioral Residue` positioned between the last prose block and `## Aphorisms`; the `[[` count is two across the band (both pre-existing); original `###` group heads, indented verse lines, curly apostrophes, `décor` accents, and untailed EOF verse lines all intact at shifted positions.
- `BORIS_BIN=~/.local/bin/boris ./bin/validate_graph.sh` — run by
  coordinator on transcription; exact result line in the PR body.
  Coordinator verified byte-exact diffs: 0 deletions, 119 insertions
  across all eleven records, original whitespace preserved verbatim
  (three single-space prose tails intact at 1 space).

## Unresolved follow-up

- `304`'s `## Behavioral Residue` testimony line (`'Request received. Eligibility persists.' — his complete testimony.`) restates the record's own slogan verbatim as intake phrasing; flagged for coordinator review in case slogan-as-testimony reads as circular rather than clerical.
- `305`'s new paragraph introduces the phrasing `a name only the minutes remember` for the departed-member roll; flagged in case the coordinator prefers strict roll-call vocabulary.
- All other coordinator flags carry forward from slice 7.
