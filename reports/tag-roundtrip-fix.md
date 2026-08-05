# Tag Round-Trip Fix — Root Cause & Regression Coverage

**Status:** resolved  
**Affected surface:** `content/` source of record + every generated artifact that
carries frontmatter tags (IR graph, RAG parts, context bundle, llms.txt, HTML).
**Fix:** `scripts/fix_tag_truncation.py` (repair tool) + `scripts/test_tag_roundtrip.py`
(regression gate). Source content repaired in place; outputs regenerated via
`scripts/filed-publish.sh`.

---

## 1. Symptom

Generated outputs and, on inspection, the source tree itself contained tags whose
first two characters were missing, in every collection:

| canonical tag       | corrupted form   |
|---------------------|------------------|
| `mascots`           | `scots`          |
| `empathegy`         | `pathegy`        |
| `managed-absence`   | `naged-absence`  |
| `continuity-theatre`| `ntinuity-theatre`|
| `compliance-warning`| `mpliance-warning`|
| `metrics-of-care`   | `trics-of-care`  |
| `assurance-vocabulary`| `ssurance-vocabulary` |

The corruption was visible in the HTML, sitemap, llms.txt, IR graph, RAG parts,
and context bundle — anywhere tags flow through.

## 2. Where the leading characters were lost

**Root cause: the Astro→Boris migration mapper (commit `8e7db007`).**

The migration mapper transformed each block-list tag scalar as:

    stripped = quote_strip(raw[2:])        # slice off the first 2 chars

That is, it took the raw YAML scalar — *including any surrounding quote
characters* — and sliced off its first two characters before removing quotes.
Consequences observed across the corpus:

- **Indented block items** (`tags:` → `  - compliance-warning`) were truncated:
  `compliance-warning` → `mpliance-warning`.
- **Quoted scalars** lost the quote *and* the first character of the value:
  `'403'` → `'403'[2:] = "03'"` → quote-strip → `03`.
- **Column-0 block items** (`- foo` at line start, seen in some pre-migration
  lorelog files) were **dropped entirely** — the mapper's regex only matched
  indented items.
- **Inline single-line arrays** (`tags: ["a", "b"]`) survived intact.
- The mapper then **prepended the collection name** as the first tag and
  **deduplicated** the truncated results (e.g. `soma`/`coma` both → `ma`,
  collapsing to one entry).

The pre-migration source (`6abe4416^`, Astro-era `src/content/`) was correct;
the corruption was baked into `content/` by the migration itself, then faithfully
mirrored into every generated output by the (otherwise correct) Boris compiler.
A Boris round-trip probe confirmed the compiler preserves clean input byte-for-byte;
it is not the source of the loss.

## 3. Fix strategy

Because the mapper no longer exists (it was an external one-shot migration), the
fix is applied to the **source of record** (`content/`), restoring tags to their
pre-migration ground-truth values, then regenerating all outputs.

**Ground truth:** the Astro-era tree at `6abe4416` (`src/content/` +
`src/content-residue/`), resolved per-file through `metadata/id-map.jsonl`
(exact legacy→current correspondence). The 18 `reference/fref-09xx` records
were recreated by the migration from quarantined copies
(`content-residue/workflow/reference/*.quarantined.md`), which provide their
ground truth.

**Target rule applied to every satellite record:**

    target = [collection] + dedup(quote_strip(pre-migration tags + concepts))

- Values are restored in full (no `[2:]` slicing).
- The collection-name prefix and dedup behavior are preserved to match the
  established post-migration format (`tags: ["reference", "scratchpad", …]`).
- The list is capped at **32 tags** — the Boris frontmatter schema maximum
  (verified empirically: 33 tags fails `EFRONTMATTER`). Only one file
  (`mascots/005.bricky-goldbricksworth.md`, whose pre-migration source carried
  47 unique tags) required the cap; it is applied in source-of-record order.

**No legitimate source tags were renamed or reordered.** Each value in the
repaired `tags:` line is byte-identical to a pre-migration tag value
(or, for the 18 quarantined-derived records, to the quarantined ground truth).

### Repair tool

`scripts/fix_tag_truncation.py`

- Resolves each satellite to its pre-migration file via the id-map.
- Parses `tags:`/`concepts:` (block or inline) from the ground-truth source.
- Computes the target list and rewrites the frontmatter `tags:` line as an
  inline JSON array.
- `--dry-run` reports; `--apply` writes. Idempotent: re-running reports
  `files to change : 0`.

Runbook:

```bash
git archive 6abe4416 src/content src/content-residue | tar -x -C scratch/pre-tree
python3 scripts/fix_tag_truncation.py --apply
```

## 4. Regression test

`scripts/test_tag_roundtrip.py` proves the canonical values round-trip unchanged:

- **Serialization round-trip:** each of the seven named tags is serialized
  (`json.dumps` in the same `tags: [...]` form the repair tool writes) and
  re-parsed; the value must come back byte-identical.
- **Corpus presence:** each named tag must be present, intact, in a real
  repaired file (representative files chosen from the corpus).
- **Fragmentation guard:** the known-bad fragments (`scots`, `pathegy`,
  `naged-absence`, `ntinuity-theatre`, `mpliance-warning`, `trics-of-care`)
  must not appear verbatim anywhere in `content/`.

Run:

```bash
python3 scripts/test_tag_roundtrip.py   # PASS — 7/7 round-trip, no fragments
```

## 5. Validation performed

| Check | Result |
|---|---|
| `python3 scripts/fix_tag_truncation.py --dry-run` | `files to change : 0`, `already correct : 2254` |
| `python3 scripts/test_tag_roundtrip.py` | PASS |
| `python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl` | `validated 2265 pages; no files changed` |
| `./bin/validate_graph.sh` | Boris graph diagnostics: only documented unreferenced-page baseline |
| `python3 scripts/audit_markdown_links.py content` | all local Markdown links resolve |
| `python3 scripts/audit_html_ids.py content` | 0 pages with duplicate IDs |
| `scripts/filed-publish.sh` | regenerated `publish/{site,ir,rag,context,llms.txt}`; no `EFRONTMATTER` errors |
| grep for corrupt fragments in `publish/` | none (tag values clean) |

## 6. Files changed

- `content/**` — repaired `tags:` frontmatter (1,680 files rewritten; 574 already correct)
- `scripts/fix_tag_truncation.py` — new repair tool
- `scripts/test_tag_roundtrip.py` — new regression test
- `reports/tag-roundtrip-fix.md` — this document
