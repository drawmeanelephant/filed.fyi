---
title: "Maintenance Docket Convention Established"
id: changelog/CHG-0002
parent: changelog
status: published
tags: ["changelog", "convention", "infrastructure"]
---

# Maintenance Docket Convention Established

**Maintenance ID:** 0.1.00001.docket-convention
**Date:** 2026-08-07
**Scope:** changelog collection, docs/

---

## What changed

- Redescribed `content/changelog.md` (trunk) to clarify the collection's purpose as a maintenance docket, distinct from `/releases/`.
- Added the maintenance identifier format (`0.1.NNNNN.task-slug`) to the trunk description.
- Created `docs/changelog-convention.md` to document the entry shape, identifier scheme, and tone model for future contributors.
- Created this entry (CHG-0002) as the inaugural example of the new format.

## What was deliberately left alone

- `content/changelog/2026-04-22-init.md` (CHG-0001) was not renumbered or reformatted. It predates this convention and retains its original shape.
- `/releases/` records were not touched. The distinction between maintenance docket entries and release declarations is conceptual, not structural; no cross-file reorganization was required.
- No new frontmatter keys were introduced. Date, scope, and maintenance ID are body text, not YAML fields. The Boris schema remains closed.
- No dynamic tracking infrastructure was created.

## Files touched

- `content/changelog.md` — trunk description updated
- `content/changelog/2026-08-07-docket-convention.md` — this record, created
- `docs/changelog-convention.md` — convention reference, created

## Verification performed

- `./bin/validate_graph.sh` passed with no errors.
- Frontmatter keys in the new record (`title`, `id`, `parent`, `status`, `tags`) are within the established closed schema.
- Existing CHG-0001 record is undisturbed.

## Unresolved follow-up

- The trunk count (`Count: N records`) is maintained by hand. If the collection grows significantly this will become incorrect at predictable intervals.
- CHG-0001 is stylistically inconsistent with this format. It may be left as-is; inconsistency between pre-convention and post-convention entries is legible and accurate.
