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

### 📜 `ensure-boris.sh`
* **Purpose**: Performs local-only resolution for the `./bin/boris` compiler binary (`BORIS_BIN`, `./bin/boris` + manifest, or prebuilt/source sibling matching pinned commit). Pass `--provision` or `BORIS_AUTO_PROVISION=1` to permit network downloading of Zig and compiling of Boris. Emits exactly one absolute path on stdout.

### 📜 `clean-binaries.sh`
* **Purpose**: Cleans provisioner-owned compiler artifacts in `bin/` (`bin/boris` and `bin/boris.json`). Pass `--cache` or `--all` to clean provisioner build cache (`.tools/`).

### 📜 `filed-migration-ci.sh`
* **Purpose**: Complete CI verification script used to validate corpus integrity, graph relationships, and build outputs.

---

## 🔍 Validation & Audit Helpers

### 📜 `filed_ids.py`
* **Purpose**: Validates canonical identity assignments, form number schemas, and ID mappings against `metadata/id-policy.json` and `metadata/id-map.jsonl`.
* **Usage**: `python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl`

### 📜 `verse_stage.py`
* **Purpose**: **Pre-render** presentation staging. Rewrites a *staged copy* of the Markdown content tree so Boris itself renders the **Related residue** panel — the appended verse sections (`## Related Aphorisms / Haikus / Limericks`) become one labelled panel (`<h2 id="verse-residue">`, id-free `<h3>` labels, `<h4>` poem titles) with all original heading ids preserved, empty/`Stub:`-only sections dropped, and long collections (and all guide appendices) collapsed behind a native `<details>` element. Because the presentation exists *before* Boris runs, the certified publication bytes are exactly the deployed bytes. Pages without verse are left byte-identical; the real `content/` tree is never touched.
* **Usage**: `python3 scripts/verse_stage.py <staged-content-dir>` (run automatically by `filed-build.sh` on the staged tree before the Boris compile).

### 📜 `test_verse_stage.py`
* **Purpose**: Regression tests for the pre-render verse staging transform over Markdown fixtures in `scripts/testdata/verse-stage/`, covering: no verse, one short verse, all three verse types, large verse collections, stub verse headings with no usable content, guide pages, and anchor preservation.
* **Usage**: `python3 scripts/test_verse_stage.py`

### 📜 `verse_residue.py`
* **Purpose**: **Read-only** post-render verification of the certified verse-residue output. Verifies that no flat verse `<h2 id="related-...">` heading survives (i.e. staging ran before Boris), that the TOC links no verse headings, and that every residue panel is the single labelled panel. It **never writes** to the certified tree.
* **Usage**: `python3 scripts/verse_residue.py dist/cantilever` (run automatically by `filed-build.sh` after the Boris compile and before the HTML ID audit).

### 📜 `test_verse_residue.py`
* **Purpose**: Regression tests for the read-only verse-residue check: post-staging fixtures pass, flat/pre-staging fixtures fail, and the check never writes into the tree.
* **Usage**: `python3 scripts/test_verse_residue.py`

### 📜 `certify_publication.py`
* **Purpose**: **Mandatory publication evidence gate.** Fails the build unless the complete Boris evidence set under `<html-dir>/_boris/proof/` is present (`artifacts.json`, `checks.json`, `claims.json`, `touches.json`, `proof-pack.json`, `index.html`), every check is `passed`/`not-applicable`, every claim is `verified`, the Proof Pack model state is verified with a matching embedded model digest, the presentation contains no `<script>`, and every committed artifact matches the on-disk bytes — so the deployable tree cannot differ from the certified bytes. Strictly read-only.
* **Usage**: `python3 scripts/certify_publication.py dist/cantilever` (run automatically by `filed-build.sh` as the final gate).

### 📜 `test_certify_publication.py`
* **Purpose**: Regression tests for the certification gate over synthetic evidence trees, covering the stale-proof tamper matrix: untouched passes, missing Proof Pack / any evidence file fails, failed check fails, tampered Proof Pack JSON fails digest verification, script-bearing Proof Pack HTML fails, post-certification mutation of certified HTML fails, inventory digest mismatch fails, and the validator never writes into the tree.
* **Usage**: `python3 scripts/test_certify_publication.py`

### 📜 `audit_html_ids.py`
* **Purpose**: Scans compiled HTML output to ensure unique element IDs and valid anchor navigation targets.

### 📜 `audit_markdown_links.py`
* **Purpose**: Scans Markdown content under `content/` to verify internal relative linkages and cross-record citations.
