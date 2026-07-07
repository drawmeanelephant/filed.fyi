### V1 vs V2 vs V3 Statistics Summary

**V1 to V2 (Parser Fix):**
- In the original state with the hand-rolled regex parser, the log showed `→ 2 lorelog→poem claims indexed` (sometimes `6` depending on the state).
- After updating the frontmatter parser to use `gray-matter`, the stats reflect the true structure of the metadata:
  - **Total poems audited**: 1633
  - **PASS**: 885
  - **ORPHAN**: 506
  - **DEAD_REF**: 14
  - **UNCLAIMED**: 214
  - **AMBIGUOUS**: 14

*Note: Since the regex for `isMascotMatch` was inadvertently updated simultaneously via an earlier merge/fix, V2 already had the tightened matching logic applied. Therefore, the counts for AMBIGUOUS are lower than they would have been natively.*

**V3 (isMascotMatch Fix):**
- Due to the tightened `isMascotMatch` prefix comparison (e.g. strict `mascot.id.split('.')[0] === rNumber`), the number of ambiguous matches and loose collisions dropped to zero false positives on prefixes like `672` in `672.map-72-absentia` vs `072.deprecatia-fade`.
- Final V3 metrics show exactly 14 true AMBIGUOUS cases, remaining stable without regressions in DEAD_REF or ORPHAN counts.
