# Presentation QA handoff checks

`scripts/check_presentation_qa.py` checks one explicit workload. It reads Git
objects and local JSON inputs, prints a report, and never rewrites source,
updates the index, fetches, or chooses backlog work. It is not a registry,
compiler schema, formatter, proof of reading, or editorial approval.

The maintainer must approve this check before pilot release. The
[baseline](presentation-qa-baseline.md), independent review, rendered review,
`./bin/validate_graph.sh`, and successful `validate`, `publish-export`, and
aggregate `ci` checks still apply.

## Inputs

Keep these handoff inputs outside the committed archive, for example in
`.inbox/`. The coordinator supplies the exact assigned paths and agreed
base/head commits. Use full lowercase commit IDs, not branch names, abbreviated
IDs, tags, or Git revision expressions. The base must be an ancestor of head;
base equals head is valid for a no-change review. Compare the agreed two commits,
not a merge-base chosen implicitly by a tool.

`assignment.json`:

```json
{
  "base": "<full agreed base commit ID>",
  "head": "<full agreed head commit ID>",
  "paths": ["content/reference/forms/exact-assigned-record.md"],
  "maintenance_docket": null
}
```

Set `maintenance_docket` only to this PR's exact new
`content/changelog/YYYY-MM-DD-task-slug.md` path. It allows that addition and
only an accurate `Count:` change in `content/changelog.md`. It does not allow
old docket edits, other additions, or activity dockets for no-change reviews.
Assigned records must exist at both commits. Renames, deletions, additions,
mode changes, and every unassigned change are findings. Paths are literal and
case-sensitive, including nested and irregular names, not shell globs.

`evidence.json` has one row for every assigned path, including unchanged files:

```json
{
  "files": [{
    "file": "content/reference/forms/exact-assigned-record.md",
    "read_in_full": true,
    "disposition": "reviewed unchanged",
    "observation": "<concrete detail from this record>",
    "line_anchor": "content/reference/forms/exact-assigned-record.md:12-14",
    "decision": "<record-specific formatting decision and reason>",
    "review_evidence": "<PR/reviewer link or no-change review evidence>"
  }],
  "totals": {"reviewed": 1, "changed": 0, "unchanged": 1, "needs_decision": 0}
}
```

The other dispositions are `changed` and `needs decision`. `reviewed` counts
rows claiming a full read; the three disposition totals count all assigned
rows. Blocked reading must be false, with a concrete reason, and stays non-green.
Anchors address real lines in the head version. Duplicate/extra/missing rows,
empty evidence, contradictory dispositions, and incorrect totals cannot pass.
The checker cannot judge whether an observation is truthful, specific enough,
or independently reviewed. A reviewer must challenge generic claims and verify
the coordinator's assignment and agreed commits.

## Commands

From the checkout root, replace the quoted placeholders with those agreed IDs:

```sh
python3 scripts/check_presentation_qa.py \
  --base '<full agreed base commit ID>' --head '<full agreed head commit ID>' \
  --assignment /absolute/path/to/assignment.json \
  --evidence /absolute/path/to/evidence.json --json
python3 scripts/test_presentation_qa.py
./bin/validate_graph.sh
```

Use `--repo /absolute/path/to/checkout` when comparing another checkout.
Stdout can be saved as handoff evidence. Exit 0 means structural PASS only;
1 means preservation/scope/evidence findings, including `human_review`;
2 means invalid inputs, missing Git history, malformed source, or an environment
error. There is no ignore, repair, or normalization flag. Resolve or obtain a
narrow maintainer decision on findings; never call them a pass.

## Conservative limits and CI

The automatic safe subset is inserting balanced, separate `*word phrases*` or
`**word phrases**` into otherwise plain lines, at most one new bold pivot.
Non-delimiter bytes, their order, line endings, indentation, hard breaks, and
frontmatter stay exact. Existing asterisks, nested/unbalanced emphasis, code,
links, tables, headings/anchors, lists, quotes, escapes, components, and other
complex syntax in an edited paragraph need human review or produce an error
for a definite byte change. Lazy block continuation is protected conservatively;
records containing HTML/components need human review for any formatting edit.
Unchanged protected material is left alone.

Paragraph/spacing or stanza/line-count changes are not automatically certified,
even where the baseline permits a justified layout decision. More than one
record above the approximate line/word caps is a coordinator finding; an
oversized single record still requires full reading. These conservative checks
are not a Markdown parser, Boris rendering, a semantic equivalence proof, or
a judgment that added emphasis is warranted.

CI runs the isolated adversarial regression suite in the existing `validate`
job. The actual workload check is a handoff command using its coordinator's
explicit inputs; it is not run as a repository-wide content sweep or inferred
from every PR. This tooling PR is not itself a presentation workload. No
assignment is fabricated to make it pass. Future workload CI wiring must keep
those explicit inputs and the existing Boris gates.
