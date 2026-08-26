# Relationship Integrity — Export Audit

**Status:** PASS  
**Surface:** RAG working packs (verbatim frontmatter relations), context bundle (`relations`), source of record (`content/`)  
**Repair:** `scripts/repair_relationships.py`  
**Validation:** `scripts/validate_relationships.py`  
**Recovery:** `metadata/relationship-map.jsonl` + `metadata/relationship-recovery.json` (provenance commit `6abe4416`)  
**Generated:** 2026-08-25

## Relationship export

| metric | value |
|---|---|
| Canonical relationships exported | 2356 across 1334 records |
| Legacy declared relationships discovered | 2661 |
| Legacy relationships resolved | 2602 |
| Legacy relationships unresolved (missing target) | 54 |
| Legacy relationships ambiguous | 4 |
| Legacy self-links (excluded) | 0 |
| Legacy declarations from unmigrated sources | 1 |
| Legacy duplicate declarations removed (per-record dedup) | 361 |
| Structural-only excluded (parentEntry) | 1632 |
| Current-source relationships discovered | 123 |
| RAG pack relations exported | 70 |
| RAG documents seen in packs | 2345 |
| Context relationships exported | 2356 |
| Unresolved current-source declarations | 0 |

## Summary

| check | findings |
|---|---|
| Missing targets | 0 |
| Duplicate relationships | 0 |
| Self-links | 0 |
| Malformed IDs | 0 |
| Missing from RAG export | 0 |
| Missing from context export | 0 |
| Unexpected in RAG export | 0 |
| Unexpected in context export | 0 |
| Bundle membership loss | 0 |
| Recovery reconciliation | 0 |
| **total** | **0** |

## Relationship model

- RAG working packs (boris-rag schema 2) are verbatim authoring documents;
  their only relationship surface is each record's own frontmatter `relations`
  declaration, carried through unmodified.
- The context bundle is the provenance-rich projection: its per-record
  `relations` field carries the canonical set in first-seen order across four
  sources: recovered pre-migration declarations
  (metadata/relationship-map.jsonl), frontmatter `relations`, legacy
  `relatedEntries`, and explicit Markdown cross-references that resolve to a
  record.
- Structural adjacency (parent, collection membership) is never exported as a
  semantic relation on either surface.
- Repeated identical values are deduplicated per record.
- Missing and ambiguous legacy targets are reported here instead of being silently
  discarded.
- Parity: every frontmatter-declared relation must appear verbatim in the RAG
  packs; the full canonical set (including recovered legacy edges) must appear
  in the context export. An empty export field for a relationship-bearing
  record is a finding.

## Recovery reconciliation

The count difference between the pre-migration declarations and the recovered
canonical export is fully explained by the named categories below; the audit
fails if any row does not reconcile.

| step | count |
|---|---|
| Pre-migration declared relationships (legacy audit scope) | 4293 |
| − Structural-only excluded (parentEntry) | 1632 |
| = Semantic legacy declarations recovered | 2661 |
| &nbsp;&nbsp;· resolved | 2602 |
| &nbsp;&nbsp;· unresolved (missing target) | 54 |
| &nbsp;&nbsp;· ambiguous | 4 |
| &nbsp;&nbsp;· self-link (excluded) | 0 |
| &nbsp;&nbsp;· source-unmigrated | 1 |
| − Duplicate declarations removed (per-record dedup) | 361 |
| = Legacy-contributed canonical edges | 2241 |
| + Current-source relationships exported | 115 |
| = Total canonical relationships exported | 2356 |

**Intentionally excluded from the canonical export:** structural-only parentEntry declarations (1632); declarations from unmigrated legacy sources (1); content-residue quarantined declarations (18 in 146 files, outside the legacy audit scope).

**Unresolved and ambiguous legacy declarations are reported, never dropped:**

- unresolved (missing target): 54
- ambiguous: 4

| legacy source | field | declared target | status |
|---|---|---|---|
| `aphorisms/APH-221.mccrisp-agent.md` | `mascotRef` | `mccrisp-agent` | missing |
| `haikus/hai-013-htaccessius-the-doorman.md` | `relatedMascots` | `013.htaccessius-the-doorman` | missing |
| `haikus/hai-019-kindy-mcexistentialcrisis.md` | `mascotRef` | `kindy-mcexistentialcrisis` | missing |
| `haikus/hai-075-anlas-appenhancer.md` | `mascotRef` | `75.anlas-appenhancer` | missing |
| `haikus/hai-075-anlas-appenhancer.md` | `relatedMascots` | `75.anlas-appenhancer` | missing |
| `haikus/hai-221-mccrisp-agent.md` | `mascotRef` | `mccrisp-agent` | missing |
| `haikus/hai-llg-0324-map.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| `haikus/hai-llg-0326-dxs.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| `haikus/hai-llg-0338-sbi.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| `haikus/hai-llg-0401-scas-echo.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| `haikus/hai-llg-0405-sac.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| `haikus/hai-llg-0407-ssp.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| `haikus/hai-llg-0408-ah1.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| `haikus/hai-llg-0821-scl.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| `limericks/lim-bad-gateway-greg.md` | `relatedMascots` | `002.bad-gateway-greg` | missing |
| `limericks/lim-servicey-unavailabelle.md` | `relatedMascots` | `043.servicey-unavailabelle` | missing |
| `limericks/lim-teapotta-protocol.md` | `relatedMascots` | `047.teapotta-protocol` | missing |
| `limericks/lim-ds-404-alpha.md` | `relatedMascots` | `YamTeams ProLink Enterprise Suite 365` | missing |
| `limericks/LIM-LLG-0012-A.md` | `relatedMascots` | `002.clicky-orphaned-ui` | missing |
| `limericks/LIM-LLG-0052-MFX.md` | `relatedMascots` | `013.kindy-mcexistentialcrisis` | missing |
| `limericks/LIM-LLG-0088-B.md` | `relatedMascots` | `003.boily-mcplaterton` | missing |
| `limericks/LIM-LLG-0115-TNS.md` | `relatedMascots` | `013.kindy-mcexistentialcrisis` | missing |
| `limericks/LIM-LLG-0220-UIS.md` | `relatedMascots` | `013.kindy-mcexistentialcrisis` | missing |
| `limericks/LIM-LLG-0223-EFA.md` | `relatedMascots` | `013.kindy-mcexistentialcrisis` | missing |
| `limericks/LIM-LLG-0382-BPD.md` | `relatedMascots` | `kindy-mcexistentialcrisis` | missing |
| … and 33 more | | | |

## Findings

### Missing targets

_none_

### Duplicate relationships

_none_

### Self-links

_none_

### Malformed IDs

_none_

### Missing from RAG export

_none_

### Missing from context export

_none_

### Unexpected in RAG export

_none_

### Unexpected in context export

_none_

### Bundle membership loss

_none_

### Recovery reconciliation

_none_

## Validation commands

```bash
python3 scripts/recover_relationships.py --verify
python3 scripts/repair_relationships.py --content content --context-dir publish/context
python3 scripts/validate_relationships.py --content content --rag-dir publish/rag --context-dir publish/context
```
