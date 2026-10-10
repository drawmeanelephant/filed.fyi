---
title: "Tribunal Docket Log"
id: reference/FREF-0924-TDL
parent: reference
status: published
tags: ["reference", "tribunal-adjacent", "docket-log", "religious-administration", "rot-protocol"]
relations: [relates_to=mascots/M-0409, relates_to=lorelog/LLG-0937-TITLE-DOUBLE-LEDGER, relates_to=reference/FREF-0932-TDC]
---

# Tribunal Docket Log

> **Tribunal Docket Log**  
> *Append-only. Filed by the Docket Clerk on behalf of the competent body.*  
> *Matters entered upon presentation. Adjacency is recorded; jurisdiction is not.*

Append-only. One row per matter presented. Docket numbering is sequential; competence is not.

| Docket | Opened | Matter | Presiding | Disposition | Witness |
|---|---|---|---|---|---|
| TRB-0001 | 2018-06-11 [R] | two truth tables, one canonical position | Merge Tribunal | FROZEN | `mascots/M-0409` |
| TRB-0002 | 2026-09-24 | teller report 62%; recorded consent 99.7% | Session-adjacent | RECORDED | `LLG-0923-PHANTOM-CONSENT` |
| TRB-0003 | 2026-09-28 | voluntariness of signatures on complete forms | Beth Din-adjacent | DEFERRED | `LLG-0927-GET-FORGERY` |
| TRB-0004 | 2026-10-01 | succession recognized before the urn reported | Recognition-adjacent | CERTIFIED | `LLG-0930-TULKU-URN` |
| TRB-0005 | 2026-10-03 | consultation outcome versus consultation | Assembly-adjacent | UNANIMOUS | `LLG-0932-CONSULTATION-LOOP` |
| TRB-0006 | 2026-10-08 | two title ledgers, both authoritative | Merge Tribunal | REFERRED | `LLG-0937-TITLE-DOUBLE-LEDGER` |
| TRB-0007 | 2026-10-09 | whether TRB-0006 was referred competently | Merge Tribunal | DEFERRED | — |
| TRB-0008 | 2026-10-10 | whether this log has heard TRB-0007 before | Merge Tribunal | RECURSIVE | — |

The disposition names the procedural state of the matter at close of handling, not the condition that brought it. Codes are defined in [[reference/FREF-0932-TDC]].

## Filing Rules

1. One line per matter presented. No verdict column.
2. Disposition is one of the controlled codes in `reference/FREF-0932-TDC`. The code is the finding; the matter is not the finding.
3. Presiding records the office that held the hearing. The `-adjacent` suffix marks a body whose relation to the competent tribunal is unfiled.
4. Witness carries a lorelog or mascot ID only, or `—` where no outside record was permitted to attend.
5. No outcomes. A docket records that a matter was handled, not that it concluded.

## Living Document Protocol

- New matters are appended one row at a time. Docket numbers are never reused, even where the matter is a docket's own.
- Retroactive matters are marked `[R]` and carry the date the matter first convened, not the date of filing.
- The log does not reconcile against resolution. FROZEN matters remain on the log at their last disposition; TRB-0001 predates the log by eight years and has not been asked to hurry.

> **Docket Clerk's note:** *TRB-0006 was referred to the competent body by the competent body, which was this body. The referral was accepted. TRB-0007 asks whether that was competent. It has been deferred to the competent body.*

## Related

- [[mascots/M-0409|Ledger Snarl]] — presiding arbiter, Merge Tribunal; holds TRB-0001 open
- `reference/FREF-0932-TDC` — disposition codes used in this log
- `lorelog/LLG-0937-TITLE-DOUBLE-LEDGER` — originating matter, TRB-0006
