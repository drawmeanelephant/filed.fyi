# Relationship Integrity — Export Audit

**Status:** PASS  
**Surface:** RAG export (`related`), context bundle (`relations`), source of record (`content/`)  
**Repair:** `scripts/repair_relationships.py`  
**Validation:** `scripts/validate_relationships.py`  
**Generated:** 2026-08-05

## Summary

| check | findings |
|---|---|
| Missing targets | 0 |
| Duplicate relationships | 0 |
| Self-links | 0 |
| Relationships pointing only to bundle containers | 0 |
| Malformed IDs | 0 |
| **total** | **0** |

## Relationship model

- `parent_entry` is the repository parent (structural), never a bundle container.
- `related` / `relations` carry source-supported semantic relationships only:
  frontmatter `relations`, legacy `relatedEntries`, and explicit Markdown
  cross-references that resolve to another record.
- Bundle-part membership is stored separately (`bundle_parts`), never in `related`.
- Repeated identical values are deduplicated per record.
- Unresolved targets are reported here instead of being silently discarded.

## Findings

### Missing targets

_none_

### Duplicate relationships

_none_

### Self-links

_none_

### Relationships pointing only to bundle containers

_none_

### Malformed IDs

_none_

## Validation commands

```bash
python3 scripts/repair_relationships.py --content content --rag-dir publish/rag --context-dir publish/context
python3 scripts/validate_relationships.py --content content --rag-dir publish/rag --context-dir publish/context
```
