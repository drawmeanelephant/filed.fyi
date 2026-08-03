# Filed + Boris: graph-aware editing workflow

Filed should use Boris as both its publisher and its knowledge-graph boundary.
The graph is most useful when an edit preserves three distinct layers:

1. **Structure** — `parent` establishes the archive collection and navigation.
2. **Meaning** — `relations` records an explicit, author-approved relationship.
3. **Evidence** — the Markdown body preserves the prose, links, comments, and
   provenance that explain why the relationship exists.

## What we verified

The current Filed corpus compiles to 598 pages and 588 structural parent edges.
Before the Genny relationship migration, Boris emitted zero semantic relations.
That means the archive has many visible Markdown links and “related” sections,
but the machine graph cannot use them as typed neighbors or reverse context.

The Genny mascot and its dedicated limerick record are now a representative
pair using Boris’s native bounded syntax:

```text
relations: [relates_to=limericks/lim-genny-compileheart]
relations: [relates_to=mascots/028.genny-compileheart]
```

Only relationships that are explicit in the source should be promoted. An LLM
may suggest candidates, but it must label them as proposals until a human adds
the `relations` field. This keeps inference from becoming canon silently.

## LLM editing loop

For a requested change, give the model the target page, its parent collection,
the Boris context bundle, and the relevant reverse-index/impact output. Ask it
to return:

- the smallest source diff;
- any relationship additions or removals, with evidence from the source;
- unresolved or inferred links separately from canonical edits;
- the exact validation and export commands it ran.

The model should not invent frontmatter keys, use `parent` for semantic links,
or treat ordinary Markdown links as validated graph edges. Boris’s `relations`
vocabulary is intentionally small: `relates_to`, `implements`, `depends_on`,
and `supersedes`.

## Local evidence commands

With a Boris binary available at `./bin/boris` (or by replacing the path), run:

```sh
./bin/boris --input content --out .boris --quiet
./bin/boris --input content --rag-dir rag --quiet
./bin/boris --input content --context-dir context --quiet
./bin/boris check --input content
./bin/boris impact mascots/028.genny-compileheart --input content
```

Inspect `graph.json`, `context/manifest.json`, `context/bundle.md`, and the
page artifacts before asking an LLM to edit. The context manifest provides page
counts, relation counts, source paths, and source hashes, which makes it
possible to say exactly what the model had available.

## Evaluation set

Filed should maintain a small repeatable set of LLM tasks: move a poem into a
collection, repair a leaked comment, add an explicit cross-record relation,
split a record, repair a broken Markdown link, and explain an ambiguous
provenance block. Evaluate each run on:

- graph/build validity;
- resolved-target rate;
- duplicate or orphan creation;
- provenance/comment retention;
- visible hidden-knowledge leakage;
- whether uncertainty stays marked as uncertainty.

## Feedback for Boris

Filed is a useful dogfood case for four follow-ups:

- expose semantic relations in the RAG page metadata and `relations.md`, not
  only in IR/context exports;
- make body-link diagnostics and reverse impact available as an explicitly
  separate reference-link graph, without confusing it with build edges;
- provide a small first-class review/proposal surface for LLM-suggested
  relations before they enter canonical frontmatter;
- document the distinction between structural neighbors, semantic neighbors,
  and ordinary Markdown references in the generated artifacts.

The guiding rule is simple: Boris validates the graph; Filed retains the story;
the LLM proposes changes with evidence and never upgrades uncertainty by
itself.
