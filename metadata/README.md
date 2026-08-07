# Filed identity metadata

Filed uses Boris entity IDs as stable graph identities. By default, Boris derives identity directly from source paths under `content/` (e.g. `changelog/2026-08-07-docket-convention`). An explicit `id:` override in frontmatter remains available when a stable identity independent of the source path is desired (e.g. `mascots/M-0005`, `reference/FREF-0340-TSAB`).

Validate the graph directly with:

```sh
./bin/validate_graph.sh
```

Boris validates document identity uniqueness, missing collection trunks, invalid parent targets, and graph topology directly during `boris check`.
