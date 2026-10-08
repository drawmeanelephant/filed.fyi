---
title: "Verse Hard-Break Consistency Pass"
parent: changelog
status: published
tags: ["changelog", "verse", "limericks", "haikus", "presentation-qa"]
---

# Verse Hard-Break Consistency Pass

**Maintenance ID:** 0.1.00056.verse-hard-break-consistency
**Date:** 2026-10-08
**Scope:** `content/` — 123 records with verse stanzas missing two-space hard breaks

## What changed

- Added two trailing spaces (CommonMark hard breaks) to 1,584 non-final verse lines across 123 records where the stanza previously carried no break, so each affected stanza compiles as separate verse lines instead of one run-on paragraph. Whitespace-only; every changed line is `rstrip + "  "`, verified programmatically.
- Affected collections: `limericks/` (52 records), `lorelog/` residue regions (27), `haikus/` (22), `posts/` residue regions (8), `reference/` residue regions (15).
- Added `scripts/fix_verse_hard_breaks.py`, the scoped checker/fixer used for the pass. `--check` lists violations without writing and exits nonzero, so it doubles as a drift guardrail for future authored verse.
- Recounted `content/changelog/` source records (78 before this docket, plus this docket) and set the trunk's `Count:` to 79.
- `content/reference/directives/tri-directive-doctrine.md` deliberately excluded: its twelve missing breaks are covered by open PR #821 (`0.1.00055.presentation-qa-reference-772-tri-hard-breaks`), and editing it here would collide with that in-flight change.

## What was deliberately left alone

- All words, line order, stanza structure, headings, `{#...}` anchors, frontmatter, IDs, tags, relations, and every line that already carried a hard break (two or more trailing spaces or a backslash break).
- Final lines of stanzas: a hard break is only meaningful before a following line, so none was added where none is needed.
- `## Related Aphorisms` regions and `content/aphorisms/` bodies — prose, not verse.
- The ~30 residue verses authored as `- item` + indented continuations (lorelog/haikus): they keep the list-item style and only gained the missing breaks inside each item. Whether to normalize that style to bare stanzas is a maintainer convention decision, not a whitespace fix.
- Trunk and README count drift beyond the changelog recount is left with #611.

## Verification performed

- `python3 scripts/fix_verse_hard_breaks.py content --check` before the pass: 1,584 violations across 123 files; after `--apply`: 0 violations (tri-directive excluded in both runs).
- `git diff` programmatic check: 1,584 paired −/+ lines, all `b == a.rstrip(" \\t") + "  "` — zero non-whitespace diffs.
- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./scripts/filed-build.sh`: "Filed build passed: dist/cantilever"; compiled output spot-checked — previously run-on stanzas (e.g. `limericks/LIM-0158`, `lim-peppy-clerk.md`) now render `<br />` per line in the verse-residue panel, identical to already-correct records.
- `BORIS_BIN=/Users/tbuddy/dev/filed.fyi/bin/boris ./bin/validate_graph.sh`: passed — Boris graph diagnostics, verse residue check, HTML ID audit (0 duplicates), filed certification.

## Unresolved follow-up

- Issue #822 was root-caused during this pass: Oliver honors two-space hard breaks inside the verse-residue panel (proven by haikus and by this PR's limerick output); the reported failure was missing trailing spaces in source on `main`, not a parser defect. PR #821 plus this pass remove the underlying cause.
- Protected-region note: this pass intentionally edits verse regions under the maintainer's direction, following the #646 / hai-039 / #821 waiver precedent for hard-break restoration. `check_presentation_qa.py` is expected to report protected-region findings on these lines pending maintainer waiver acknowledgement.
- `scripts/fix_verse_hard_breaks.py --check` is not yet wired into `bin/validate_graph.sh` or CI; wiring it in would make the restored convention self-enforcing.
