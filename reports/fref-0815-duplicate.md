# Duplicate Audit — `FREF-0815-MAP.md` vs `fref-0815-map.md`

**Date:** 2026-08-05
**Branch:** `audit/fref-0815-duplicate` (from `origin/main` @ `b5cd8a5c`)
**Scope:** Report-only. Neither `content/reference/FREF-0815-MAP.md` nor `content/reference/fref-0815-map.md` was deleted, merged, or modified.

---

## Executive Summary

**This is a false duplicate report caused by local case-insensitive path resolution, not two repository records.** Git tracks exactly one record — `content/reference/FREF-0815-MAP.md` (uppercase). The lowercase path `content/reference/fref-0815-map.md` is **not tracked, never existed in git history, and is not a separate file on disk**. On the case-insensitive local checkout volume (APFS), the lowercase path resolves to the same file as the uppercase path; it is a filesystem alias, not a second record.

**Classification: `case-collision artifact, local-checkout only`** — a single canonical uppercase tracked file whose lowercase spelling is resolved by the local case-insensitive checkout as an alias of the same file. This classification says nothing about the deployed HTTP surface; it describes local checkout behavior only. No divergence, no shadowing, no double-indexing.

---

## 1. Filesystem Status (Local Checkout)

| Probe | Result |
|---|---|
| `ls content/reference/` | Shows only `FREF-0815-MAP.md` (11,098 bytes) |
| `git ls-files` (index) | Only `content/reference/FREF-0815-MAP.md` |
| `git rev-parse origin/main:content/reference/fref-0815-map.md` | `fatal: path '...' exists on disk, but not in 'origin/main'` |
| `git status --short` | Clean — nothing untracked, nothing modified |
| Workspace volume | `/dev/disk3s5` APFS (Data), case-insensitive (`core.ignorecase=true`) |
| Inode check | `FREF-0815-MAP.html` and `fref-0815-map.html` in `dist/` share inode `198211841` |

The local checkout is on the case-insensitive APFS data volume. Writing `.CS`/`.cs` test files and reading them confirmed case-insensitive path resolution. Because `core.ignorecase=true`, git indexes only the case it was added with — uppercase.

---

## 2. Surface Separation

Three surfaces are treated independently. Evidence collected in this audit applies to **the local checkout** and to **the case-sensitive git tree / Linux checkout**; it does **not** extend to **the deployed HTTP route surface**.

| Surface | What the audit observes | What the audit does NOT prove |
|---|---|---|
| **Local case-insensitive checkout** (this APFS volume) | Lowercase path lookup resolves the same file (same inode) as the uppercase tracked file. | — |
| **Case-sensitive git tree / Linux checkout** | Git tree contains exactly one uppercase entry; no lowercase git-tree entry exists in any commit. | — |
| **Deployed HTTP route behavior** | Sitemap, exports, and generated routes advertise only the uppercase canonical URL. | Deployed URL casing behavior is **not** observed or proved here. |

The audit proves behavior on the first two surfaces only. It makes no claim about how the deployed HTTP layer resolves a lowercase request — that is outside the scope of a local checkout audit.

---

## 3. Byte Contents

Only one physical file exists. Its blob is:

```
7b111f0a3aaa5ac465a496199e7b1157f3039de8   (11,098 bytes)
```

Identical blob hash in `origin/main`, `HEAD`, and the `969c7400` t3 checkpoint tree. No byte-level comparison between two files is possible because a second file does not exist — the lowercase path returns the same 11,098-byte content via case-insensitive resolution.

---

## 4. Frontmatter (single record)

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

## 5. id-map Entries (`metadata/id-map.jsonl`)

Single entry at line 2136:

```json
{"collection": "reference", "form_id": "FREF-0815-MAP", "id": "reference/FREF-0815-MAP",
 "legacy_id": "reference/FREF-0815-MAP", "parent": "reference", "role": "satellite",
 "source": "reference/FREF-0815-MAP.md", "title": "Managed Absence Spine"}
```

