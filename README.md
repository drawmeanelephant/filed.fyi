# Filed & Forgotten Archive

Filed is a 2,265-page Markdown archive compiled by Boris into a deterministic
static site and machine-readable publication artifacts. The imported corpus has
11 collection trunks and 2,254 satellite records across mascots, lorelog,
reference, posts, guides, releases, changelog, aphorisms, haikus, and
limericks.

## Quick start

Build the primary site and serve it locally:

```sh
./preview.sh
```

The default output is `dist/cantilever/` and the server listens on
`http://localhost:8000`. Use `BORIS_JOBS=1` on smaller machines; the build
defaults to one worker for predictable memory use.

Run the complete local gate:

```sh
./bin/validate_graph.sh
```

If the repository does not have a local compiler binary, build Boris Afterparty
or provide one explicitly:

```sh
BORIS_BIN=/path/to/boris ./bin/validate_graph.sh
```

## Repository layout

```text
content/                    # Imported Markdown corpus
themes/cantilever/         # Primary Filed layout and assets
themes/{corp-vendor,...}/  # Retained legacy theme options
metadata/id-policy.json    # Canonical identity rules
metadata/id-map.jsonl      # Legacy-to-canonical migration map
scripts/filed_ids.py       # ID migration and validation
scripts/filed-build.sh     # Primary HTML build
scripts/filed-publish.sh   # HTML, IR, RAG, Context, and llms exports
bin/validate_graph.sh      # CI/local graph and publication gate
```

Generated output under `dist/`, `publish/`, `site/`, and the local Boris binary
are ignored. CI builds Boris from a pinned commit rather than treating a
machine-specific executable as source.

## Identity model

Boris `id` values are stable graph identities, not slugs. Collection trunks keep
simple IDs such as `mascots` and `reference`. Satellite records use the
collection namespace plus the existing Filed form system:

```text
mascots/M-0005
reference/FREF-0340-TSAB
lorelog/LLG-0400-CMA-TSP
aphorisms/APH-0003
```

The numeric portion is normalized to at least four digits. Existing form codes
are preserved where possible; missing codes receive the next unused collection
number. IDs are never silently renumbered or reused. The original
slug-derived identity is retained in `metadata/id-map.jsonl`.

Structural parents remain collection trunks. Semantic relationships are a
separate Boris `relations` field and must target canonical IDs; inline display
does not change a record's structural parent.

Validate the identity layer directly with:

```sh
python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl
```

## Publishing exports

The publishing routine writes HTML, IR, RAG, Context, and (when supported by the
compiler) `llms.txt` under ignored `publish/` output:

```sh
./scripts/filed-publish.sh
```

Review `publish/README.txt` before uploading source-derived RAG or Context
artifacts. They may contain archived material and are not automatically public
safe.

The current pinned Afterparty compiler still has a known UTF-8 truncation bug in
its `llms.txt` emitter. The publish script fails closed when that output is
invalid instead of treating it as a usable export; RAG and Context remain
separate UTF-8-validated projections.

## Boris Afterparty

To build the active Boris worktree and record the compiler provenance:

```sh
./scripts/build-boris-afterparty.sh
```

Override `BORIS_ROOT`, `BORIS_BRANCH`, `SPLIT_SIZE`, or `BORIS_JOBS` when the
local Boris checkout differs. The default branch is `afterparty`.

## CI

`.github/workflows/ci.yml` checks out this repository, builds Boris from its
pinned Afterparty commit, validates the form-ID policy and graph diagnostics,
compiles the Cantilever site, and uploads the generated site as a workflow
artifact. The source checkout remains the product of record; generated output
is not committed.
