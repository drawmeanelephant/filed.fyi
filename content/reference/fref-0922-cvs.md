---
title: "Capture Vector Sightings"
id: reference/FREF-0922-CVS
parent: reference
status: published
tags: ["reference", "capture-vector", "migration-log", "rot-protocol"]
relations: [relates_to=mascots/M-0091, relates_to=lorelog/LLG-0938-CAPTURE-VECTOR, relates_to=reference/FREF-0920-RAB]
---

# Capture Vector Sightings

> **Capture Vector Sightings**  
> *Append-only. The vector migrates; the log chases.*  
> *Mode confirmed per sighting: FINA / CRED / GOVC / LEGA / STAT / HYBRID.*

| Date | Tradition / Institution | Mode | Vector Signature | Seal Status | Notes |
|------|------------------------|------|------------------|-------------|-------|
| 2026-09-22 | Roman Catholic (Curia) | GOVC | procedural rot -> procedural rot (CAAR-HER) | Intact | `LLG-0921-CURIA-ARCHIVE` |
| 2026-09-23 | Eastern Orthodox (Synod) | CRED | conciliarity stamp -> conciliarity stamp (LCGU-CAN) | Intact | `LLG-0922-SYNOD-PHANTOM` |
| 2026-09-24 | Protestant Mainline (Session) | STAT | unity index 99.7% / teller report 62% (AAOA-CNS) | Intact | `LLG-0923-PHANTOM-CONSENT` |
| 2026-09-25 | Evangelical (Megachurch) | FINA | dashboard baptism / tank empty | Intact | `LLG-0924-MEGACHURCH-METRICS` |
| 2026-09-26 | Sunni Islam (Waqf) | FINA | dry well / rental diverted (AAOA-WQF) | Intact | `LLG-0925-WAQF-DRY-WELL` |
| 2026-09-27 | Shia Islam (Marja' office) | CRED | analogic citation outlives its chain (LCGU-FAT) | Intact | `LLG-0926-MARJA-ANALOGY` |
| 2026-09-28 | Judaism (Beth Din) | CRED | signature precedes intent (GET-FORGERY) | Forged | `LLG-0927-GET-FORGERY` |
| 2026-09-29 | Hindu (Devasthanam) | FINA | temple gold / vault audited empty | Intact | `LLG-0928-DEVASTHANAM-GOLD` |
| 2026-09-30 | Buddhist — Theravada (Vinaya) | GOVC | rule permits the vehicle (VINAYA-MERCEDES) | Intact | `LLG-0929-VINAYA-MERCEDES` |
| 2026-10-01 | Buddhist — Vajrayana (Tulku) | CRED | recognition certificate / urn certified | Intact | `LLG-0930-TULKU-URN` |
| 2026-10-02 | Sikh (SGPC) | GOVC | committee seat inherits itself | Intact | `LLG-0931-SGPC-DYNASTY` |
| 2026-10-03 | Baha'i (Consultation) | GOVC | consultation loop / quorum asserted (AAOA-CNS) | Intact | `LLG-0932-CONSULTATION-LOOP` |
| 2026-10-04 | New Religious Movements (Ethics) | STAT | ethics file retroactive to doubt | Intact | `LLG-0933-ETHICS-RETROACTIVE` |
| 2026-10-05 | Cargo Cult (Requisition) | GOVC | requisition honored / cargo pending (AAOA-REQ) | Intact | `LLG-0934-CARGO-REQUISITION` |
| 2026-10-06 | Indigenous (Wampum) | FINA | repatriation invoice / belt returned as asset | Fractured | `LLG-0935-WAMPUM-REPATRIATION` |
| 2026-10-07 | Indigenous (Subak) | STAT | water calendar upstream of the sensor | Intact | `LLG-0936-SUBAK-CALENDAR` |
| 2026-10-08 | Land Title (Registry) | HYBRID | double-ledger / both ledgers authoritative | Forged | `LLG-0937-TITLE-DOUBLE-LEDGER` |
| 2026-10-09 | Cross-cutting (registry) | HYBRID | signature migrates among chancery, board, ministry, committee, ledger | Missing | `LLG-0938-CAPTURE-VECTOR` |

## Filing Rules

1. One line per confirmed sighting. No analysis column.
2. Mode is one of `FINA`, `CRED`, `GOVC`, `LEGA`, `STAT`, or `HYBRID` — the latter when more than one mode is detected in the same institution.
3. Vector Signature records the rot-affinity pattern observed; a MAP filing code may be carried in parentheses where one was issued.
4. Seal Status is `Intact`, `Fractured`, `Forged`, or `Missing` — the condition of the procedural surface. `Forged` means the surface was replicated without authority.
5. Notes carry a lorelog or mascot ID only. No prose.

## Living Document Protocol

- New sightings are added one row at a time, with a lorelog or mascot record as witness.
- No retrospective analysis. The log is the analysis.
- The log is always behind the vector. This is expected and is not a defect in the log.

## Related

- `mascots/M-0091` — the vector of record
- `lorelog/LLG-0938-CAPTURE-VECTOR` — migration summary of record
- `reference/FREF-0920-RAB` — capture taxonomy consulted