- No `reference/fref-0815-map` entry exists anywhere in `id-map.jsonl`.
- The companion aphorisms/haikus/limericks records (`aph-/hai-/lim-fref-0815-map.md`) use **lowercase filenames but uppercase IDs** (`APH-/HAI-/LIM-FREF-0815-MAP`) — these are distinct records in different collections, not a reference collision. Their lowercase filenames are intentional per-collection naming, and their routes derive from uppercase IDs.

---

## 6. Source Links to Each Casing

**Uppercase references (used everywhere):**
- `content/guides/managed-absence-and-forms.md:15,33` → `[Managed Absence Spine](../reference/FREF-0815-MAP.md)`
- `content/mascots/327.minutes-without-motion.md:122` → `` `FREF-0815-MAP` ``
- `content/reference/fref-0827-tsxl.md:16` → `` `FREF-0815-MAP` ``

**Lowercase references:** none exist in any content, script, workflow, or metadata file. Grep across the repository for `fref-0815-map` in `content/`, `scripts/`, `.github/workflows/`, and `metadata/` returns only the uppercase-formatted companions and the uppercase reference file.

---

## 7. Rendered Routes

Boris emits routes from the frontmatter `id` (uppercase), so the canonical generated route is:

```
dist/cantilever/reference/FREF-0815-MAP.html
```

Only **one** HTML target is written for this record. On the case-insensitive local checkout, the lowercased lookup `dist/cantilever/reference/fref-0815-map.html` returns the same inode (an alias of the emitted page, not a separate emitted page). Boris reports exactly one page; `build-report.json` / manifest list a single `reference/FREF-0815-MAP`.

The reference trunk page lists it once, uppercase: `dist/cantilever/reference.html:188` → `<a href="reference/FREF-0815-MAP.html">`.

---

## 8. Sitemap Inclusion

`sitemap.xml` line 2217 (exactly one entry):

```xml
<url><loc>https://filed.fyi/reference/FREF-0815-MAP.html</loc></url>
```

The lowercase URL is advertised nowhere in the sitemap. The sitemap documents the canonical (uppercase) URL only. It is not evidence about how the deployed HTTP server resolves a lowercased request.

---

## 9. RAG / Context Entries

Exported artifacts (via `filed-publish.sh`) contain a single uppercase entry each:

- `publish/rag/content/pages/reference/FREF-0815-MAP.md`
- `publish/context/pages/reference/FREF-0815-MAP.md`
- `publish/llms.txt:2226` → `- [Managed Absence Spine](/reference/FREF-0815-MAP/): Managed Absence Spine`

No lowercase `reference/fref-0815-map` path appears in `publish/ir`, `publish/rag`, `publish/context`, or `llms.txt`.

---

## 10. IR / Graph Entries

`publish/ir/graph.json` and `publish/ir/manifest.json` list exactly one reference record:

```json
"id": "reference/FREF-0815-MAP",
"sourcePath": "reference/FREF-0815-MAP.md"
```

The `FREF-0815-MAP` value appears in the graph's related-values arrays for the companion satellites (aphorisms/haikus/limericks) and the reference record itself — no lowercase counterpart.

---

## 11. Git History & Provenance

| Commit | Action |
|---|---|
| `8e7db007` (2026-08-03) Boris migration | `A content/reference/FREF-0815-MAP.md` (blob `7b111f0a` today; truncated tags at add time) |
| `8c10bb30` tag-truncation repair | `M` — tags restored to full canonical set |
| `969c7400` t3 checkpoint snapshot | `A content/reference/FREF-0815-MAP.md` (same blob `7b111f0a`) |

**Lowercase path occurrences in git:** `0` — checked across every tree in every commit (`git rev-list --all`). The uppercase path appears in 28 trees. The lowercase path has never been added, renamed to, or deleted in this repository's history. There is no case-sensitive collision inside git itself.

---

## 12. What This Audit Proves

For the surfaces this audit covers (local checkout and case-sensitive git tree / Linux checkout), the evidence establishes:

