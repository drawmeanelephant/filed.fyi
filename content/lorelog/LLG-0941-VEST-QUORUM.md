---
title: "Badge Reader Deduplication at Founder Run Club — Four Hundred Attendees Resolved to One Record"
id: lorelog/LLG-0941-VEST-QUORUM
parent: lorelog
status: published
tags: ["lorelog", "failure-signature", "attendance", "badge-collision", "deduplication", "stealth-mode", "waitlist-loop", "networking-mixer"]
relations: [relates_to=lorelog/LLG-0386-LODGE-MERGE, relates_to=limericks/LIM-LLG-0941-VEST-QUORUM]
---

# Badge Reader Deduplication at Founder Run Club — Four Hundred Attendees Resolved to One Record

**Case Number:** LLG-0941-VEST-QUORUM

**Misfiled under:** Lost Property, Outerwear.

**Log sources:** door controller `mixer-gate-02`, the attendance service, one waitlist. Timestamps are reproduced as recorded. The door controller's clock was last set by hand.

## Incident Log

| Timestamp (UTC) | Source | Entry |
|---|---|---|
| 2026-11-17T13:00:00Z | wearables | Cold plunge logged at 05:00 local by 400 devices in the same second. Recorded as one plunge. |
| 2026-11-17T13:58:02Z | mixer-gate-02 | Doors scheduled for 06:00 local. Event: "Founder Miles, invite-only 5K and networking mixer." Invite list: 400. Invite criteria: not recorded. |
| 2026-11-17T14:00:11Z | mixer-gate-02 | First badge-in. Attributes captured: fleece vest, navy, chest logo; bio "building something new, in stealth"; pace "conversational." |
| 2026-11-17T14:00:12Z | attendance | Second badge-in. Attributes identical. Duplicate suspected. Merged with first. |
| 2026-11-17T14:06:40Z | attendance | 398 further badge-ins. All merged. Similarity 1.00 on every field except name, which the matcher weights at zero because names "vary too much to be useful." |
| 2026-11-17T14:06:41Z | attendance | Headcount: 1. Capacity alarm cleared. Catering order reduced to one oat-milk cortado. |
| 2026-11-17T14:07:00Z | mixer-gate-02 | Run begins. Turnstile reports 400 passes by one attendee. Flagged as tailgating. The attendee is asked to stop following itself. |
| 2026-11-17T14:31:15Z | attendance | The record is asked what it is building. Response: "Can't say yet. We're in stealth." 400 identical responses stored as one. The system notes the storage saved. |
| 2026-11-17T14:31:16Z | waitlist | The record joins the waitlist for its own product. Position: 400 of 400. Estimated access: 36 months. The estimate has read 36 months since the waitlist opened, 36 months ago. |
| 2026-11-17T14:40:00Z | attendance | Networking phase. The record exchanges contact details with itself and logs 79,800 new connections. The arithmetic is correct for 400 attendees. |
| 2026-11-17T14:52:30Z | attendance | Pivot announced. The record is now building the same thing for a different vertical. The previous pivot was 14 days earlier. The next is scheduled. |
| 2026-11-17T15:10:00Z | mixer-gate-02 | Doors close. Badge-outs: 0. The controller does not log exits for attendees of which it holds only one. |
| 2026-11-16T22:04:00Z | attendance | Thread published by the record: "I went to a run club this morning. What happened at mile two changed how I think about distribution." The thread ends there. Replies: 1,912, each asking what happened at mile two. |

## Reviewer Notes

- The last entry is timestamped sixteen hours before the doors opened. The attendance service's clock is correct. The entry has been left in place. The thread exists and has replies.
- Nothing is recorded at mile two. The turnstile log shows no anomaly on any part of the course. The reviewing clerk concludes that either nothing happened at mile two, or what happened was withheld from the log as well. Both readings produce the same number of replies.
- Lodge precedent was consulted. In [[lorelog/LLG-0386-LODGE-MERGE|LLG-0386]] one member was counted in two seats and the quorum was held ceremonially acceptable. Here four hundred members were counted in one seat. The clerk finds the cases symmetrical and has not determined what a quorum of one is quorate for.
- Lost Property received one navy fleece vest. It has been claimed 400 times. Each claimant described it correctly.

## Disposition

The merge was not reversed. Reversal requires a distinguishing field, and none was captured. The attendee is retained as a single record carrying a headcount attribute of 400, which downstream systems read as a typo.

The organisers reported the event as "sold out" and as "intimate." **Both descriptions are supported by the log.**

> **Bricky's Filing Notes**
>
> - **Summary:** Four hundred people attended. One was recorded. Neither figure is wrong.
> - **Goals:** A distinguishing field.
> - **Quirks:** The waitlist estimate has not moved. Internally it is described as stable.

## Related

- [[lorelog/LLG-0386-LODGE-MERGE|LLG-0386]], attendance that survives merger, in the other direction
- [[limericks/LIM-LLG-0941-VEST-QUORUM|Limerick: Vest Quorum]]
