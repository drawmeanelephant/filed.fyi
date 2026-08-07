# Filed & Forgotten Archive

Filed is a 2,265-page static Markdown archive compiled by [Boris](https://github.com/drawmeanelephant/boris) using the Trunk/Satellite graph model and deployed to Cloudflare Pages at [https://filed.fyi](https://filed.fyi). The corpus includes 11 collection trunks and 2,254 satellite records across mascots, lorelog, reference, posts, guides, releases, changelog, aphorisms, haikus, and limericks.

---

## Production Deployment

* **Source of Record**: `drawmeanelephant/filed.fyi`
* **Compiler**: [Boris](https://github.com/drawmeanelephant/boris) (CI tracks the `afterparty` branch; publishing scripts maintain defensive UTF-8 validation gates)
* **Production Theme**: Cantilever (`themes/cantilever/`)
* **Output Path**: `dist/cantilever/`
* **Host**: Cloudflare Pages
* **Public URL**: [https://filed.fyi](https://filed.fyi)

---

## Quick Start & Operating Commands

Ensure the Boris compiler binary is provisioned locally (`./scripts/ensure-boris.sh` performs local-only resolution across `BORIS_BIN`, existing `./bin/boris`, or compatible sibling repo at pinned commit; use `--provision` or `BORIS_AUTO_PROVISION=1` to permit network downloading and building):

```sh
./scripts/ensure-boris.sh --provision
```

Build the primary site and serve it locally:

```sh
./preview.sh
```

The default output is written to `dist/cantilever/` and the server listens on `http://localhost:8000`.

Run the complete local validation gate:

```sh
./bin/validate_graph.sh
```

If the environment lacks a default compiler binary location, supply one explicitly via `BORIS_BIN`:

```sh
BORIS_BIN=/path/to/boris ./bin/validate_graph.sh
```

Primary build and publishing scripts:

* `./scripts/ensure-boris.sh`: Performs local-only resolution of `./bin/boris` (pass `--provision` or `BORIS_AUTO_PROVISION=1` to allow network downloading and building).
* `./scripts/clean-binaries.sh`: Cleans unneeded/stale compiler binary artifacts in `bin/`.
* `./scripts/filed-build.sh`: Runs the production HTML build.
* `./scripts/filed-publish.sh`: Exports HTML, IR, RAG, Context, sitemap, and `llms.txt` artifacts.

---

## Repository Layout

```text
content/                    # Source Markdown corpus
themes/cantilever/         # Primary production theme and templates
scripts/ensure-boris.sh    # Automated Boris compiler binary provisioning
scripts/clean-binaries.sh  # Clean compiler binaries in bin/
scripts/filed-build.sh     # Production HTML build script
scripts/filed-publish.sh   # HTML, IR, RAG, Context, and llms publishing script
bin/validate_graph.sh      # Graph integrity and publication gate
```

Generated outputs under `dist/`, `publish/`, `site/`, and local compiler binaries (`bin/boris*`) are build artifacts and must not be committed to git.

---

## Identity Model

Boris `id` values are stable graph identities. By default, Boris derives the canonical document identity directly from the source path under `content/` (e.g. `changelog/2026-08-07-docket-convention`). An explicit `id:` override in frontmatter remains available when a stable identity independent of the source path is desired (e.g. `mascots/M-0005`, `reference/FREF-0340-TSAB`).

Record IDs represent permanent identities and must not be casually renamed, renumbered, or reused.

Structural parents specify collection trunks (`parent`). Semantic relationships are declared via Boris `relations` and target canonical IDs. Boris validates document identity uniqueness and graph topology directly during `boris check`. No central registry, sidecar file, or script allocation scheme participates in validation or build pipelines.

---

## Publishing Exports

The publishing routine writes HTML, IR, RAG, Context, sitemap, and `llms.txt` artifacts under `publish/`:

```sh
./scripts/filed-publish.sh
```

Review `publish/README.txt` before uploading source-derived RAG or Context artifacts. Publication scripts perform defensive UTF-8 validation checks on `llms.txt` exports to ensure release artifact safety.

---

## Continuous Integration

`.github/workflows/ci.yml` checks out this repository, builds Boris from the `afterparty` branch of [drawmeanelephant/boris](https://github.com/drawmeanelephant/boris), validates form-ID policy and graph diagnostics via `./bin/validate_graph.sh`, compiles the Cantilever site, and uploads the generated site as a workflow artifact.
