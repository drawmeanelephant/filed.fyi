# Duplicate Audit — `FREF-0815-MAP.md` vs `fref-0815-map.md`

**Date:** 2026-08-05
**Branch:** `audit/fref-0815-duplicate` (from `origin/main` @ `b5cd8a5c`)
**Scope:** Report-only. Neither `content/reference/FREF-0815-MAP.md` nor `content/reference/fref-0815-map.md` was deleted, merged, or modified.

---

## Executive Summary

**There is no duplicate file.** Git tracks exactly one record — `content/reference/FREF-0815-MAP.md` (uppercase). The lowercase path `content/reference/fref-0815-map.md` is **not tracked, never existed in git history, and is not a separate file on disk**. On the case-insensitive workspace volume (APFS), the lowercase path resolves to the same inode as the uppercase file; it is a pure filesystem alias, not a second record.

**Classification: `case-collision artifact`** — a single canonical uppercase file whose lowercase spelling aliases it on case-insensitive filesystems and 404s on case-sensitive filesystems. No divergence, no shadowing, no double-indexing.

---

## 1. Filesystem Status

| Probe | Result |
|---|---|
| `ls content/reference/` | Shows only `FREF-0815-MAP.md` (11,098 bytes) |
| `git ls-files` (index) | Only `content/reference/FREF-0815-MAP.md` |
| `git rev-parse origin/main:content/reference/fref-0815-map.md` | `fatal: path '...' exists on disk, but not in 'origin/main'` |
| `git status --short` | Clean — nothing untracked, nothing modified |
| Workspace volume | `/dev/disk3s5` APFS (Data), case-insensitive (`core.ignorecase=true`) |
| Inode check | `FREF-0815-MAP.html` and `fref-0815-map.html` in `dist/` share inode `198211841` |

The workspace is on the case-insensitive APFS data volume. Writing `.CS`/`.cs` test files and reading them confirmed case-insensitive resolution. Because `core.ignorecase=true`, git indexes only the case it was added with — uppercase.

---

## 2. Byte Contents

Only one physical file exists. Its blob is:

```
7b111f0a3aaa5ac465a496199e7b1157f3039de8   (11,098 bytes)
```

Identical blob hash in `origin/main`, `HEAD`, and the `969c7400` t3 checkpoint tree. No byte-level comparison between two files is possible because a second file does not exist — the lowercase path returns the same 11,098-byte content.

---

## 3. Frontmatter (single record)

```yaml
title: "Managed Absence Spine"
id: reference/FREF-0815-MAP
parent: reference
status: published
tags: ["reference", "managed-absence", "conceptually-active", "administratively-retired", "archivally-asserted", "continuity-optics", "failure-signature", "residual-truth", "assurance-optics", "trust-surface", "bait-adjacent", "verification-collapse", "decorative-trust"]
```

- **ID:** `reference/FREF-0815-MAP` (matches filename casing; no frontmatter-derived lowercase ID exists)
- **Title:** `Managed Absence Spine`
- **Parent:** `reference`
- **Tags:** 13, all canonical (post `8c10bb30` tag-truncation repair; the `8e7db007` migration snapshot carried truncated tags like `naged-absence`, since fixed)

---

## 4. id-map Entries (`metadata/id-map.jsonl`)

Single entry at line 2136:

```json
{"collection": "reference", "form_id": "FREF-0815-MAP", "id": "reference/FREF-0815-MAP",
 "legacy_id": "reference/FREF-0815-MAP", "parent": "reference", "role": "satellite",
 "source": "reference/FREF-0815-MAP.md", "title": "Managed Absence Spine"}
```

- No `reference/fref-0815-map` entry exists anywhere in `id-map.jsonl`.
- The companion aphorisms/haikus/limericks records (`aph-/hai-/lim-fref-0815-map.md`) use **lowercase filenames but uppercase IDs** (`APH-/HAI-/LIM-FREF-0815-MAP`) — these are distinct records in different collections, not a reference collision. Their lowercase filenames are intentional per-collection naming, and their routes derive from uppercase IDs.

---

## 5. Source Links to Each Casing

**Uppercase references (used everywhere):**
- `content/guides/managed-absence-and-forms.md:15,33` → `[Managed Absence Spine](../reference/FREF-0815-MAP.md)`
- `content/mascots/327.minutes-without-motion.md:122` → `` `FREF-0815-MAP` ``
- `content/reference/fref-0827-tsxl.md:16` → `` `FREF-0815-MAP` ``

**Lowercase references:** none exist in any content, script, workflow, or metadata file. Grep across the repository for `fref-0815-map` in `content/`, `scripts/`, `.github/workflows/`, and `metadata/` returns only the uppercase-formatted companions and the uppercase reference file.

---

## 6. Rendered Routes

Boris emits routes from the frontmatter `id` (uppercase), so the canonical route is:

```
dist/cantilever/reference/FREF-0815-MAP.html
```

Only **one** HTML target is written for this record. The lowercased lookup `dist/cantilever/reference/fref-0815-map.html` returns the same inode on case-insensitive filesystems (alias, not a separate emitted page). Boris reports exactly one page; `build-report.json` / manifest list a single `reference/FREF-0815-MAP`.

The reference trunk page lists it once, uppercase: `dist/cantilever/reference.html:188` → `<a href="reference/FREF-0815-MAP.html">`.

