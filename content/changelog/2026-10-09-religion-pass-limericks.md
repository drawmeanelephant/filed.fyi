---
title: "Religion pass: limerick records"
parent: changelog
status: published
tags: ["changelog", "maintenance", "limericks"]
---

# Religion pass: limerick records

**Maintenance ID:** 0.1.00278.religion-pass-limericks
**Date:** 2026-10-09
**Scope:** content/limericks/

## What changed
- Converted 23 limerick records from the religion-pass focused poetry pass into Boris-compliant Markdown: 18 mascot-bound records bound to their paired lorelog infixes (`limericks/LIM-LLG-0921-CURIA-ARCHIVE` … `limericks/LIM-LLG-0938-CAPTURE-VECTOR`) and 5 seam records (`limericks/LIM-SEAM-CLER`, `DOCT`, `PROP`, `STAT`, `SUCC`).
- `coreCounterpart` frontmatter was folded into `relations: [relates_to=mascots/M-XXXX]` per the Option B remap (074→M-0086, 075→M-0087, 076→M-0088, 077→M-0089, 078–090→M-0090, 091→M-0091); the `**Core counterpart:**` body line was retained as a `[[mascots/M-XXXX|label]]` wikilink. Seam records were pointed at the consolidated registry, `mascots/M-0090`.
- `/`-joined verse lines were split into 5-line stanzas with two-space hard breaks.
- Status set to `archived` per limerick collection convention; tags carry the source's `poetry`, `religious-administration`, `core-bound` under the `limericks` collection tag.

## What was deliberately left alone
- The mascot targets (`mascots/M-0086`..`M-0091`) and lorelog infix records (`lorelog/LLG-0921`..`0938`) are not in this branch; they land in the religion-pass core PR. The resulting dangling relations are expected pending merge.
- Cluster-zip templated verse and the held DISP/EDUC/FAML/GRIE/RECD seam verse remain out of scope per the ID map.

## Verification performed
- `./bin/validate_graph.sh` — Boris check plus Cantilever compile; only expected dangling-relation findings toward the pending mascot targets.
- `python3 scripts/check_collection_counts.py` — trunk counts and README census consistent.

## Unresolved follow-up
- Dangling `relates_to` edges resolve once the rel-core records merge.
