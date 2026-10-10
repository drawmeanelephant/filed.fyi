---
title: "Religion pass: FREF-0920 counterpart edge restored on seam verse records"
parent: changelog
status: published
tags: ["changelog", "religion-pass", "relations", "crosslinks"]
---

# Religion pass: FREF-0920 counterpart edge restored on seam verse records

**Maintenance ID:** 0.1.00281.religion-pass-seam-fref-edges
**Date:** 2026-10-09
**Scope:** `content/haikus/hai-seam-*.md`, `content/limericks/LIM-SEAM-*.md`, `content/aphorisms/APH-seam-*.md` — 15 seam verse records.

## What changed

The seam verse sources asserted `coreCounterpart: reference/FREF-0920-RAB`; the conversion repointed that edge at `mascots/M-0090` under the Option B remap and dropped the doctrinal-spine edge. Per maintainer ruling on #1037, both assertions are now carried:

- `relations:` gains `relates_to=reference/FREF-0920-RAB` alongside `relates_to=mascots/M-0090` on all 15 seam verse records (5 seams × 3 collections: CLER, DOCT, PROP, STAT, SUCC).
- The body `**Core counterpart:**` line is restored to the source's assertion (`[[reference/FREF-0920-RAB|Religious Administrative Bureaucracy]]`), and a `**Seam registry:**` line carries the M-0090 embodiment link.

## What was deliberately left alone

- The 18 mascot-bound verse records in each collection — their source `coreCounterpart` was the mascot, and the conversion was already faithful.
- The five cluster-only templated seams (DISP/EDUC/FAML/GRIE/RECD) — ruled residue on #1037; not ingested.

## Verification performed

- `python3 scripts/check_collection_counts.py` — PASS (see PR body).
- `./bin/validate_graph.sh` — output recorded in the PR body.

## Unresolved follow-up

- None — this closes #1037.
