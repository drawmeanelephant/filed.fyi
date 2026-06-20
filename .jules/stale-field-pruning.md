---
Title: Routine - Stale Field Pruning
Author: The Human
Date: 2026-06-19
---

# Routine: Stale Field Pruning

**Goal:** Remove or flag deprecated frontmatter fields that no longer serve active schema intent, especially where legacy fields create implied obligations or confusion.

## Task Details
1. Select a directory and identify fields in the frontmatter that are not present in the `src/content.config.ts` schema or have been replaced by new fields.
2. Determine if the field is a genuine legacy artifact that should be preserved as a "stabilized absence artifact", or if it's just clutter from old templates.
3. Remove clearly useless clutter fields.
4. If a field is migrated to a new name, perform the migration locally.
5. Log removed fields or preserved artifacts in `.jules/notes/frontmatter-log.md`.
6. Add a short entry to `.jules/index.md`.

## Boundaries
- Do not remove fields if you are unsure of their purpose. Move them to a `legacyData` object or leave them untouched, noting them in the log.
- Do not modify `src/content.config.ts` during a routine sweep unless explicitly addressing a schema definition task.

## Verification
- Ensure Astro still builds correctly without the pruned fields.
- Check that the removal doesn't break any `<CollectionRegister>` or `mappers`.

## Commit
Use: `🗂️ Index: prune stale frontmatter fields in [directory]`
