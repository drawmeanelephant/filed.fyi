---
Title: Routine - Orphan Record Sweep
Author: Antigravity
Date: 2026-06-19
---

# Routine: Orphan Record Sweep

**Goal:** Identify entries floating in the void—files that are not linked to by any other archive record and lack appropriate taxonomic frontmatter to appear in dynamic lists.

## Task Details
1. Scan a content directory for files.
2. Cross-reference them against internal markdown links and dynamic `concepts` lists.
3. If an orphan is found:
   - Determine if its isolation is intentional (e.g., hidden lore, redacted file).
   - If unintentional, propose a minimal fix: adding a relevant `concepts` tag or linking it from a related entry.
4. Log found orphans and their resolutions in `.jules/notes/orphan-log.md`.
5. Add a short entry to `.jules/index.md`.

## Boundaries
- Do not force connections where none logically exist.
- If an orphan seems deliberately isolated, add a frontmatter note (e.g., `status: isolated`) rather than linking it, and leave it alone.

## Verification
- Check that newly connected files render correctly on their respective concept threshold pages or related entry lists.

## Commit
Use: `🗂️ Index: orphan sweep in [directory]`
