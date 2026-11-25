---
title: "Trust Record 808 — Dry Powder Partition"
id: reference/FREF-0944-DPP
parent: reference
status: published
tags: ["reference", "trust-surface", "managed-absence", "archivally-asserted", "dry-powder", "allocation-failure", "value-creation-patch", "open-loop"]
relations: [relates_to=reference/FREF-0815-MAP, relates_to=aphorisms/APH-FREF-0944-DPP]
---

# Trust Record 808 — Dry Powder Partition

**Record type:** Trust audit, allocation subsystem.

**Audit window:** 14 quarters.

**Misfiled under:** Fire Safety, Extinguishing Agents.

**Managed-absence code:** AAOA.

This record audits a reserved memory partition labelled `DRY_POWDER`. The partition reports as fully available. It has rejected every allocation request made against it during the audit window. The partition is not faulty. Its availability and its refusals are produced by the same mechanism.

## 1. Partition Summary

| Metric | Value |
|---|---|
| Declared capacity | 4.0 GB, reported as "committed" |
| Allocated | 0.0 GB |
| Allocation requests received | 2,310 |
| Requests rejected | 2,310 |
| Mean time to rejection | 11 weeks |
| Rejections containing "love what you're building" | 2,094 |
| Rejections citing "too early" | 1,187 |
| Rejections citing "too late" | 1,123 |
| Requests rejected as too early, then as too late, in consecutive quarters | 61 |
| Holding fee on declared capacity | 2.0% per annum |
| Dashboard status | Available |

**Finding.** The fee is charged on declared capacity, not on use. It is the only write the partition has accepted.

## 2. Allocation Protocol

The request handler issues a term sheet before any allocation. Clause 9 makes the allocation conditional on the terms of a "definitive term sheet." The definitive term sheet contains the same Clause 9.

Auditors followed the reference to a depth of 40 before the stack was exhausted. No base case was found. Legal classifies the structure as standard.

## 3. Value Creation Patch

Patch `PE-3.0` is applied by the partition's sister process to assets it acquires. The audit observed one application, to a maintained open-source utility.

| Property | Before patch | After patch |
|---|---|---|
| Interface | Present | Removed, described as streamlined |
| Licence | Permissive | Per seat, annual, 3.0x |
| Maintainers | 4 | 0 |
| Documentation | Public | Behind a sales form |
| Users | 61,000 | 61,000 |
| Reported value created | Not applicable | 3.0x |

**Finding.** The user count is unchanged because migrating away costs more than the fee. The value created and the fee increase are the same number. The audit does not regard this as a coincidence. The patch notes do not regard it as a finding.

## 4. Disclosure Surface

Public statements issued by the partition during the audit window:

| Quarter | Statement | Detail supplied | Replies |
|---|---|---|---|
| Q3 | "Something big is coming out of the fund. More soon." | None | 4,410 |
| Q7 | "Most people will get this wrong. We didn't." | None | 6,102 |
| Q11 | "Reply POWDER and we'll send the thesis." | None. Theses sent: 0 | 9,870 |
| Q14 | "To be clear, we never said anything had been allocated." | Accurate | 212 |

The first three statements are open loops. Each withholds the one detail that would end the thread. The fourth is the plausible-deniability handler, invoked when a reader compares the statements with the table in section 1. It is technically correct, which is the only kind of correct the handler supports.

Reply volume is reported to limited partners as engagement, under deployment metrics.

## 5. Classification

Filed on the [[reference/FREF-0815-MAP|Managed Absence Spine]] as AAOA: archivally asserted, operationally absent. The capacity is asserted in every report and absent from every outcome. Per the spine's filing guidance, no remediation is promised.

## 6. Trust Rating

| Surface | Rating |
|---|---|
| Declared capacity | Trusted, unverifiable |
| Allocation | Not observed |
| Fee collection | Verified, quarterly |
| Disclosure | Engaging |

**Recommendation.** None. A partition that never allocates never misallocates. The audit records this as the stated risk policy and as its result.

## Filing Note

The record was misfiled under Fire Safety at intake, on the strength of its title. The Fire Safety desk reports that the powder held there is also unused, and has asked to keep the file.

## Related

- [[reference/FREF-0815-MAP|Managed Absence Spine]], classification authority
- [[aphorisms/APH-FREF-0944-DPP|Aphorisms: Trust Record 808]]
