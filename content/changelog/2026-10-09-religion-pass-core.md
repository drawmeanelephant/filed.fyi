---
title: "Religion pass: doctrinal core slice — FREF-0920, mascots M-0086–0091, lorelogs LLG-0921–0938"
parent: changelog
status: published
tags: ["changelog", "religious-administration", "content-ingestion"]
---

# Religion pass: doctrinal core slice — FREF-0920, mascots M-0086–0091, lorelogs LLG-0921–0938

**Maintenance ID:** 0.1.00276.religion-pass-core
**Date:** 2026-10-09
**Scope:** `content/reference/`, `content/mascots/`, `content/lorelog/` — religion-pass core cluster (issues #1022–#1026)

## What changed

25 MDX source records from `.inbox/religion-pass/cluster/` were converted to Boris-compliant Markdown.

- `reference/FREF-0920-RAB` filed as `content/reference/fref-0920-rab.md` (issue #1022). Doctrine matrix and capture taxonomy retained as Markdown tables; `[^map]` footnote retained; Related Entries promoted to `relations:` and a `## Related` wikilink section.
- Mascots 074–077 converted faithfully as failure-signature records under `mascots/M-0086`–`M-0089` (issue #1023). Issue text described "character biographies"; the source is the shared failure-signature template and was converted as written.
- Thirteen templated seam records (sources 078–090) consolidated into one registry record, `mascots/M-0090` (`content/mascots/090.religious-administrative-seams.md`), per maintainer ruling Option B (issue #1024). Per-seam primary deviations preserved under Known Failures.
- `mascots/M-0091` (`content/mascots/091.capture-vector.md`) filed per issue #1025.
- Lorelogs LLG-0921–LLG-0938 filed per issue #1026; source `mascots/0NN-*` refs remapped to canonical `mascots/M-XXXX` ids per the religion-pass ID map.
- Conversions applied: non-Boris frontmatter keys (`traditionHome`, `rotAffinity`, `bureaucraticFunction`, `breedingProgram`, `crossBreedsWith`, `captureVectorSusceptibility`) stripped and folded into `tags`; Hidden Knowledge Block → `> **ARCHIVIST'S NOTE:**` blockquote; Broadside Marginalia → `> **MARGINALIA:**` blockquote; Sora Prompts and Breeding Program Eligibility sections removed; Related Entries / Related Lorelog Refs → `relations:` edges plus `## Related` wikilink sections.

## What was deliberately left alone

- Mascot Haiku Log / Limerick Log residue kept as written on M-0086–M-0089 and M-0091, per ID-map note (the bespoke verse lives in standalone verse records).
- The source's doubled `mascots/091-capture-vector` ref and self-referencing `LLG-0938-CAPTURE-VECTOR` entry on LLG-0938 were deduplicated; the self-edge was not retained.
- Templated cluster-zip verse files and held DISP/EDUC/FAML/GRIE/RECD seam verse — out of scope per ID map (#1028).

## Verification performed

- `python3 scripts/check_collection_counts.py` — see PR body for outcome.
- `./bin/validate_graph.sh` — see PR body for outcome.

## Unresolved follow-up

- Standalone verse records (poetry-zip bound IDs) and greenfield extension records (FREF-0921..0923, M-0092, LLG-0939) belong to later religion-pass slices.
