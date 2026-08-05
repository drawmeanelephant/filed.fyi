# Relationship Integrity — Export Audit

**Status:** PASS  
**Surface:** RAG export (`related`), context bundle (`relations`), source of record (`content/`)  
**Repair:** `scripts/repair_relationships.py`  
**Validation:** `scripts/validate_relationships.py`  
**Generated:** 2026-08-05

## Relationship export

| metric | value |
|---|---|
| Source-supported relationships | 8 across 5 records |
| RAG relationships exported | 8 |
| Context relationships exported | 8 |
| Bundle memberships preserved | 0 |
| Unresolved source declarations | 0 |

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
| RAG/context disagreement | 0 |
| Bundle membership loss | 0 |
| **total** | **0** |

## Relationship model

- `parent_entry` is the repository parent (structural), never a bundle container.
- `related` / `relations` carry source-supported semantic relationships only:
  frontmatter `relations`, legacy `relatedEntries`, and explicit Markdown
  cross-references that resolve to another record.
- Bundle-part membership is stored separately (`bundle_parts`), never in `related`.
- Repeated identical values are deduplicated per record.
- Unresolved targets are reported here instead of being silently discarded.
- Parity: every source-supported relationship must appear in both the RAG and
  context exports; an empty export field for a relationship-bearing record is a finding.

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

### RAG/context disagreement

_none_

### Bundle membership loss

_none_

## Validation commands

```bash
python3 scripts/repair_relationships.py --content content --rag-dir publish/rag --context-dir publish/context
python3 scripts/validate_relationships.py --content content --rag-dir publish/rag --context-dir publish/context
```
