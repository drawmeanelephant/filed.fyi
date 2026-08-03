# Filed identity metadata

Filed uses Boris entity IDs as stable graph identities. Collection landing
pages remain trunks such as `reference` and `mascots`; migrated records use the
collection namespace plus a form-based identifier:

```text
reference/FREF-0340-TSAB
mascots/M-0005
lorelog/LLG-0400-CMA-TSP
```

The filename remains the source slug and can continue to carry a readable
record name. It is not the identity. `metadata/id-map.jsonl` preserves the
slug-derived identity that the importer replaced, alongside the canonical ID,
source path, collection, parent, and title.

Run the validator before compiling:

```sh
python3 scripts/filed_ids.py --root content --map metadata/id-map.jsonl
```

The validator rejects duplicate IDs, missing collection trunks, invalid parent
targets, and satellite IDs without a four-digit numeric form segment.
