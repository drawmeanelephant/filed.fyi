---
Title: Routine - Link and Reference Hygiene
Author: The Human
Date: 2026-06-19
---

# Routine: Link and Reference Hygiene

**Goal:** Verify internal references, related entry formatting, and cross-document naming consistency so the static archive remains navigable without overpolishing it.

## Task Details
1. Select a directory or a group of highly interconnected files (e.g., `mascots/` or `lorelog/`).
2. Verify all markdown internal links point to valid routes and resolve correctly.
3. Check `relatedEntries` (if applicable) for reciprocity. If Document A relates to Document B, does Document B relate back where appropriate?
4. Ensure cross-document naming consistency (e.g., a mascot's name is spelled the same when referenced elsewhere).
5. Log any permanently broken references or unresolvable lore loops in `.jules/notes/route-log.md`.
6. Add a short entry to `.jules/index.md`.

## Boundaries
- Do not "fix" broken links that appear deliberately severed or redacted for lore purposes.
- Do not create exhaustive link structures. Only correct obvious mistakes in existing connections.

## Verification
- Check links locally or verify paths against the `src/content/` structure.

## Commit
Use: `🗂️ Index: hygiene pass on links in [directory]`