- **One uppercase tracked source file** — `content/reference/FREF-0815-MAP.md` is the sole tracked entry in git.
- **No lowercase git-tree entry** — the lowercase path appears in 0 of the 28 trees across all commits and is absent from the index and id-map.
- **One canonical ID and generated route** — frontmatter `id: reference/FREF-0815-MAP` yields the single canonical route `reference/FREF-0815-MAP.html`; sitemap, IR, RAG, and context exports all cite the uppercase canonical only.
- **Local lowercase path lookup resolves the same file on APFS** — on the case-insensitive local checkout, `fref-0815-map.md` and its `.html` route resolve to the same inode as the uppercase file.

## 13. What This Audit Does NOT Prove

Deployed HTTP behavior is outside the scope of this local checkout audit. It does **not** prove:

- that the **lowercase deployed URL aliases the uppercase URL**;
- that **deployed URL behavior follows local filesystem case behavior**;
- that **a lowercase request necessarily returns 404**.

The deployed HTTP server's handling of a lowercase request was not exercised or observed. The absence of a lowercase entry in the sitemap, IR, RAG, and context exports indicates only that no lowercase URL is advertised; it is not a statement about whether the deployed server would or would not serve a lowercased request.

---

## 14. Which File Boris Treats as Canonical

The uppercase file `content/reference/FREF-0815-MAP.md` is canonical. Boris derives the page route and ID from frontmatter (`id: reference/FREF-0815-MAP`, `parent: reference`), and the IR source path preserves the tracked filename casing (`reference/FREF-0815-MAP.md`). The lowercase spelling is neither independently indexed nor canonical — on the local case-insensitive checkout it resolves as an alias of the canonical file.

---

## 15. Validation Executed

All gates ran from the fresh `audit/fref-0815-duplicate` branch with a locally supplied Boris binary:

| Command | Result |
|---|---|
| `./bin/validate_graph.sh` (with local `BORIS_BIN`) | ✅ Passed — form IDs validated (2,265 pages, no files changed); Boris graph diagnostics at documented baseline; Cantilever publication compiled; HTML ID audit 0 duplicates; "Filed build passed". |
| `./scripts/filed-build.sh` (via validate_graph) | ✅ 2,265 pages rendered, Markdown link audit clean |
| `./scripts/filed-publish.sh` | ⚠️ site/IR/RAG/context/sitemap/llms exported; **pre-existing** `llms.txt` UTF-8 decode failure at byte ~329k in this Boris build — unrelated to this pair (single file, no duplicates) |

No link, ID, graph, or publication failure touches either casing of this record.

---

## 16. Classification

**`case-collision artifact, local-checkout only`**

Rationale:
- This is a **false duplicate report caused by local case-insensitive path resolution**, not two repository records. A second file does not exist anywhere (git, index, or disk).
- Not an **exact/metadata-equivalent duplicate** — there is only one tracked file.
- Not **divergent records sharing identity** — there is one record, one blob, one route, one sitemap entry, one id-map entry.
- Not an **intentional alias** — nothing references the lowercase path; it has no provenance.
- The lowercase name is a case-only spelling that the local case-insensitive checkout resolves to the same inode; on a case-sensitive checkout it is simply absent from the tree.
- The classification is explicitly qualified as **local-checkout only**: it makes no claim about deployed URL casing.
- **Not unresolved.**

Neither file is unreachable, shadowed, or independently indexed on the surfaces audited: the uppercase canonical file is fully reachable and indexed; the lowercase spelling is a local virtual alias.

---

## 17. Recommended Smallest Safe Follow-Up (not performed)

No content change is required. The smallest safe follow-up is a **verification-only check**: on a case-sensitive filesystem (or a git-aware scan) confirm `git ls-files content/reference/ | grep -i 'fref-0815'` yields exactly the single uppercase entry and that a full `validate_graph.sh` run stays green — which this report already establishes. Optionally, add a line to the reference-collection naming guidance noting that reference files must be committed in uppercase-ID casing to avoid case-collision ambiguity on case-insensitive developer machines. If conclusive deployed-route behavior is desired, a separate runtime probe against the deployed host would be required; that is out of scope for this local checkout audit. No file deletion, merge, or rename is warranted.