---
title: "Presentation QA Haikus 002: One Haiku Stanza Given Its Verse Breaks"
parent: changelog
status: published
tags: ["changelog", "presentation", "haikus"]
---

# Presentation QA Haikus 002: One Haiku Stanza Given Its Verse Breaks

**Maintenance ID:** 0.1.00053.presentation-qa-haikus-hai-039
**Date:** 2026-10-07
**Scope:** `content/haikus/hai-039-patchy-mxcli.md` — 1 of 25 assigned records under presentation QA workload #646, plus this docket and the changelog trunk count

## What changed

- Read all 25 records assigned by #646 in full, frontmatter through final line, against snapshot `8997eebee2a4e620c5dd47fcea97abf515c4cac6`. None of the 25 changed between the snapshot and `origin/main` (`eff19417`).
- `hai-039-patchy-mxcli.md` lines 27–28: the stanza "Star beside the text / Bottom of the page is blank / Close the heavy lid" had no two-space hard breaks, so it compiled as one run-on paragraph. Added the hard breaks to lines 27 and 28, matching the record's other stanzas. Line 29 is the final line and keeps none. No words, line order, indentation, blank-line runs, or other stanzas changed.
- Recounted `content/changelog/` from source: 75 records on `main`, plus this docket, makes 76. The trunk now says so.

## What was deliberately left alone

- The other 24 assigned records were reviewed unchanged. Their stanzas already carry hard breaks, and no emphasis was added anywhere in the workload.
- The breakless stanza predates the normalization commit. `git show 3ed123de -- content/haikus/hai-039-patchy-mxcli.md` touches only stanzas 1–2, so this is a restored verse break, not a migration cleanup.
- Four blank lines at 23–26, the lowercase register, and the poem's wording were preserved.
- The whitespace-only change is a protected-region change. It was made under the decision recorded on #646 (waive and restore). Confirm that waiver before merge.

## Verification performed

- `./scripts/ensure-boris.sh --provision` did not complete: Zig 0.16.0 provisioned, but the Boris clone from GitHub timed out. The pinned commit `07dc0d3c` was instead cloned from the local sibling repo, checked out, and built with the pinned Zig (`zig build`). The binary reports `boris/0.8.2` and was used through `BORIS_BIN`.
- `BORIS_BIN=bin/boris ./bin/validate_graph.sh`: exit 0. Boris graph diagnostics passed, the Cantilever compile completed, the verse residue check passed, 0 duplicate HTML IDs, and the Filed certification passed.
- `BORIS_BIN=bin/boris ./scripts/filed-publish.sh`: exit 0. Relationship integrity PASS with 0 findings. The run regenerated `reports/relationship-integrity.md`; that regenerated file was reverted and is not part of this change.
- `python3 scripts/test_presentation_qa.py`: 24 tests OK.
- `git diff --ignore-space-at-eol -- content/haikus/hai-039-patchy-mxcli.md` is empty, confirming the change is whitespace only.
- Compiled `haikus/HAI-0039.html`: the stanza now emits `<br />` between its three lines; the page has 6 `<br />` in total, matching the control page HAI-0029.

## Unresolved follow-up

- Independent review and successful `validate`, `publish-export`, and aggregate `ci` checks before merge.
- The trunk count is accurate for this branch's base. A later merged docket will require a recount at finalization.
