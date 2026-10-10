---
title: "Pass-4 wave-1: spec-compliance and retrofit-soul manifests; spec-lab census carve-out"
parent: changelog
status: published
tags: ["changelog", "pass-4", "spec-compliance", "retrofit-soul", "spec-lab"]
---

# Pass-4 wave-1: spec-compliance and retrofit-soul manifests; spec-lab census carve-out

**Maintenance ID:** 0.1.00284.pass4-wave1-manifests
**Date:** 2026-10-10
**Scope:** `reports/spec-compliance-manifest.md`, `reports/retrofit-soul-manifest.md`, `.gitignore`, `scripts/check_collection_counts.py`. Issue #1040.

## What changed

Wave-1 support artifacts for the pass-4 batch landed:

- **`reports/spec-compliance-manifest.md`** — C1 census of CommonMark/GFM
  feature usage across the 2,540-record canon, plus §9 observed build
  results from the C10 spec-lab testbed. Headline: footnotes, definition
  lists, and custom-scheme autolinks already render; task lists, math, and
  general attribute syntax do not. All four proposed frontmatter
  feature-flag keys are confirmed dead under the closed schema.
- **`reports/retrofit-soul-manifest.md`** — RETROFIT SOUL census: 190
  late-band mascot records (M-0076–M-0938) tiered against an eight-marker
  interiority baseline. 102 spec-sheet thin, 84 partial, 4 adequate.
  Prioritized candidate list with containment cautions.
- **`.gitignore`** — `content/spec-lab/` and `content/spec-lab.md` excluded
  as the local-only C10 parser testbed (20 records + trunk).
- **`scripts/check_collection_counts.py`** — census now counts files git
  would commit (tracked plus untracked-not-ignored) via `git ls-files`,
  falling back to rglob without git. A gitignored testbed no longer moves
  the README/trunk totals.

## What was deliberately left alone

- No canonical content records were edited; no new statuses, keys, or
  relations introduced. The spec-lab testbed is gitignored and ships
  nothing to the compiled site beyond what a local build produces.
- `<Redacted>`/`<Seal>` disposition, footnote-residue policy (define vs.
  preserve literal), and M-0090 custodian-voice-vs-index-form remain open
  maintainer questions recorded in the manifests, not decided here.

## Verification performed

- `python3 scripts/check_collection_counts.py` — PASS with testbed present
  (2,540 pages / 11 trunks / 2,529 satellites, matching committed README).
- `python3 scripts/test_collection_counts.py` — 11/11 tests pass.
- `boris check --input content --format json` — 2,143 findings, all
  documented `unreferenced_page` baseline; zero from spec-lab records.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — PASS:
  counts, graph diagnostics, full Cantilever compile, certification.

## Unresolved follow-up

- C5 (task lists), C8 (math), and C6-class attribute syntax are genuinely
  blocked on upstream Boris extensions; flagged for maintainer ruling.
- The spec-lab testbed remains local-only by design; its observed render
  table lives in `reports/spec-compliance-manifest.md` §9.
