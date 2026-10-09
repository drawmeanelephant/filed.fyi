---
title: "Exhumation Protocol"
id: reference/FREF-0923-MANENE-PROTOCOL
parent: reference
status: published
tags: ["reference", "religious-administration", "managed-absence", "corporate-manene", "exhumation-protocol"]
relations: [relates_to=mascots/M-0092, relates_to=lorelog/LLG-0939-CORPORATE-MANENE, relates_to=reference/FREF-0815-MAP, relates_to=mascots/M-0019, relates_to=reference/FREF-0921-BPL, relates_to=reference/FREF-0922-CVS]
---

# Exhumation Protocol

The protocol governing periodic exhumation of records held in managed absence under the [[reference/FREF-0815-MAP|Managed Absence Spine]]. Maintained by the Exhumation Officer ([[mascots/M-0092|Corporate Ma'nene']]); each cycle certified by the Verification Officer ([[mascots/M-0019|Kindy McExistentialcrisis]]).

Managed absence is not an ending. This document is the schedule.

## Exhumation Calendar

Append-only. One row per cycle, scheduled or executed.

| Cycle | Scheduled | Executed | Pulled | REBURIED | REANIMATED | DISPLAYED | DISSOLVED | Notes |
|---|---|---|---|---|---|---|---|---|
| MN-0001 | 2026-10-05 | 2026-10-05 | 200 | 191 | 6 | 2 | 1 | First cycle; see [[lorelog/LLG-0939-CORPORATE-MANENE]] |
| MN-0002 | 2027-10-05 | — | — | — | — | — | — | Annual, per officer recommendation |

## Pull List Query

Records eligible for exhumation are identified by the standing query:

```
status:archived AND last_exhumed > 3 years AND (CAAR OR AAOA OR LCGU)
```

The query is executed by the officer at Schedule Check. Records that return themselves are noted, not honored.

## Shroud Versions

The presentation layer applied at re-dressing. The current version is applied to every exhumed record. Prior versions are retained for the record, as is tradition.

| Shroud | Schema | In service | Retired |
|---|---|---|---|
| v1.0 | legacy freeform frontmatter | — | 2021-11-30 |
| v2.0 | closed key set: `id`, `parent`, `status`, `tags` | 2021-11-30 | 2025-08-02 |
| v3.0 | Boris grammar; `relations` edges | 2025-08-02 | — |

## Outcome Codes

| Code | Disposition |
|---|---|
| REBURIED | Returned to managed absence with updated paperwork. |
| REANIMATED | Promoted to active status; new `parent`, new `status`; enters the pool logged in [[reference/FREF-0921-BPL]]. |
| DISPLAYED | Moved to the Ancestors section; visible, not active. |
| DISSOLVED | The record did not survive re-dressing. Its ID is retained; its condition is not. |

## Form 51-E-MN

The Exhumation Verification Form — a variant of Form 51-E for managed-absence cycles. One form per exhumed record. Fields:

- **Record ID** — verified against the pull list.
- **Still dead? Y/N** — the officer checks. The record does not answer. Usually.
- **Shroud version applied** — per the table above.
- **Procession witnesses** — lorelog entries visited; each receives an `exhumed_witness` note.
- **Outcome code** — per the outcome table.
- **Certifying officer** — countersignature of the Verification Officer.

## Filing Notes

- Exhumed records often show vector migration; sightings are logged in [[reference/FREF-0922-CVS|Capture Vector Sightings]].
- Reanimated records enter the breeding pool; crosses are logged in [[reference/FREF-0921-BPL|Breeding Program Log]].
- The first executed cycle is documented in [[lorelog/LLG-0939-CORPORATE-MANENE|LLG-0939]].