---

## 7. Sitemap Inclusion

`sitemap.xml` line 2217 (exactly one entry):

```xml
<url><loc>https://filed.fyi/reference/FREF-0815-MAP.html</loc></url>
```

The lowercase URL appears nowhere in the sitemap. On case-sensitive hosts the lowercase URL would return 404; on case-insensitive hosts it aliases the canonical page but is never advertised.

---

## 8. RAG / Context Entries

Exported artifacts (via `filed-publish.sh`) contain a single uppercase entry each:

- `publish/rag/content/pages/reference/FREF-0815-MAP.md`
- `publish/context/pages/reference/FREF-0815-MAP.md`
- `publish/llms.txt:2226` → `- [Managed Absence Spine](/reference/FREF-0815-MAP/): Managed Absence Spine`

No lowercase `reference/fref-0815-map` path appears in `publish/ir`, `publish/rag`, `publish/context`, or `llms.txt`.

---

## 9. IR / Graph Entries

`publish/ir/graph.json` and `publish/ir/manifest.json` list exactly one reference record:

```json
"id": "reference/FREF-0815-MAP",
"sourcePath": "reference/FREF-0815-MAP.md"
```

The `FREF-0815-MAP` value appears in the graph's related-values arrays for the companion satellites (aphorisms/haikus/limericks) and the reference record itself — no lowercase counterpart.

---

## 10. Git History & Provenance

| Commit | Action |
|---|---|
| `8e7db007` (2026-08-03) Boris migration | `A content/reference/FREF-0815-MAP.md` (blob `7b111f0a` today; truncated tags at add time) |
| `8c10bb30` tag-truncation repair | `M` — tags restored to full canonical set |
| `969c7400` t3 checkpoint snapshot | `A content/reference/FREF-0815-MAP.md` (same blob `7b111f0a`) |

**Lowercase path occurrences in git:** `0` — checked across every tree in every commit (`git rev-list --all`). The uppercase path appears in 28 trees. The lowercase path has never been added, renamed to, or deleted in this repository's history. There is no case-sensitive collision inside git itself.

---

## 11. Behavior by Filesystem

| Filesystem | Behavior |
|---|---|
| **Case-insensitive** (this workspace APFS, macOS/Windows default, Cloudflare runtime) | Lowercase path aliases the uppercase file — same inode, same content. Serves correctly. Not separately indexed; sitemap/llms/RAG list only uppercase. No shadowing (one physical file), no double-count. |
| **Case-sensitive** (typical Linux CI) | Lowercase path does not exist → 404. Build is unaffected because git tree contains only the uppercase entry; `filed_ids.py` validation and Boris build resolve the single canonical file. |

---

## 12. Which File Boris Treats as Canonical

The uppercase file `content/reference/FREF-0815-MAP.md` is canonical. Boris derives the page route and ID from frontmatter (`id: reference/FREF-0815-MAP`, `parent: reference`), and the IR source path preserves the tracked filename casing (`reference/FREF-0815-MAP.md`). The lowercase spelling is neither independently indexed nor canonical — it is a case-insensitive alias only.

---

## 13. Validation Executed

All gates ran from the fresh `audit/fref-0815-duplicate` branch with `BORIS_BIN=/Users/tbuddy/dev/dorpus/bin/boris`:

| Command | Result |
|---|---|
| `./bin/validate_graph.sh` | ✅ Passed — form IDs validated (2,265 pages, no files changed); Boris graph diagnostics at documented baseline; Cantilever publication compiled; HTML ID audit 0 duplicates; "Filed build passed". |
| `./scripts/filed-build.sh` (via validate_graph) | ✅ 2,265 pages rendered, Markdown link audit clean |
| `./scripts/filed-publish.sh` | ⚠️ site/IR/RAG/context/sitemap/llms exported; **pre-existing** `llms.txt` UTF-8 decode failure at byte ~329k in this Boris build — unrelated to this pair (single file, no duplicates) |

No link, ID, graph, or publication failure touches either casing of this record.

---

## 14. Classification

**`case-collision artifact`**

Rationale:
- Not an **exact/metadata-equivalent duplicate** — a second file does not exist anywhere (git, index, or disk).
- Not **divergent records sharing identity** — there is one record, one blob, one route, one sitemap entry, one id-map entry.
- Not an **intentional alias** — nothing references the lowercase path; it has no provenance.
- The lowercase name is a case-only spelling of the same inode on case-insensitive filesystems and a missing path on case-sensitive ones. This is the defining property of a case-collision artifact.
- **Not unresolved.**

Neither file is unreachable, shadowed, or independently indexed: the uppercase canonical file is fully reachable and indexed; the lowercase spelling is a virtual alias.

---

## 15. Recommended Smallest Safe Follow-Up (not performed)

No content change is required. The smallest safe follow-up is a **verification-only check**: on a case-sensitive filesystem (or a git-aware scan) confirm `git ls-files content/reference/ | grep -i 'fref-0815'` yields exactly the single uppercase entry and that a full `validate_graph.sh` run stays green — which this report already establishes. Optionally, add a line to the reference-collection naming guidance noting that reference files must be committed in uppercase-ID casing to avoid case-collision ambiguity on case-insensitive developer machines. No file deletion, merge, or rename is warranted.
