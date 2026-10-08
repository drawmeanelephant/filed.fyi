---
title: "Presentation QA Reference 772: Tri-Directive Related Limerick Hard Breaks Restored"
parent: changelog
status: published
tags: ["changelog", "presentation", "reference"]
---

# Presentation QA Reference 772: Tri-Directive Related Limerick Hard Breaks Restored

**Maintenance ID:** 0.1.00055.presentation-qa-reference-772-tri-hard-breaks
**Date:** 2026-10-08
**Scope:** `content/reference/directives/tri-directive-doctrine.md`, lines 283-302 (Related Limericks stanzas 1-3)

## What changed

- Added two trailing spaces (two-space hard breaks) to the twelve non-final verse lines at 283-286, 291-294, and 299-302, so each Related Limericks stanza compiles as five lines instead of one run-on paragraph.
- Whitespace-only. Words, order, headings, and anchors are unchanged. Applied under the maintainer's explicit approval as a waiver of the baseline's protected-region rule, following the #646 / hai-039 precedent.
- Recounted `content/changelog/` source records, including this docket, and set the trunk's `Count:` to 79.

## What was deliberately left alone

- The other seven #772 records were reviewed in full and left unchanged. Their evidence is recorded on #772 and in the PR body.
- The Related Haikus stanzas at 64-72, which already carry hard breaks, and the prose at 29-31 and the italic annotation at 35, are untouched.
- The bold-span density in `FREF-0810-DSL` (18) and `FREF-0815-MAP` (23) is raised as a maintainer question, not changed.

## Verification performed

- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./bin/validate_graph.sh` (pinned Boris `07dc0d3c`): VERIFY_PENDING
- `python3 scripts/test_presentation_qa.py`: VERIFY_PENDING
- `python3 scripts/check_presentation_qa.py` against `300df3c8`..head with this docket: VERIFY_PENDING (expected protected-region findings for the twelve hard-break lines, which the maintainer waived)

## Unresolved follow-up

- Trunk and README count drift is left with #611.
- PRs #819 (hai-039) and #820 (fref-0510) merged protected-region heading and hard-break changes without a waiver recorded on their issues. Their status is unresolved and awaits a maintainer decision.
