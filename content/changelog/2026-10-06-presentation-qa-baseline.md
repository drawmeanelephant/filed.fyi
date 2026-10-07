---
title: "Read-first Presentation QA Baseline Published for Approval"
parent: changelog
status: published
tags: ["changelog", "documentation"]
---

# Read-first Presentation QA Baseline Published for Approval

**Maintenance ID:** 0.1.00045.presentation-qa-baseline
**Date:** 2026-10-06
**Scope:** `docs/presentation-qa-baseline.md`, `AGENTS.md`, changelog docket/trunk

## What changed

- Recorded issue #609's read-first contract, formatting limits, per-file evidence, no-change path, validation gates, and single-issue launch prompt in `docs/presentation-qa-baseline.md`.
- Added a narrow presentation-workload pointer in `AGENTS.md`. Existing governance remains authoritative.
- Defined one shared maintenance finalization lane with prerequisite #611: rebase on current `main`, check unclaimed sequences, recount source records, and validate after shared-file conflict resolution.
- Recounted 62 existing changelog records and this new docket, then corrected the trunk's stale declaration from 61 to 63. No blind increment was used.

## What was deliberately left alone

- Archive records were not swept, repaired, or reformatted. Other trunks and README totals belong to #611.
- Historical docket claims, repeated maintenance sequences, canonical identities, metadata, and links remain unchanged. No reading evidence was inferred from prior edits.
- No framework tooling, rewrite script, or second content authority was added.

## Verification performed

- `./scripts/ensure-boris.sh --provision` passed; Boris is pinned to `07dc0d3cc101d86682ec92e06ba00edef9d90c75` with Zig 0.16.0. No compiler blocker remained.
- `./bin/validate_graph.sh` passed: graph diagnostics, Cantilever compilation, verse residue check, zero duplicate HTML IDs, and byte-for-byte publication certification.
- `python3 scripts/test_ensure_boris.py` passed all 13 tests. `python3 scripts/test_relationship_repair.py` passed.
- `./scripts/filed-publish.sh` passed: zero relationship findings, 2,784 canonical relationships across 1,332 records, recovery consistency, and valid UTF-8 `llms.txt`. Generated outputs and the regenerated report were not included in this change.
- Inspected compiled DOM for `/changelog.html`, `/changelog/2026-10-06-presentation-qa-baseline.html`, and unchanged `/changelog/2026-08-07-docket-convention.html` at desktop 1440×900 and mobile 390×844. Article text, emphasis, and in-page anchors were checked; no horizontal overflow or unresolved in-page anchors was found.
- Screenshot capture failed with `Resource temporarily unavailable (os error 35)` and then timed out. DOM inspection succeeded; a completed visual screenshot review is not claimed. Remote CI and independent maintainer review remain required before merge.

## Unresolved follow-up

- The merged baseline commit must be linked back to #609 for explicit maintainer approval before any pilot starts. Publication does not grant approval.
- #611 remains responsible for broader count and prior-coverage reconciliation before pilot release.
