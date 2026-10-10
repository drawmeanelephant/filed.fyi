---
title: "Exhumation Fitness Rubric — Re-Dressing Assessment v1.1"
id: reference/FREF-0929-EFR
parent: reference
status: published
tags: ["reference", "religious-administration", "exhumation-protocol", "scoring-rubric", "managed-absence"]
relations: [relates_to=reference/FREF-0923-MANENE-PROTOCOL, relates_to=mascots/M-0092, relates_to=lorelog/LLG-0939-CORPORATE-MANENE]
---

# Exhumation Fitness Rubric — Re-Dressing Assessment v1.1

### Re-Dressing Assessment Rubric v1.1

For use by the Exhumation Office at re-dressing.  
Score before the procession, not after; the procession does not improve the record.

---

| Dimension | Weight | Full Score Condition | Partial Score Condition | Disqualifying Condition |
|---|---|---|---|---|
| **Shroud Integrity** | 30% | frontmatter parses under the current schema; closed key set intact | parses under a prior shroud version; keys readable | unclosed or unknown keys; a shroud applied to the wrong record |
| **Metadata Currency** | 25% | tags drawn from the living taxonomy; `status` states what the record is | deprecated tags present; status readable | tags assert states the record does not occupy |
| **Relation Liveness** | 25% | every `relations` edge resolves to an extant record | edges resolve to archived records only | edges to deleted IDs; the dead writing to the dead |
| **Conduct at Procession** | 20% | record walked the lorelog without incident | residue corrected by note during the walk | metadata contradicted live systems en route |

---

### Score interpretation

- **90–100 — REANIMATION CANDIDATE**  
  Eligible for promotion to active status: new `parent`, new `status`.
  Enters the pool logged in [[reference/FREF-0921-BPL]].

- **70–89 — REBURIED, UPDATED**  
  Returned to managed absence with a refreshed shroud and corrected
  paperwork. The standard outcome; most records score here.

- **50–69 — REBURIED, AS FOUND**  
  Paperwork notes what could not be corrected. The record goes back
  as it came out, plus one row in the calendar.

- **30–49 — DISPLAY REVIEW**  
  Assessed for the Ancestors section: visible, not active. The officer
  decides whether visibility would constitute a service.

- **Below 30 — DISSOLUTION REVIEW**  
  The officer files whether the record survived re-dressing. Its ID
  is retained; its condition is a separate entry.

---

### Staff guidance on Dissolution Review

Dissolution is not a ruling that the record was false, or that its
absence goes unmourned.

**It is a ruling that the re-dressing failed the record.**

The office files the ID, files the flag, and files the condition
separately, because the archive has learned that retaining an identity
is not the same service as retaining a record.

> **Exhumation Officer's note:** *The rubric does not ask whether the record wished to be exhumed. Consent fields were trialled in v1.0 and retired. Every record answered the same way: silently, and by standing where it was put.*

## Related

- [[reference/FREF-0923-MANENE-PROTOCOL|Exhumation Protocol]] — governing protocol; outcome codes of record
- [[mascots/M-0092|Corporate Ma'nene']] — scoring officer
- [[lorelog/LLG-0939-CORPORATE-MANENE|LLG-0939]] — first scored cycle
- `reference/FREF-0921-BPL` — reanimation pool of record
