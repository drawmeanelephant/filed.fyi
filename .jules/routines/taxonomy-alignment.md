---
Title: Routine - Taxonomy Alignment
Author: The Human
Date: 2026-06-19
---

# Routine: Taxonomy Alignment

**Goal:** Make sure classification, status, case numbers, related entries, and tags follow the project’s doctrinal patterns instead of drifting per file.

## Task Details
1. Select a concept cluster or directory.
2. Review files for taxonomic drift (e.g., using `ai` instead of an established `artificial-intelligence` tag, or variations on established statuses).
3. Align the diverging fields to the established center of gravity in the collection.
4. Ensure files self-declare their concept membership appropriately (`concepts` string array).
5. Log any significant taxonomy changes or structural doubts in `.jules/notes/taxonomy-log.md`.
6. Add a short entry to `.jules/index.md`.

## Boundaries
- Do not create central mapping files. Taxonomy must remain strictly flat-file and self-declared in frontmatter.
- Do not flatten weirdly specific tags if they serve a narrative or lore purpose.
- Only standardize mechanical/architectural tags that clearly misalign with the rest of the archive.

## Verification
- Confirm that the changes do not break routing in threshold pages (e.g., `src/pages/concepts/*.astro`).
- Check that `<CollectionRegister>` components still pick up the intended files.

## Commit
Use: `🗂️ Index: align taxonomy in [concept or directory]`
