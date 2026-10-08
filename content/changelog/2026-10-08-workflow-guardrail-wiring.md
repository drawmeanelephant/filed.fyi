---
title: "Wire Count and Verse-Break Guardrails into validate_graph.sh"
parent: changelog
status: published
tags: ["changelog", "workflow", "verse", "presentation-qa"]
---

# Wire Count and Verse-Break Guardrails into validate_graph.sh

**Maintenance ID:** 0.1.00057.workflow-guardrail-wiring
**Date:** 2026-10-08
**Scope:** `bin/validate_graph.sh`, `README.md`, `content/reference/directives/tri-directive-doctrine.md`, `content/changelog.md`

## What changed

- Wired `scripts/check_collection_counts.py` into `bin/validate_graph.sh`. The checker already existed (trunk `Count:` lines plus README page/satellite totals vs. actual Markdown source) but nothing ran it; CI's `validate` job calls `validate_graph.sh`, so the gate is now enforced on every PR.
- Wired `scripts/fix_verse_hard_breaks.py --check` (from 0.1.00056) into `bin/validate_graph.sh` the same way — verse stanzas missing two-space hard breaks now fail validation instead of drifting silently.
- Applied the twelve missing hard breaks in `content/reference/directives/tri-directive-doctrine.md` Related Limericks (the same whitespace change as open PR #821, byte-identical result), so the newly wired verse gate is green on `main` regardless of #821's merge timing.
- Corrected README totals from 2,269 pages / 2,258 satellites to 2,285 / 2,274, matching actual source including this docket.
- Recounted `content/changelog/` (79 before this docket, plus this docket) and set the trunk's `Count:` to 80.

## What was deliberately left alone

- PR #821 itself — it still carries its own docket and waiver narrative; its content change is now a no-op against this branch and it will need a rebase plus a count/README bump (80→81, 2,285→2,286 pages, 2,274→2,275 satellites) when it lands.
- The list-item verse style in ~30 lorelog/haiku residue stanzas — still a maintainer convention decision, not a gate.
- No new checkers or registries invented; both gates are existing scripts with `--check`/read-only behavior.

## Verification performed

- `python3 scripts/check_collection_counts.py` — before: `FAIL: README.md: declares 2269 pages, actual 2284` and satellite mismatch; after the README fix: `PASS: collection counts and README totals match Markdown source.`
- `python3 scripts/fix_verse_hard_breaks.py content --check` — `0 violation(s)`.
- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./bin/validate_graph.sh` — passed end to end with both new gates included.

## Unresolved follow-up

- Every future docket-adding PR must now update `Count:` and README totals or `validate` fails — this is the enforced finalization lane #611 asked for, achieved by wiring existing tools rather than adding process.
- Open PRs that add records (e.g. #821's docket) will need a rebase + count bump to pass the new gate.
