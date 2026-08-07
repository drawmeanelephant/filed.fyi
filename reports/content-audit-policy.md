# Content Audit Policy — Reviewed Poetry Ownership Mapping

**Status:** READY FOR REVIEW (observation only; not wired into CI)
**Generator:** `scripts/build_content_audit_policy.py`
**Policy inputs:** `metadata/content-audit-policy/population.json` + `categories.json`
**Generated policy:** `metadata/content-audit-policy/policy.json` (Boris schema v1)
**Derivation record:** `metadata/content-audit-policy/summary.json`
**Boris tool:** `boris-content-audit` at `drawmeanelephant/boris` `afterparty` `bbaaabe` (includes PRs #307, #308, #310)
**Starting commit:** `a361784abc861cb52eeed15d0c816c3bdf109e47`

This note answers one question: **can Filed deterministically derive a
trustworthy Boris poetry-audit ownership policy from its committed canonical
relationship evidence?** It does not wire the audit into CI, does not normalize
content, and does not modify Boris.

---

## Relationship category classification

Every category in `metadata/relationship-map.jsonl` is classified in
`metadata/content-audit-policy/categories.json` (the committed taxonomy, not
code). Buckets: accepted ownership evidence · semantic but not ownership ·
structural · ambiguous/requires review · irrelevant.

| category | declared | resolved | bucket | why |
|---|---|---|---|---|
| `mascotRef` | 640 | 619 | **accepted** | A poetry record declares the mascot it is about; the resolved target is the owning mascot. Strongest directional ownership signal. |
| `relatedMascots` | 650 | 629 | **accepted** | A poetry record lists the mascots its verse belongs to; same ownership semantics as `mascotRef`. |
| `relatedHaiku` | 158 | 158 | **accepted** | A source record (lorelog) declares a haiku that belongs to it. |
| `relatedLimerick` | 155 | 155 | **accepted** | A source record (lorelog) declares a limerick that belongs to it. |
| `relatedEntries` | 1058 | 1041 | semantic-not-ownership | Generic cross-links between arbitrary record kinds; no directional owner meaning. Accepting it would fabricate ownership from broad links. |
| `parentEntry` | (1632 structural-only) | — | structural | Repository parent/collection grouping, excluded from the semantic map at recovery (see `metadata/relationship-recovery.json`). |
| any other field | 0 | — | irrelevant (default) | Never ownership evidence. |

**Row-level ambiguity bucket:** no whole category is contested, but individual
rows are. A poetry id claimed by more than one distinct owner (e.g. a haiku
claimed by both a mascot and a lorelog record) is reported as an
`ambiguous_ownership` finding and **never mapped** — the generator does not
pick a winner.

## Mapping derivation (generator)

Inputs are the committed `relationship-map.jsonl`, `id-map.jsonl`, the
population template, and the category taxonomy. The generator never reads
filenames, numeric prefixes, titles, tags, or legacy `match_type`; it consumes
only canonical IDs.

| metric | value |
|---|---|
| Relationship rows declared | 2661 |
| Accepted rows | 1603 |
| Accepted rows resolved | 1561 |
| Duplicate identical evidence removed (deduplicated safely) | 256 |
| Poetry records (content, audit-aligned) | 1688 |
| Poetry records with accepted claims | 1015 |
| **Exact mappings derived (single owner)** | **853** (702 → mascots, 151 → lorelog) |
| Mappings by poetry type | aphorism 238 · haiku 326 · limerick 289 |
| Contested poetry ids (multiple owners, not mapped) | 162 |
| Poetry ids with no accepted claim | 673 (audit orphans total 835 = 673 + 162 contested) |
| Findings reported | 331 (162 ambiguous, 127 non-poetry mascotRef declarers, 42 unresolved) |
| **Blocking findings** | **0** |

Findings are reported in `summary.json`; non-blocking findings are the
contested/unresolved evidence the conservative policy deliberately excludes.
Blocking findings (noncanonical endpoints, missing records, self-references)
would fail the generation; there are none on the committed state.

## Determinism proof

- Output is sorted stable JSON (`sort_keys`, fixed indent, trailing newline),
  no host paths, no timestamps, no Git-derived values; inputs are never mutated.
- `--check` regenerates from committed inputs and compares bytes; it passes.
- Policy digest (SHA-256): `d84d7512a6cb09d5954318b90b9d1bdad36da6b8bf9513961acde64fa1b3ee3f`
- Summary digest (SHA-256): `afbc94654487225df365aa32cfb55f533f8885f9918b8afaa618aec2592b53f5`
- Fresh generation into a temp dir reproduced the identical digests (byte-identical).

## Boris dogfood observation

`boris-content-audit --mode=poetry --policy=metadata/content-audit-policy/policy.json --fail-on=none`
against `content/` (Boris `afterparty` `bbaaabe`):

| metric | value |
|---|---|
| Records discovered | 2265 |
| Source records (eligible) | 423 (mascots 238, lorelog 185) |
| Poetry records | 1688 (aphorism 563, haiku 563, limerick 562) |
| Mapped | 853 |
| Orphan | 835 |
| Ambiguous / disagreement (audit-level) | 0 (contested evidence is excluded from the policy by design; the 162 contested ids surface as orphans plus generator findings) |
| Missing target | 0 |
| Dead references | 0 |
| Malformed records | 0 |
| Policy-table structural findings (stale keys, non-poetry keys, missing/non-source/ineligible targets) | 0 |
| Expected coverage | 1084 |
| Substantive coverage | 658 |
| Placeholder coverage | 0 (conservative empty placeholder policy) |
| Missing coverage | 256 |
| Ambiguous coverage (duplicate_coverage) | 16 |
| Malformed coverage | 154 (mascot haiku coverage whose verse is malformed) |
| Verse units | aphorism 4650 · haiku 2755 · limerick 5524 |
| Malformed verse units | haiku 766 · limerick 46 · aphorism 0 |
| Structural exceptions | 16 × `duplicate_coverage` (mascots with 2+ mapped poems of one type; surfaced, never silently selected) |

Observations, no repairs made:

- The 766 malformed haiku units are the literal-`\n` verse residue from the
  migration. Per scope, content is **not** normalized in this PR; the audit
  surfaces the residue as malformed verse.
- `duplicate_coverage` structural exceptions (16) are the Boris audit doing its
  job: multiple mapped poems per mascot are reported, not resolved.

## Tests

`python3 scripts/test_content_audit_policy.py` — all checks pass:

- accepted ownership evidence maps poetry → exactly one owner
- unrelated category (`relatedEntries`) never becomes ownership
- poetry/source direction deterministic for both accepted legacy sides
- two owners for one poetry id → reported, never chosen
- unresolved/missing endpoint evidence → reported, never dropped
- noncanonical / content-missing endpoints → blocking finding, generation fails, never mapped
- duplicate identical evidence → deduplicates safely
- output byte-identical across runs
- `--check` detects drift (exit 1)
- filenames/titles/tags/`match_type` never participate in matching

## Scope boundaries honored

No archive content changed; no relationship ground truth changed; no RAG/context
export repaired; no CI modified; no publish gate added; no literal-`\n` haiku
normalized; Boris untouched.

## Reproduce

```bash
python3 scripts/build_content_audit_policy.py          # regenerate + commit outputs
python3 scripts/build_content_audit_policy.py --check  # drift gate (exit 0 here)
python3 scripts/test_content_audit_policy.py           # regression suite
# dogfood (local Boris afterparty build, observation only):
boris-content-audit --mode=poetry --root=. --content-root=content \
  --out=.tools/audit-out --policy=metadata/content-audit-policy/policy.json \
  --fail-on=none --format=json
```
