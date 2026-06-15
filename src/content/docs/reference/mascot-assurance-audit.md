---
title: "Mascot Assurance Audit"
description: "Structural triage of the mascot archive. Tracks weight distribution, frontmatter gaps, and intervention targets flagged by the Assurance Desk."
date: 2026-06-15
tags:
  - reference
  - audit
  - mascot-assurance
  - boundary-audit
updatedAt: 2026-06-13
---

# Mascot Assurance Audit

This report was compiled by the Assurance Desk audit utility. It does not assess quality, tone, or lore fidelity. It observes structural weight, frontmatter completeness, and cross-referenceability—the minimum conditions for a file to be found, shelved, and reviewed without requiring a full read.

A mascot that cannot be located by its metadata is not missing. It is *misfiled into silence.*

---

## Archive Weight Distribution (Pending Only)

| Weight Class | Count | Share |
|---|---|---|
| 👻 Ghost (≤1000b) | 0 | 0.0% |
| 🪶 Thin (≤2000b) | 0 | 0.0% |
| 📄 Adequate (≤4000b) | 72 | 44.2% |
| 📦 Substantial (>4000b) | 91 | 55.8% |
| **Total Pending** | **163** | |
| **Graduated (Assurance Pass 1+)** | **71** | |
| **Total Archive** | **234** | |

---

## Frontmatter Gap Summary

These counts reflect how many mascots are missing key metadata fields. A missing field does not indicate an error; it indicates a file that cannot yet fully participate in cross-referencing, shelving, or automated review workflows.

| Gap Type | Count | Affected Field(s) |
|---|---|---|
| No `description` | 0 | Identity |
| No `origin` | 6 | Identity |
| No `systemAffiliation` | 0 | Classification |
| No `tags` or empty | 6 | Classification |
| No relationships at all | 0 | Cross-reference |
| No body sections (h2/h3) | 23 | Structural depth |

---

## Priority Intervention List

The following mascots have been flagged by the Assurance Desk for targeted review. They are grouped by doctrinal shelf and ranked by structural leverage—meaning the files whose refinement would most stabilize their surrounding cluster.

This is not a correction queue. It is a triage list. Each entry names the structural gap; it does not prescribe the solution.

---

## Intervention Detail Cards

For each flagged mascot, the following cards summarize the current frontmatter state so that a reviewer (human or otherwise) can begin assessment without reading the full file.

## Ghost Census

The following files weigh 1000 bytes or less. They are not necessarily deficient—some ghosts are correctly sparse. But a ghost that cannot explain what failure it witnesses is a filing accident, not an artifact.

### Ghost Affiliation Breakdown

| Category | Count | Observation |
|---|---|---|
| Placeholder affiliation | 0 | Carries a stub affiliation (e.g., "Society of Mascot Authors") that functions as a catch-all rather than a real doctrinal home. These mascots are technically affiliated but functionally unshelved. |
| Real affiliation | 0 | Has a specific system affiliation despite low byte weight. May be legitimately sparse. |
| No affiliation | 0 | No `systemAffiliation` declared at all. |

### Full Ghost Listing

| File | Bytes | Description | System Affiliation |
|---|---|---|---|

**Total Ghosts:** 0 (0 placeholder-affiliated, 0 real-affiliated, 0 unaffiliated)

---

## Unaffiliated Mascots

Mascots with no `systemAffiliation` cannot be shelved by automated processes. They exist, but they do not belong anywhere yet.

*All mascots have declared a system affiliation. The archive is, for once, tidy.*

---

## Self-Audit

The Assurance Desk does not exempt itself from observation. The following anomalies were detected in the data this report attempted to render.

*No rendering anomalies detected. The report consumed its own data without incident.*

---

*This report was generated on 2026-06-15 by `scripts/audit-mascot-assurance.mjs`. It observes. It does not intervene. Interventions require explicit invocation of the Assurance Desk.*
