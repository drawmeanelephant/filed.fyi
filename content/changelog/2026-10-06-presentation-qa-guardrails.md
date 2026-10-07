---
title: "Read-only Presentation QA Guardrails Added"
parent: changelog
status: published
tags: ["changelog", "validation", "documentation"]
---

# Read-only Presentation QA Guardrails Added

**Maintenance ID:** 0.1.00046.presentation-qa-guardrails
**Date:** 2026-10-06
**Scope:** presentation workload checker/tests, usage documentation, CI, changelog docket/trunk

## What changed

- Added a read-only checker for one workload's explicit paths, declared commit pair, per-file evidence, and reconciled totals. Only assigned records and that PR's own maintenance docket/count update are allowed.
- Protected source bytes and structure with a conservative emphasis subset. Ambiguous Markdown, existing markup, protected blocks, and layout changes remain findings for human review; source is never normalized.
- Added adversarial regression tests, including no-change reviews, omitted unchanged evidence, wrong revisions, irregular/nested paths, moved/missing files, code, links, tables, escaped delimiters, and poetry hard breaks.
- Added exact handoff commands and limitations in `docs/presentation-qa-checks.md`, with a narrow baseline pointer. CI runs the regression suite without replacing the Boris gates or inventing workload assignments.
- Recounted 63 existing changelog records and this docket. The trunk now declares the actual 64 records.

## What was deliberately left alone

- No archive presentation workload, sweep, record repair, or pilot was performed.
- Existing canonical identities, words, metadata, formatting, historical docket strings, other trunk counts, and README totals remain unchanged. Broader reconciliation belongs to #611.
- No formatter, framework, alternate generator, canonical registry, or automated editorial decision was added.

## Verification performed

- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/test_presentation_qa.py`: 24 tests passed, with adversarial subcases and a byte-for-byte read-only Git fixture check.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/test_ensure_boris.py`: 13 tests passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/test_relationship_repair.py`: passed.
- Python syntax and CI wiring checks passed; `validate`, `publish-export`, aggregate `ci`, and the Boris validation commands remain intact.
- `./bin/validate_graph.sh`: passed with pinned Boris; graph diagnostics, Cantilever compilation, verse residue checks, zero duplicate HTML IDs, and byte-for-byte publication certification passed. No compiler blocker remained.
- `./scripts/filed-publish.sh`: passed with zero relationship findings, 2,784 canonical relationships across 1,332 records, recovery consistency, and valid UTF-8 `llms.txt`. Generated report changes and outputs are excluded.
- Reviewed compiled HTML articles and resolving navigation/anchors for `/changelog/2026-10-06-presentation-qa-guardrails.html` (19 links), `/changelog.html` (78 links), and unchanged `/changelog/2026-10-06-presentation-qa-baseline.html` (19 links).
- Live desktop/mobile review was blocked by a missing embedded-browser tab (`tab_gone`); recovery was denied with `Blocked CDP method: Target.createTarget`. Static HTML checks are the fallback, not a claimed rendered or screenshot review.

## Unresolved follow-up

- The maintainer must approve the check before pilot release under #610. A structural pass cannot certify reading or editorial judgment.
- Remote CI and independent review remain required before merge. #611's reconciliation gate remains separate.
