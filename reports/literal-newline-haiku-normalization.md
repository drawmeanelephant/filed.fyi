# Literal-`\n` Haiku Normalization — Migration Residue Repair

**Branch:** `fix/normalize-literal-newline-haikus`
**Starting commit:** `a361784abc861cb52eeed15d0c816c3bdf109e47` (current `origin/main`)
**Tool:** `scripts/normalize_literal_newline_haikus.py`
**Tests:** `scripts/test_normalize_literal_newline_haikus.py`
**Content-audit tool:** `boris-content-audit` (`drawmeanelephant/boris` `afterparty`, per the
content-audit-policy qualification), run against both trees with the committed
policy from `metadata/content-audit-policy/policy.json`.

---

## 1. Defect and classification rule

Authored haiku verse was serialized with the literal two-character sequence
backslash+n (`\n`) standing in for physical Markdown line breaks. A literal
`\n` is repaired **only when all** of the following hold:

1. it is a single backslash followed by `n` (a negative lookbehind rejects
   the double escape `\\n`, which is intentional text about escapes);
2. it is outside the frontmatter block;
3. it is outside a fenced code block (` ``` ` / `~~~`) and outside a Boris
   native note/quote container (`::: ... :::`);
4. its enclosing Markdown section is a haiku verse section — the nearest
   heading above it matches `Haikus`, `Haikus {#…}`, or `Related Haikus`
   (level 2+).

Anything failing the rule is **refused** (reported, never guessed); a single
refused occurrence aborts `--apply` before any file is written. The default
mode is read-only `--check` (exit 1 while defects remain). Repair replaces
each proven literal `\n` with exactly one real newline and nothing else, so a
second apply changes zero bytes.

No search-and-replace was performed across the repository: classification is
per-occurrence, per-section.

## 2. Affected population (recomputed from `main`)

| Metric | Before | After |
|---|---:|---:|
| Files with the defect (haikus collection) | 179 | 0 |
| Literal `\n` occurrences (haikus collection) | 1798 | 0 |
| Files with the same defect (mascots Haiku Log) | 166 | 0 |
| Literal `\n` occurrences (mascots) | 1774 | 0 |
| Files with the same defect (reference Related Haikus) | 19 | 0 |
| Literal `\n` occurrences (reference) | 304 | 0 |
| **Total files changed** | — | **364** (179 + 166 + 19) |

The prior qualification estimate (≈179 files, 766 malformed units) is
confirmed exactly by the current `main` content audit: 179 haiku records, 766
malformed haiku verse units.

### Same-defect expansion beyond the haikus collection (reported, proven)

The identical representation defect — same verse text, same literal-`\n`
representation — exists in **haiku verse embedded in mascot records**
(`## Haikus` sections of the Haiku Log) and **reference records** (`## Related
Haikus` sections). Every occurrence (1774 in mascots, 304 in reference) sits
under a Haikus heading; zero occurrences exist in limerick sections, prose, or
code. The content audit confirms the same surface as `malformed coverage`
(154 mascots). These were repaired under the same classification rule and are
reported explicitly rather than expanding scope silently. Limerick verse
(46 malformed units, out of scope) and aphorisms were **not** touched.

## 3. Historical evidence used

Pre-migration source bytes for the same canonical records were recovered from
repository history (`8e7db007^`, the commit before the Boris migration):

- `src/content/haikus/hai-246-thankyou-ash.mdx` — each verse wrapped in
  `<Limerick type="note">…</Limerick>`; the three verse lines are the same
  text as the migrated file, joined by the same literal `\n` (the defect
  predates the Boris migration as an Astro-era representation artifact).
- `src/content/haikus/hai-fref-0030-avsg.mdx` — the first three verse
  components are serialized as one escaped run (`\nDocument the truth  \nThe
  manual stands unchanged  \nQuiet policy\n`), matching the migrated block.

This proves the intended line structure — each literal `\n` is a verse line
boundary and verse lines keep their text verbatim. No verse was rewritten;
only the representation changed. The tool itself relies purely on the
structural rule (§1); it never consults history, and unprovable cases fail
closed (covered by tests).

## 4. Content-audit before/after (semantic proof)

`boris-content-audit --mode=poetry` with the committed policy, same binary and
policy on both trees:

| Metric | Before | After | Delta |
|---|---:|---:|---:|
| Haiku verse units | 2755 | 3559 | **+804** |
| Haiku substantive units | 2755 | 3559 | **+804** |
| Haiku malformed units | **766** | **0** | **−766** |
| Haiku placeholder units | 0 | 0 | 0 |
| Haiku records | 563 | 563 | 0 |
| Coverage malformed (overall) | 154 | 0 | **−154** |
| Coverage substantive (overall) | 658 | 812 | +154 |
| Coverage malformed (mascots/haiku) | 154 | 0 | **−154** |
| Coverage substantive (mascots/haiku) | 77 | 231 | +154 |
| Limerick malformed units | 46 | 46 | 0 (out of scope) |
| Aphorism malformed units | 0 | 0 | 0 |
| Records discovered / poetry / mapped / orphan | 2265 / 1688 / 853 / 835 | unchanged | 0 |

The +804 substantive haiku units equal the 766 repaired malformed units plus
38 verses recovered from the 19 escaped-run blocks (each counted as one
malformed unit but containing three verses), i.e. 766 + (2 × 19) = 804.
Every remaining malformed haiku count is zero; limerick malformed residue
(46) is intentionally untouched and is not claimed as fixed.

## 5. Content hash accounting

SHA-256 of every file under `content/` before and after:

- files before: 2265 · files after: 2265 (0 missing, 0 added)
- **changed files: 364** — exactly the predicted affected set
- **unexpected changed files: 0**

Per-file diffs were audited on samples across all three shapes (standard
2-escape verse, 3-escape verse with trailing escape, escaped-run block) and
consist only of literal-`\n` → real-newline representation normalization:
no prose, title, placeholder, tag, or relationship changes.

## 6. Regression tests

`python3 scripts/test_normalize_literal_newline_haikus.py` (all pass):

- one affected haiku repaired; multiple literal escapes in one verse repaired
- legitimate prose mentioning `\n` refused, never guessed; double escape
  `\\n` never touched
- fenced code and `:::` note containers with `\n` left untouched
- already-correct physical-line haiku left byte-identical
- ambiguous case refused/reported; nothing written
- second apply is a byte-identical no-op; `--scope=haikus` restricts scope

## 7. Validation results

| Gate | Result |
|---|---|
| `./bin/validate_graph.sh` (form IDs, Boris check, Cantilever build, verse residue, HTML IDs) | ✅ passed — 2265 pages, 0 duplicate HTML IDs |
| `python3 scripts/audit_markdown_links.py content` | ✅ all local Markdown links resolve |
| `python3 scripts/test_tag_roundtrip.py` | ✅ PASS |
| `python3 scripts/test_relationship_repair.py` | ✅ PASS |
| `python3 scripts/test_ensure_boris.py` | ✅ 13 tests OK |
| `python3 scripts/test_verse_residue.py` | ✅ PASS |
| `./scripts/filed-publish.sh` | ✅ relationship integrity PASS, recovery check/verify PASS, llms.txt exported |

No CI, deployment, or publication scripts were modified. Boris source, Proof
Pack validation, audit-policy generation, relationship mappings, placeholder
residue, and limerick defects were not touched.
