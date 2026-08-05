# Filed & Forgotten Utility Scripts

This directory contains the Python, Shell, and automation scripts used to build, validate, audit, and publish the **filed.fyi** archive compiled with **Boris**.

---

## 🛠️ Build & Publication Pipeline Scripts

### 📜 `filed-build.sh`
* **Purpose**: Primary site build script. Compiles `content/` using Boris and the `themes/cantilever/` production theme into `dist/cantilever/`.

### 📜 `filed-publish.sh`
* **Purpose**: Generates publishing artifacts under `publish/`, including HTML, Intermediate Representation (IR), RAG data, Context projections, sitemap, and `llms.txt`.
* **Safety Gate**: Performs defensive UTF-8 validation on generated `llms.txt` exports before allowing release artifacts.

### 📜 `cloudflare-build.sh`
* **Purpose**: Build script executed by Cloudflare Pages CI/CD pipeline.

### 📜 `build-boris-afterparty.sh`
* **Purpose**: Fetches and builds the active Boris compiler from the `afterparty` branch of [drawmeanelephant/boris](https://github.com/drawmeanelephant/boris).

### 📜 `filed-migration-ci.sh`
* **Purpose**: Complete CI verification script used to validate corpus integrity, graph relationships, and build outputs.

---

## 🔍 Validation & Audit Helpers

### 📜 `filed_ids.py`
* **Purpose**: Validates canonical identity assignments, form number schemas, and ID mappings against `metadata/id-policy.json` and `metadata/id-map.jsonl`.
* **Usage**: `python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl`

### 📜 `verse_residue.py`
* **Purpose**: Build-time presentation post-processor. Groups the appended verse sections (`## Related Aphorisms / Haikus / Limericks`) of each record into one labelled **Related residue** panel, re-levels their headings (one `h2`, `h3` labels, `h4` poem titles) so repeated headings no longer break the outline, drops empty or `Stub:`-only verse sections, and collapses long collections (and all guide appendices) behind a native `<details>` element. Pages without verse are left byte-identical; Markdown source is never touched.
* **Usage**: `python3 scripts/verse_residue.py dist/cantilever --check` (run automatically by `filed-build.sh` after the Boris compile and before the HTML ID audit).

### 📜 `test_verse_residue.py`
* **Purpose**: Regression tests for the verse-residue transform over fixture pages in `scripts/testdata/verse-residue/`, covering: no verse, one short verse, all three verse types, large verse collections, stub verse headings with no usable content, guide pages, TOC pruning, and anchor preservation.
* **Usage**: `python3 scripts/test_verse_residue.py`

### 📜 `audit_html_ids.py`
* **Purpose**: Scans compiled HTML output to ensure unique element IDs and valid anchor navigation targets.

### 📜 `audit_markdown_links.py`
* **Purpose**: Scans Markdown content under `content/` to verify internal relative linkages and cross-record citations.
