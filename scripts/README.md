# Filed & Forgotten Utility Scripts

This directory contains the Python, Shell, and automation scripts used to build, validate, audit, and publish the **filed.fyi** archive compiled with **Boris**.

---

## 🛠️ Build & Publication Pipeline Scripts

### 📜 `filed-build.sh`
* **Purpose**: Primary site build pipeline. Executes pre-render verse staging (`verse_stage.py`), compiles `content/` with Boris using the Cantilever production theme into `dist/cantilever/`, verifies post-render verse residue (`verse_residue.py`), audits HTML IDs (`audit_html_ids.py`), and executes the mandatory publication certification gate (`certify_publication.py`).
* **Usage**: `./scripts/filed-build.sh`

### 📜 `filed-publish.sh`
* **Purpose**: Generates publication artifacts under `publish/`, including HTML site, Intermediate Representation (IR), RAG data, AI Context projections, sitemap, and `llms.txt`. Runs relationship recovery and validation checks before release.
* **Usage**: `./scripts/filed-publish.sh`

### 📜 `cloudflare-build.sh`
* **Purpose**: CI/CD build script executed during Cloudflare Pages deployment. Provisions Boris and runs the production build pipeline.
* **Usage**: `./scripts/cloudflare-build.sh`

### 📜 `ensure-boris.sh`
* **Purpose**: Performs local-only resolution for the `./bin/boris` compiler binary (`BORIS_BIN`, `./bin/boris` + manifest, or prebuilt/source sibling matching pinned commit). Pass `--provision` or `BORIS_AUTO_PROVISION=1` to permit network downloading of Zig and compiling of Boris. Emits exactly one absolute path on stdout.
* **Usage**: `./scripts/ensure-boris.sh --provision`

### 📜 `clean-binaries.sh`
* **Purpose**: Cleans provisioner-owned compiler artifacts in `bin/` (`bin/boris` and `bin/boris.json`). Pass `--cache` or `--all` to clean provisioner build cache (`.tools/`).
* **Usage**: `./scripts/clean-binaries.sh --all`

### 📜 `build-boris-afterparty.sh`
* **Purpose**: Fetches and builds the active Boris compiler from the `afterparty` branch of [drawmeanelephant/boris](https://github.com/drawmeanelephant/boris).
* **Usage**: `./scripts/build-boris-afterparty.sh`

### 📜 `filed-migration-ci.sh`
* **Purpose**: Complete CI verification script used to validate corpus integrity, graph relationships, and build outputs.
* **Usage**: `./scripts/filed-migration-ci.sh`

---

## 🔍 Graph, ID & Content Audit Helpers

### 📜 `filed_ids.py`
* **Purpose**: Validates canonical identity assignments, form number schemas, and ID mappings against `metadata/id-policy.json` and `metadata/id-map.jsonl`.
* **Usage**: `python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl`

### 📜 `build_content_audit_policy.py`
* **Purpose**: Audits poetry ownership relationships, cross-references, and content categories against the corpus metadata policy under `metadata/content-audit-policy/`.
* **Usage**: `python3 scripts/build_content_audit_policy.py --check`

### 📜 `normalize_literal_newline_haikus.py`
* **Purpose**: Idempotent syntax normalizer for literal escaped `\n` characters in haikus/limericks verse blocks, converting literal escapes into physical line breaks while preserving frontmatter and prose.
* **Usage**: `python3 scripts/normalize_literal_newline_haikus.py --check`

### 📜 `fix_tag_truncation.py`
* **Purpose**: Detects and repairs truncated tag strings in frontmatter blocks across `content/`.
* **Usage**: `python3 scripts/fix_tag_truncation.py --apply`

### 📜 `audit_html_ids.py`
* **Purpose**: Scans compiled HTML output to ensure unique element IDs and valid anchor navigation targets.
* **Usage**: `python3 scripts/audit_html_ids.py dist/cantilever`

### 📜 `audit_markdown_links.py`
* **Purpose**: Scans Markdown content under `content/` to verify internal relative linkages and cross-record citations.
* **Usage**: `python3 scripts/audit_markdown_links.py content`

---

## 🛡️ Presentation & Certification Gates

### 📜 `verse_stage.py`
* **Purpose**: **Pre-render** presentation staging. Rewrites a *staged copy* of the Markdown content tree so Boris itself renders the **Related residue** panel — the appended verse sections (`## Related Aphorisms / Haikus / Limericks`) become one labelled panel (`<h2 id="verse-residue">`, id-free `<h3>` labels, `<h4>` poem titles) with all original heading ids preserved, empty/`Stub:`-only sections dropped, and long collections collapsed behind a native `<details>` element. Run automatically by `filed-build.sh` before the Boris compile.
* **Usage**: `python3 scripts/verse_stage.py <staged-content-dir>`

### 📜 `verse_residue.py`
* **Purpose**: **Read-only** post-render verification of certified verse-residue output. Verifies that no flat verse `<h2 id="related-...">` heading survives (i.e. staging ran before Boris) and that TOC links stay clean.
* **Usage**: `python3 scripts/verse_residue.py dist/cantilever`

### 📜 `certify_publication.py`
* **Purpose**: **Mandatory publication evidence gate.** Fails the build unless the complete Boris evidence set under `<html-dir>/_boris/proof/` is present (`artifacts.json`, `checks.json`, `claims.json`, `touches.json`, `proof-pack.json`, `index.html`), every check is `passed`/`not-applicable`, every claim is `verified`, embedded model digests match, the presentation contains no `<script>`, and every committed artifact matches on-disk bytes.
* **Usage**: `python3 scripts/certify_publication.py dist/cantilever`

---

## 🔗 Relationship Recovery & Validation

### 📜 `recover_relationships.py`
* **Purpose**: Manifest-driven relationship recovery tool that maps pre-migration relationships to canonical target IDs using `metadata/relationship-map.jsonl`.
* **Usage**: `python3 scripts/recover_relationships.py --check`

### 📜 `repair_relationships.py`
* **Purpose**: Rebuilds explicit `relations` fields from source Markdown in RAG and Context output directories when Boris exports structural adjacency into `related` blocks.
* **Usage**: `python3 scripts/repair_relationships.py --content content --rag-dir publish/rag`

### 📜 `validate_relationships.py`
* **Purpose**: Validates relationship integrity across `content/`, `rag/`, and `context/` export directories and generates diagnostic integrity reports.
* **Usage**: `python3 scripts/validate_relationships.py --content content --rag-dir publish/rag --context-dir publish/context`

---

## 🧪 Unit & Regression Test Suites

Run test suites individually to verify pipeline components:

* `python3 scripts/test_certify_publication.py` — Tests stale-proof tamper matrix and certification gate invariants.
* `python3 scripts/test_content_audit_policy.py` — Tests poetry ownership mapping and content audit policy verification.
* `python3 scripts/test_ensure_boris.py` — Tests Boris binary resolution and checksum validation.
* `python3 scripts/test_normalize_literal_newline_haikus.py` — Tests literal `\n` normalization safety and idempotency.
* `python3 scripts/test_relationship_repair.py` — Tests relationship repair and export parity.
* `python3 scripts/test_tag_roundtrip.py` — Tests tag parsing and round-trip preservation.
* `python3 scripts/test_verse_residue.py` — Tests post-render verse residue verification.
* `python3 scripts/test_verse_stage.py` — Tests pre-render Markdown verse staging transforms.
