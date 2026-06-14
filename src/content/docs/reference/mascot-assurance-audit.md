---
title: "Mascot Assurance Audit"
description: "Structural triage of the mascot archive. Tracks weight distribution, frontmatter gaps, and intervention targets flagged by the Assurance Desk."
date: 2026-06-14
tags:
  - reference
  - audit
  - mascot-assurance
  - boundary-audit
---

# Mascot Assurance Audit

This report was compiled by the Assurance Desk audit utility. It does not assess quality, tone, or lore fidelity. It observes structural weight, frontmatter completeness, and cross-referenceability—the minimum conditions for a file to be found, shelved, and reviewed without requiring a full read.

A mascot that cannot be located by its metadata is not missing. It is *misfiled into silence.*

---

## Archive Weight Distribution (Pending Only)

| Weight Class | Count | Share |
|---|---|---|
| 👻 Ghost (≤1000b) | 10 | 5.5% |
| 🪶 Thin (≤2000b) | 10 | 5.5% |
| 📄 Adequate (≤4000b) | 72 | 39.3% |
| 📦 Substantial (>4000b) | 91 | 49.7% |
| **Total Pending** | **183** | |
| **Graduated (Assurance Pass 1+)** | **51** | |
| **Total Archive** | **234** | |

---

## Frontmatter Gap Summary

These counts reflect how many mascots are missing key metadata fields. A missing field does not indicate an error; it indicates a file that cannot yet fully participate in cross-referencing, shelving, or automated review workflows.

| Gap Type | Count | Affected Field(s) |
|---|---|---|
| No `description` | 0 | Identity |
| No `origin` | 6 | Identity |
| No `systemAffiliation` | 1 | Classification |
| No `tags` or empty | 6 | Classification |
| No relationships at all | 0 | Cross-reference |
| No body sections (h2/h3) | 35 | Structural depth |

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
| Placeholder affiliation | 10 | Carries a stub affiliation (e.g., "Society of Mascot Authors") that functions as a catch-all rather than a real doctrinal home. These mascots are technically affiliated but functionally unshelved. |
| Real affiliation | 0 | Has a specific system affiliation despite low byte weight. May be legitimately sparse. |
| No affiliation | 0 | No `systemAffiliation` declared at all. |

### Full Ghost Listing

| File | Bytes | Description | System Affiliation |
|---|---|---|---|
| `263.gentle-rollback.mdx` | 931 | Stub entity for reversals with bedside manner, policy retreats framed as care, a… | Society of Mascot Authors 🏷️ |
| `295.sanctioned-quilt.mdx` | 933 | Placeholder for assembled comfort, committee-approved softness, and patchwork re… | Society of Mascot Authors 🏷️ |
| `316.pleading-margin.mdx` | 933 | Placeholder for handwritten additions, side-channel desperation, and the human e… | Society of Mascot Authors 🏷️ |
| `280.ribbon-latency.mdx` | 934 | Placeholder for ceremonial lag, delayed opening energy, and institutions still c… | Society of Mascot Authors 🏷️ |
| `244.sentiment-launderette.mdx` | 936 | Stub for mood-cleaning surfaces, affect smoothing, and dashboard-safe emotional … | Society of Mascot Authors 🏷️ |
| `296.gown-of-recognition.mdx` | 952 | Reserved mascot for honorary visibility, draped acknowledgment, and the formal c… | Society of Mascot Authors 🏷️ |
| `285.pamphlet-quietus.mdx` | 960 | Placeholder for informational closure, brochure-grade peace, and situations decl… | Society of Mascot Authors 🏷️ |
| `286.favorable-beige.mdx` | 966 | Reserved mascot for neutral-positive presentation, calming departmental surfaces… | Society of Mascot Authors 🏷️ |
| `282.gentility-siphon.mdx` | 968 | Stub for manners that absorb force, polished tone that lowers visible conflict, … | Society of Mascot Authors 🏷️ |
| `300.friendship-preamble.mdx` | 992 | Placeholder for affiliative opening language, social framing before system deman… | Society of Mascot Authors 🏷️ |

**Total Ghosts:** 10 (10 placeholder-affiliated, 0 real-affiliated, 0 unaffiliated)

---

## Unaffiliated Mascots

Mascots with no `systemAffiliation` cannot be shelved by automated processes. They exist, but they do not belong anywhere yet.

| File | Bytes | Status |
|---|---|---|
| `037.winona-crashingtonmd.mdx` | 6224 | archived |

**Total Unaffiliated:** 1

---

## Self-Audit

The Assurance Desk does not exempt itself from observation. The following anomalies were detected in the data this report attempted to render.

| File | Issue |
|---|---|
| `005.bricky-goldbricksworth.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `019.kindy-mcexistentialcrisis.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `050.yammy-mcparseface.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `052.octomerge.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `278.benevolence-spacer.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `279.annex-hush.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `281.comfort-ledgerling.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `294.proxy-lantern.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `299.seal-of-maybe-enough.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `301.friendrick-the-extant.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `400.bad-request-bob.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `404.404sy-mclostalot.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `405.method-not-allowed-mel.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `424.the-second-domino.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `429.queue-matron.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `431.paper-crown.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |
| `451.the-quiet-injunction.mdx` | `relatedLorelog` contains object entries (not plain strings). Cross-reference rendering may require special handling. |

**Total Self-Audit Anomalies:** 17

---

*This report was generated on 2026-06-14 by `scripts/audit-mascot-assurance.mjs`. It observes. It does not intervene. Interventions require explicit invocation of the Assurance Desk.*
