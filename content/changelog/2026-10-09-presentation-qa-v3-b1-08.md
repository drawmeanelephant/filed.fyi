---
title: "Presentation QA v3 B1 slice 08: Alt-text authored on 29 mascot records"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "mascots"]
---

# Presentation QA v3 B1 slice 08: Alt-text authored on 29 mascot records

**Maintenance ID:** 0.1.00262.presentation-qa-v3-b1-08
**Date:** 2026-10-09
**Scope:** `content/mascots/` — issue #992 B1 authoring slice 08 (29 records: `422`, `423`, `424`, `425`, `426`, `428`, `429`, `431`, `432`, `433`, `434`, `435`, `436`, `437`, `438`, `439`, `440`, `441`, `442`, `443`, `444`, `445`, `446`, `451`, `504`, `672`, `677`, `937`, `938`)

## What changed

One `Alt-text:` line was authored per record under the pass-3 B-track register constraint (deadpan, concrete visual inventory, evidence-bounded; exemplar `mascots/M-0019`; merged pilot register per PR #993). None of the 29 records carried a pre-existing `## Image` section, so one was created on each.

- On records with a `## Biography` heading the section was created immediately before it (422, 423, 425, 426, 428, 504).
- On records whose biography carries a plain-text `Biography` label rather than a heading (424, 429, 431, 451) the section was created before that label, the equivalent first narrative position.
- On the seam-fossil records (436–446) the section was created before `## Origin`, the first headed narrative section.
- On records whose narrative is unheaded lead prose (432–435, 672, 677, 937, 938) the section was created after the narrative block and before `## Aphorisms`, the first verse heading — matching the pilot's lead-prose-stays-intact convention on M-0301. On 672 this placement also kept the floating `### Distinction` H3 out of the new section; on 937 it kept the documentary `###` excerpts un-nested.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, relations, and statuses.
- The plain-text `Role:`/`Biography`/`Associated Mascots` labels on 424, 429, 431, and 451 — they are not headings, and this slice does not fix that residue.
- 677's `## Role`/`## Function`/`## Emotional Tone`/`## Slogan` metadata headings and its unheaded narrative prose; 938's `<Aside>` addendum; 672's floating `### Distinction`; 937's documentary excerpts and fenced transcripts. All residue preserved.
- No other wording, ordering, verse tails, or formatting. No frontmatter `image:` keys or `.assets/` references were introduced; each `Alt-text:` line is body text only.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for outcome.
- Compiled-HTML inspection of all 29 changed pages — see PR body.

## Unresolved follow-up

- Maintainer register review of the 29 authored lines gates acceptance; lines are quoted verbatim in the PR body with per-line source evidence.
- Placement judgment calls on records without `## Biography` are documented in the per-file disposition table for reviewer confirmation.
