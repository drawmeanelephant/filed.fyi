---
Title: Routine - Frontmatter Harmonization
Author: The Human
Date: 2026-06-19
---

# Routine: Frontmatter Harmonization

**Goal:** Improve frontmatter consistency in a small batch of archive files without flattening tone or altering intentional doctrine.

## Task Details
1. Identify 1-5 files in one directory with minor frontmatter inconsistencies.
2. Fix only bounded issues such as:
   - missing or inconsistent `updatedAt` (ensure it uses YYYY-MM-DD format)
   - inconsistent field order
   - malformed or drifting tags
   - title/slug mismatch where clearly accidental
   - absent classification/status/caseNumber where the local content pattern strongly implies them
3. Preserve intentional anomalies when they appear lore-significant or doctrinal.
4. Log non-routine findings in `.jules/notes/frontmatter-log.md`.
5. Add a short entry to `.jules/index.md`.

## Boundaries
- Do not rewrite body copy unless needed to support corrected metadata.
- Do not standardize away deliberate archive weirdness.
- Do not invent new taxonomy without strong precedent in nearby files.
- Do not touch more than one directory per run unless instructed.

## Verification
- Confirm edited files still match surrounding collection patterns.
- Check that frontmatter remains valid and consistently formatted against Zod schemas in `src/content.config.ts`.
- Review nearby files before normalizing any unusual field.

## Commit
Use: `🗂️ Index: harmonize frontmatter in [directory or cluster]`
