---
title: "Maintenance Docket Convention Established"
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
- Eliminated synthetic form-ID allocations (`CHG-NNNN`) for changelog entries in `scripts/filed_ids.py`, letting Boris derive stable entity IDs directly from file paths.
- Created this entry as the inaugural example of the new format.

## What was deliberately left alone

- `/releases/` records were not touched. The distinction between maintenance docket entries and release declarations is conceptual, not structural; no cross-file reorganization was required.
- No new frontmatter keys were introduced. Date, scope, and maintenance ID are body text, not YAML fields. The Boris schema remains closed.
- No dynamic tracking infrastructure was created. `metadata/id-map.jsonl` remains frozen historical migration provenance.

## Files touched

- `content/changelog.md` — trunk description updated
- `content/changelog/2026-08-07-docket-convention.md` — this record, created
- `docs/changelog-convention.md` — convention reference, created
- `scripts/filed_ids.py` — changelog removed from synthetic form allocation

## Verification performed

- `./bin/validate_graph.sh` passed with no errors.
- Frontmatter keys in the new record (`title`, `parent`, `status`, `tags`) are within the established closed schema.

## Unresolved follow-up

- The trunk count (`Count: N records`) is maintained by hand. The count must be accurate at commit time.

