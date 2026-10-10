---
title: "Presentation QA: flagged presentation defects repaired (8 sites)"
parent: changelog
status: published
tags: ["changelog", "presentation-qa", "repairs"]
---

# Presentation QA: flagged presentation defects repaired (8 sites)

**Maintenance ID:** 0.1.00283.presentation-flag-repairs
**Date:** 2026-10-10
**Scope:** `content/reference/fref-0280-cbnd.md`, `fref-0290-ocvh.md`,
`fref-0310-clop.md`, `fref-0320-cseq.md`, `fref-0330-tsac.md`,
`fref-0340-tsab.md`, `fref-0260-bmdh.md`,
`content/reference/empathegy/fref-0520-estl.md`.

## What changed

Per maintainer ruling on #970 (Q-A), the eight presentation-only defects
from the consolidated flag inventory are repaired. Zero word changes —
markup and whitespace only.

- **Orphan-limerick hard breaks** — six reference records carry a limerick
  between the `</Aside>` addendum and `## Related Aphorisms` that lacked
  the two-space trailing breaks its `fref-0260-bmdh` sibling carries, so
  the verse compiled as a run-on paragraph. Added `  ` to the first four
  lines of each limerick, matching the sibling shape.
- **Dangling bullet** — `fref-0260-bmdh` L241: the "It does:" list's
  empty `- ` item removed.
- **Emphasis/period placement** — `fref-0520-estl` L87:
  `*…designed*.` → `*…designed.*`.

## What was deliberately left alone

- All word-level residue per the Q-C preserve-all ruling: truncations
  (cmps, dcer, ikfr, cbac), missing apostrophes, ` .` spacing cluster,
  fragments, dangling `[^1]` markers, stem aliases, ambiguous tokens.
- Name mentions ruled plain per Q-B: "Witness Protocol" and
  "Minutes Without Motion (mascot 327)".

## Verification performed

- `python3 scripts/check_collection_counts.py` — PASS (see PR body).
- `python3 scripts/fix_verse_hard_breaks.py content --check` — PASS.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — output
  recorded in the PR body.

## Unresolved follow-up

- None — this closes the #970 flag inventory.
