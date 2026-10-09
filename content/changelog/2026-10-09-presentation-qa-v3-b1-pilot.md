---
title: "Presentation QA v3 B1 pilot: Alt-text authored on 15 mascot records"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "mascots"]
---

# Presentation QA v3 B1 pilot: Alt-text authored on 15 mascot records

**Maintenance ID:** 0.1.00261.presentation-qa-v3-b1-pilot
**Date:** 2026-10-09
**Scope:** `content/mascots/` — issue #992 B1 pilot slice (15 records: `003`, `004`, `005`, `014`, `041`, `046`, `058`, `075`, `082`, `301`, `310`, `404`, `413`, `502`, `503`)

## What changed

One `Alt-text:` line was authored per record under the pass-3 B-track register constraint (deadpan, concrete visual inventory, evidence-bounded; exemplar `mascots/M-0019`). Selection maximized register evidence: the four records carrying pre-existing `## Image` sections without `Alt-text:` (014, 041, 046, 503), plus eleven records chosen for descriptive density and spread across the collection, including one deliberately thin record (310) to exercise the minimal-line rule.

- On 014, 041, 046, and 503 the `Alt-text:` line was appended inside the existing `## Image` section; pre-existing residue lines (italic depiction note, filename tokens, `!svgon-the-line`) were left untouched.
- On the other eleven a `## Image` section was created at the conventional position: immediately before `## Biography` where that heading exists (003, 004, 005, 058, 404, 413, 502), before the equivalent first narrative section where it does not (075 → `## Overview`; 082 → `## Designation and Habitat`), and per-record judgment calls on two irregular layouts (301 → before `## Visual Reseed Incident`, the first headed narrative section, leaving the unlabeled lead prose intact; 310 → after `## Slogan`, before the unlabeled biography paragraph).

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, tags, and statuses.
- Pre-existing `## Image` residue lines on 014, 041, 046, and 503 — preserved verbatim alongside the new `Alt-text:` lines.
- No other wording, ordering, verse tails, or formatting. No frontmatter `image:` keys or `.assets/` references were introduced; the `Alt-text:` line is body text only.
- Non-formatting defects noticed while reading (e.g. 046's `## Image` appearing before `## Slogan`, 301's H3s floating without a parent H2) were left as-is; residue is not this slice's business.

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for outcome.
- Compiled-HTML inspection of all fifteen changed pages — see PR body.

## Unresolved follow-up

- Maintainer register review of the fifteen authored lines gates the B1 authoring fleet; lines are quoted verbatim in the PR body with per-line source evidence.
