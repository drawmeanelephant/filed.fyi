---
title: "Retrofit Soul slice-2: interiority pass on the fauna spec-sheet band M-0225–M-0234"
parent: changelog
status: published
tags: ["changelog", "pass-4", "retrofit-soul", "mascots"]
---

# Retrofit Soul slice-2: interiority pass on the fauna spec-sheet band M-0225–M-0234

**Maintenance ID:** 0.1.00288.retrofit-soul-slice2
**Date:** 2026-10-10
**Scope:** `content/mascots/225.witness-mink-9.md` through `content/mascots/234.kindness-template.md` — ten tier-A fauna spec-sheet records. Issue #1040, RETROFIT SOUL slice-2.

## What changed

Each record received interiority inserts under the slice-1 convention
established on the religion block (PR #1044): new prose placed **around**
existing prose, never in place of it. No sentence was deleted, reordered,
or reworded; frontmatter, IDs, headings, `parent`, `relations`, and all
wikilink targets are untouched. Two insert forms were used:

- **Appended paragraphs** at the ends of existing sections
  (Classification, Operational Posture, Institutional Habitat, Origin
  Artifact) — one to three per record, dramatizing what the spec-sheet
  had only asserted.
- **`## Behavioral Residue`** — one new section per record, placed after
  the last prose section and before the verse residue, holding 4–6
  bullets of rehearsed behavior, sensory trace, attributed utterance,
  and observed incident. The heading reuses the seam-witness
  generation's own section name (M-0076–M-0084 lineage).

Per-species being-grammars, per the manifest's injunction against
boilerplate persons:

- **M-0225 Witness Mink-9** — attending, edge-dwelling, and the
  load-bearing misclassification: "he has never been observed correcting
  anyone. Correcting is an intervention."
- **M-0226 Serotonin Sam** — smoothing as embodiment: the sticker that
  never leaves his hand, the anomaly form with no field for unexplained
  comfort, the unshipped downturned render noted only 'not yet.'
- **M-0227 Burden Shrew** — carrying only downward: the nightly circuit,
  the private tally, the refused hand-truck, the crews who prop the
  annex door without procedure.
- **M-0228 Proxy Compassion Possum** — underpowered sincerity: the
  self-printed lavender slips, the once-per-deployment freeze no subject
  witnesses, the eleventh-visit apology accepted on no one's behalf.
- **M-0229 Soft Green Sealie** — warmth without sight: she reassures
  facing outward with her back to the system, the pane-glass worn by
  patting, the picture of a seal she has never been shown.
- **M-0230 Lodgecanary Vellumbeak** — song and silence: attendance
  counted toward the totals his silence warns about, featherfall
  preceding policy, the shortening pause before the last note.
- **M-0231 KPI Koala** — clinging and altitude: the grip that cannot be
  seated away from the aggregate, sleep conditional on green bands, the
  joey-arranged spreadsheets whose reason did not stabilize.
- **M-0232 Greenband Gregor** — the ghost *of* the baseline: one-stroke
  repainting, strata of earlier greens, visits that follow BX-6 without
  ever sharing the room.
- **M-0233 Gratitude Latch** — mechanism-fidelity interiority: it keeps
  everything it catches, engages on the first courtesy, and cannot be
  consulted — "it did not design itself."
- **M-0234 Kindness Template** — form-fidelity interiority: field-length
  empathy truncated to the cost ceiling, the placeholder shipped
  unrendered for eleven days, the deprecated phrases eroding like a
  shoreline.

## What was deliberately left alone

- All existing prose, including definitional lines, classification
  kicker lines ("This is a classification error."), boundary notes,
  cluster notes, and the records' deliberate ambiguities — none
  rewritten or "improved."
- All verse residue (Aphorisms, Haiku Log, Limerick Log), including the
  JULES-POET digital-rain limerick groups and their irregular stanza
  gaps — **byte-identical, including trailing hard-break whitespace.**
- The M-0231 Boundary Note's missing period ("does not move thresholds
  he decides") — preserved as found; not a retrofit matter.
- No new `relations:` edges and no new wikilink targets. Two inserts
  re-name already-linked neighbors in prose (KPI Koala's residue bullet
  names Serotonin Sam and Slidey the Deckworm; Gregor's names BX-6) —
  existing edges echoing in prose, per M7, not manufactured graph.
- Jurisdiction distinctions were preserved verbatim where stated
  (Sealie vs. LC-04; Gregor vs. Koala; Latch vs. Compassion Sink); no
  containment-flagged tags are present in this band.
- The two mechanism records (M-0233 latch, M-0234 template) were kept
  deliberately non-animal: their interiority is fidelity-of-mechanism
  rather than creature embodiment — restraint the census rows support.

## Verification performed

- Slice authored by delegated agent into `.freebuff/retrofit2/` staging;
  the staging write normalized trailing whitespace on verse lines
  (CommonMark hard-break tails). Coordinator merged the inserts into the
  original byte streams by whitespace-insensitive alignment — result is
  `original bytes + inserted lines only`: `git diff` on `content/` shows
  **132 insertions, 0 deletions** across the ten records.
- `BORIS_BIN=~/.local/bin/boris ./bin/validate_graph.sh` — run by
  coordinator on transcription; see PR body for the exact result line.

## Unresolved follow-up

- The band's remaining tier-A fauna (M-0235 Annexa Sorrowmark and the
  M-0237–M-0294 stub/fauna sweep) carry the same spec-sheet diagnosis;
  this slice establishes their grammar template.
- M-0225's "eleven years of recovered material" and M-0228's
  eleventh-visit subject are prose incidents only; if lorelog-worthy,
  they belong to a later slice, not this one.
- Whether `## Behavioral Residue` should become the standard retrofit
  heading across future slices (vs. per-record section names) is a
  maintainer-facing style question; this slice applied it uniformly for
  consistency with slice-1.
