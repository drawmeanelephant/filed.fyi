---
title: "Presentation QA: baseline codifies pass-3 conventions and audit fold-forward"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "baseline", "crosslinks"]
---

# Presentation QA: baseline codifies pass-3 conventions and audit fold-forward

**Maintenance ID:** 0.1.00282.presentation-qa-baseline-pass3
**Date:** 2026-10-10
**Scope:** `docs/presentation-qa-baseline.md` — new "Pass 3 — crosslink densification" section.

## What changed

Folds the reference pass-2 audit (#991) F4 fold-forwards and the conventions
the pass-3 fleets actually ran on into the written baseline:

- **Linking rules** — one link per target per page at first eligible
  occurrence; byte-exact labels; natural-language mentions in scope under
  the census → manifest → adjudication protocol; code-spanned ID mentions
  convert to wiki links; frontmatter `relations` not duplicated in body;
  pre-existing multi-link residue stands absent ruling.
- **Protected regions** — blockquote `>` lines, `Related`-heading index
  tails, link-index sections, hyphen compounds, existing link syntax.
- **Flag classes** — stem-aliased mention, self-verse-shadow,
  same-label→two-destinations, and dangling ref are distinct classes, all
  `needs decision` rather than defects.
- **Collision resolution** — limerick > aphorism > haiku > primary record.
- **Process rulings** — comment-posted review is the sanctioned gate
  artifact on the maintainer's token; enumeration must equal tally;
  prefix-uniqueness checks are scoped to the token's own `id:` namespace.

## What was deliberately left alone

- Pass-1 and pass-2 sections — unchanged; the pass-3 section reads them,
  it does not amend them.
- The open `needs decision` flag queue on #970 — rulings pending;
  none of this section pre-judges those items.

## Verification performed

- `python3 scripts/check_collection_counts.py` — PASS (see PR body).
- `./bin/validate_graph.sh` — output recorded in the PR body.

## Unresolved follow-up

- Maintainer adjudication of the consolidated flag queue on #970 closes
  the items this section only classifies.
