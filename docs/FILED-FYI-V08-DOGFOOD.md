# Filed.fyi v0.8 dogfood report

> Historical evidence from the pre-2026-08-02 migration-lab phase. It is not
> the current Filed corpus or CI gate; see the repository README and
> `metadata/migration.json` for the current handoff baseline.

Bounded migration evidence for the Filed.fyi Boris target. This is not a
full-site migration and does not modify the Filed.fyi source, Boris core, or
the target's production content.

## Pins and scope

| Item | Value |
|---|---|
| Filed.fyi source | `drawmeanelephant/filed.fyi` @ `be386dd` |
| Boris migration lab | `drawmeanelephant/boris` @ `f14ac7a` |
| Boris target inspected | `drawmeanelephant/filed.boris` @ `19598df` |
| Lab | `boris-starlight-migration-lab` 0.3.1, schema 1 |
| Slice input | 5 MDX pages + 1 source image |
| Migration mode | root-locale Starlight, `--max-pages=20` |

The target clone currently contains 574 Markdown files. Its README says 566
entities, so that number is treated as stale narrative, not as migration
evidence.

## Representative slice

| Source | Why it is in the slice | Outcome |
|---|---|---|
| `src/content/docs/index.mdx` | archive landing and cross-collection routes | converted body; `/haikus` and `/limericks` remain review links |
| `src/content/docs/lorelog/LLG-0322-FTD.mdx` | custom metadata, `relatedHaiku`, `relatedLimerick`, related-entry objects | body preserved; 24 frontmatter fields require review |
| `src/content/docs/mascots/046.svgon-the-line.mdx` | nested collection, related entry, source-global image | body preserved; image is a real `EASSET` blocker |
| `src/content/docs/reference/directives/tri-directive-doctrine.mdx` | nested path and deep-path flattening | converted under `reference`; deep path is review-only |
| `src/content/docs/reference/fref-0050-avoc.mdx` | custom frontmatter plus `Broside`/`Limerick` components | body preserved; components and 11 fields require review |
| `src/assets/svgon-the-line.png` | asset provenance check | inventory-only; not copied automatically |

The lab emitted 5 converted source pages plus 3 synthetic section trunks:
`lorelog`, `mascots`, and `reference`. This exercises a one-level
Trunk/Satellite forest without inventing source parent metadata.

## Before / after counts

| Measure | Before | After | Interpretation |
|---|---:|---:|---|
| Full Filed docs tree | 560 MDX docs | not migrated | inventory context only |
| Full Filed content tree | 2,248 MDX files | not migrated | explicitly out of scope |
| Selected source pages | 5 | 5 converted | converted |
| Synthetic trunks | 0 | 3 | inferred by path, review-visible |
| Emitted pages | 5 | 8 | output page count |
| Boundary rows | — | 5 preserved / 0 stripped / 74 manual-review | preserved means body retained, not semantic parity |
| Relationship candidates | 10 | 1 resolved / 4 unresolved / 9 review-only | no product relation emitted |
| Local image references | 1 | 1 unresolved | source-global path escapes migration root |
| Boris raw compile | — | exit 1 (`EASSET`) | expected blocker, not papered over |
| Boris compile after manual asset placement | — | exit 0 | separate manual-intervention proof only |

The relationship counts overlap by design: `resolved` is a subset of the 10
candidate rows, while `review-only` includes fields that have no safe relation
kind. `relatedHaiku` and `relatedLimerick` were retained as
`non_scalar_or_ambiguous_object`; the lab does not guess their target shape.

## Commands

From a fresh Boris clone, after building the product and lab:

```sh
ZIG_GLOBAL_CACHE_DIR=/private/tmp/zig-cache-boris zig build
ZIG_GLOBAL_CACHE_DIR=/private/tmp/zig-cache-boris zig build test
ZIG_GLOBAL_CACHE_DIR=/private/tmp/zig-cache-lab zig build \
  --build-file tools/migration-lab/build.zig
ZIG_GLOBAL_CACHE_DIR=/private/tmp/zig-cache-lab zig build test \
  --build-file tools/migration-lab/build.zig

tools/migration-lab/zig-out/bin/boris-migration-lab \
  --mode=starlight \
  --root=/private/tmp/filed-fyi-v08-slice-src \
  --out=/private/tmp/filed-fyi-v08-run-a \
  --locale=en --max-pages=20 --boris=zig-out/bin/boris

tools/migration-lab/zig-out/bin/boris-migration-lab \
  --mode=starlight \
  --root=/private/tmp/filed-fyi-v08-slice-src \
  --out=/private/tmp/filed-fyi-v08-run-b \
  --locale=en --max-pages=20 --boris=zig-out/bin/boris

diff -rq --exclude=compile_report.json \
  /private/tmp/filed-fyi-v08-run-a /private/tmp/filed-fyi-v08-run-b

/private/tmp/boris-dogfood/zig-out/bin/boris \
  --input /private/tmp/filed-fyi-v08-run-a/content \
  --html-dir test-output/filed-fyi-v08-raw-html \
  --html-layout layouts/main.html
```

Observed results: Boris and migration-lab tests passed with isolated caches;
the raw migration compile exits 1 with `EASSET` on
`../../../assets/svgon-the-line.png`; a temporary manual placement of that
image under `046.svgon-the-line.assets/` compiles exit 0. The two migration
outputs are identical except for the expected absolute run-directory in
`compile_report.json`.

## Determinism and source immutability

- The selected source files were SHA-256 recorded before the run.
- Recomputed hashes after both runs were identical.
- The production source clone remained clean (`git status --short` empty).
- The lab wrote only under `--out`; it did not execute Node/Astro/MDX or fetch
  assets.
- The only non-identical repeated-run field is the output directory embedded in
  the compile command; all other reports and converted content compare equal.

## Classification

- **Converted:** title/id/path-derived parent/status/tags surface, Markdown
  bodies, and synthetic section trunks.
- **Preserved:** source body text and raw frontmatter provenance.
- **Normalized:** route/entity paths and one-level parent assignment derived
  from directories; this is not a claim that source parent semantics existed.
- **Manual review:** all unsupported frontmatter, MDX components, relationship
  objects, missing collection targets, deep-path flattening, archive routes,
  and the source-global asset.

The current Filed-specific adapter remains narrower than this slice: it only
converts the observed `changelog` and `releases` collections. The Starlight
lab is therefore the honest workflow for this source-shaped proof.
