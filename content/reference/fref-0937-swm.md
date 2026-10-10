---
title: "Service Window Matrix"
id: reference/FREF-0937-SWM
parent: reference
status: published
tags: ["reference", "service-windows", "comparative-matrix", "queue-governance", "housekeeping"]
relations: [relates_to=mascots/M-0429, relates_to=mascots/M-0444, relates_to=mascots/M-0236, relates_to=lorelog/LLG-0358-DOGE-W3, relates_to=lorelog/LLG-0373-DOGE-W5]
---

# Service Window Matrix

The public counter is one institution wearing several windows. This matrix files the observed handling posture of each staffed aperture so that a need may be sent to the correct disappointment the first time.

Postures by seam, condensed:

| Window | RECV | VERF | QUEU | RESL | ESCA | OUTP |
|---|---|---|---|---|---|---|
| Window 1 — General Intake | stamped and stacked | by weight | orderly, ticketed | routed to Window 2 | by re-queue | numbered slip |
| Window 2 — Corrections | contested | by seniority of error | one line, two directions | revised intake slip | to Window 1 | revised slip |
| Window 3 — Certification | by appointment | provenance-weighted | counselled queue | score-band letter | appeal, see `lorelog/LLG-0358-DOGE-W3` | certificate or weather |
| Window 4 — Lost & Found | self-service | by recognition | unattended | claimant describes item | item decides | item, or sympathy |
| Window 5 — Appeals | by ordeal | local-anchor test | congested, see `lorelog/LLG-0373-DOGE-W5` | rerouted locally | not offered | waiting |
| Window 6 — (closed) | — | — | — | — | — | busiest |

The matrix records posture, not service level. A window's entries describe what it does with what arrives; they do not describe whether the visitor's need was met. That is a separate instrument, and no window currently stocks it.

## Seam Key

- **RECV** — receiving posture: how the window takes custody of what is handed to it.
- **VERF** — verification posture: what the window checks, in the vocabulary it checks it with.
- **QUEU** — queue posture: the shape waiting takes.
- **RESL** — resolution path: the form an ending takes, when one is produced.
- **ESCA** — escalation path: where a need goes when the window declines it.
- **OUTP** — output: what the visitor carries away.

## Filing Rules

1. One row per staffed aperture. An aperture is an opening with a bell, a sign, or a queue with opinions.
2. Cell entries are posture descriptions in the desk's own vocabulary. They are not performance metrics and may not be averaged.
3. Windows are added when discovered. Window 6 has been scheduled for discovery since the third survey.
4. The matrix does not route. Routing is performed by visitors, incorrectly, and corrected by the Queue Matron ([[mascots/M-0429]]).

## Living Document Protocol

- Windows open and close on a cadence the matrix does not predict; rows are amended to reflect observed posture, not announced hours.
- A window reporting success without backend record (see `mascots/M-0444`) is filed exactly as observed. The matrix holds the mismatch without resolving it.
- Windows whose owner cannot be determined are held under `mascots/M-0236` pending jurisdiction, which is itself a posture.

> **Queue Matron, penciled at the head of the column:** *All six windows are one window. The difference is which number your hope was assigned before it learned to wait.*

## Related

- [[mascots/M-0429|Queue Matron]] — enforcer of queue posture across all windows
- `mascots/M-0444` — portal/backend mismatch at the benefits-adjacent counter
- `mascots/M-0236` — custodian of the unowned window between departments
- `lorelog/LLG-0358-DOGE-W3` — certification window guidance of record
- `lorelog/LLG-0373-DOGE-W5` — appeal routing congestion of record
