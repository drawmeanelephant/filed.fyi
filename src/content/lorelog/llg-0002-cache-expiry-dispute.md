---
title: "Contested Cache Expiry — ETag Contradiction Incident"
date: 2025-12-19
versionLabel: "Incident Epoch 4"
description: "Conflicting ETag headers issued by Uncacheable Ursula resulted in simultaneous claims of freshness and staleness for the same asset."
severity: warning
disposition: contested
resolution: appealed
classification: public
caseNumber: "LLG-0002"
filedBy: "Datalock Archivia"
filedAt: "Header Arbitration Division"
mascotRef: "uncacheable-ursula"
affectedSystems:
  - "CDN edge layer"
  - "browser cache negotiation"
  - "ETag registry"
relatedEntries:
  - "llg-0005-stale-content-echo"
escalationPath: "Cache Tribunal, Freshness Assessment Board"
tags:
  - cache-expiry
  - etag-conflict
  - header-dispute
  - contested-freshness
notes: "Ursula maintains the contradiction is intentional and constitutes 'valid ambiguity.' Appeal pending. The asset in question remains simultaneously fresh and stale in three known CDN regions."
---

Two ETag values were issued for the same versioned asset within a 400ms window. The first declared the resource fresh for 86,400 seconds. The second revoked freshness effective immediately. Both headers bear valid signatures.

Browser clients downstream of the incident received one or the other at apparent random, producing a bifurcated cache state across the user population. Approximately 43% of sessions loaded the prior version. All sessions reported the content was correct.

Uncacheable Ursula was summoned for testimony. She confirmed issuing both headers and declined to identify which was authoritative, stating: "Freshness is a feeling, not a timestamp."

The appeal is ongoing. No stale-while-revalidate directive has been issued pending resolution.
