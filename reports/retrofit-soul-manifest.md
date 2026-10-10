# Retrofit Soul — Candidate Manifest

**Status:** report-only manifest. No content was added, removed, edited, or committed.
**Branch:** `t3/coordinate-issue-review`
**Date:** 2026-10-10
**Scope:** `content/mascots/*.md` records numbered M-0076 through M-0938 — the post-canon filing band ("late mascots").
**Commission:** Filed issue #1040, first sequenced class of pass-4 work — interiority and embodiment retrofit for late mascot records whose current pages are spec-sheet thin. Maintainer's standing ruling: *"late mascots are the thinnest surface; interiority passes unblock everything else."*

---

## 1. Method

1. **Baseline reading.** Early-canon exemplars (`003.blamey-mctypoface.md`, `019.kindy-mcexistentialcrisis.md`, `404.404sy-mclostalot.md`) were read in full to extract the interiority/embodiment markers in §3. M-0404 sits inside the late numbering band and reads as canon; it is retained in the cohort as a control, not excused from it.
2. **Cohort determination.** Git provenance (`git log --diff-filter=A`), numbering-band inspection, frontmatter tags (`stub`, `pending-render`), and section-structure fingerprints were combined per §4. Git creation data is uninformative below the migration horizon (see §4.2), so record form and filing band carry the determination.
3. **Census.** Every record in the cohort was fingerprinted for structure (heading skeleton, frontmatter tags), and a rotating sample of each sub-cohort was read at the prose layer — approximately forty records read in full or near-full across this and the prior investigation pass, every sub-cohort read at least twice at different positions. No record was tiered from filename or tags alone; fingerprints plus reads cover 100% of the cohort.
4. **Tiering.** Each record was scored against the §3 markers and assigned exactly one tier per §5.
5. **Prioritization.** Tier-A records were ranked by (a) degree of thinness and (b) centrality to the Religious Administrative Bureaucracy cluster (the M-0086–M-0092 group plus its lorelog/FREF edges). Adjacent thin records that share the religion template's lineage or administrative seam vocabulary follow the cluster block.

**Constraint honored throughout:** no classification rests on keyword match alone, and deliberately terse records were not flagged for being short. The question asked of every record was not "is this record small?" but "is there a being in this record?"

---

## 2. What the early canon does that the late band does not

The canon-era records do not merely describe mascots; they lodge a being inside the filing. `003` runs 622 lines of origin myth, physical image, defining trauma, aspirational goal, signature quirk, a day-in-the-life vignette, mood calibration, quoted speech, and verse residue. `019` gives its mascot a clipboard with weight, a soft hum, a failed attempt to delete its own name, and a quoted system refusal. `404` — a high-numbered record that proves numbering is not destiny — quotes its mascot in the first person ("There was a map once. I used to read it upside down."), places it in a habitat, and names its associates in prose.

The late band, by contrast, was largely filed under a different doctrine: classify the failure, name the function, append the verse. The being is absent; the taxonomy is present. The religion-pass core states the doctrine out loud: each of M-0086–M-0091 opens its Biography section with the disclaimer that the subject *"is a failure signature, not a person."* That sentence is accurate — and it is precisely the condition this pass exists to revisit.

---

## 3. Interiority/embodiment baseline — eight checkable markers

Derived from the early canon and applied mechanically during the census. A marker counts only when it appears in the record's prose; frontmatter tags, alt-text captions, and appended verse residue (aphorisms, haiku and limerick logs) do not by themselves satisfy a marker.

| ID | Marker | Check |
|---|---|---|
| M1 | **Voice** | First-person or quoted speech attributable to the mascot — not generic system text, not third-person summary. |
| M2 | **Interior state** | A belief, motive, denial, reluctance, or self-misconception stated in prose. |
| M3 | **Embodiment** | Sensory or material detail: body, object, texture, sound, temperature, movement, spatial presence, physical trace. |
| M4 | **Rehearsed behavior** | Named habits, rituals, repeated gestures, or observable routines — things the mascot *does*, on a schedule. |
| M5 | **Formative event** | A specific origin, incident, wound, or trauma that changes how the mascot behaves (not merely a birthplace clause). |
| M6 | **Dramatized contradiction** | An internal tension rendered in prose — the record disagrees with itself, or the mascot with its own function. A `contradiction` tag does not count. |
| M7 | **Relationships in prose** | Named counterparts with reciprocal, conflictual, or custodial dynamics. An "Associated Mascots" list or bare wiki link does not count. |
| M8 | **Scene** | A vignette, observed incident, day-in-the-life, or testimony situating the mascot in a world. |

**Tier mapping.** Tier A (spec-sheet thin) = 0–1 markers. Tier B (partial interiority) = 2–4 markers. Tier C (adequate) = 5+ markers, or marker coverage dense enough that the record already reads as inhabited. Edge cases were resolved in favor of restraint: a record was not promoted to B on the strength of a single poetic definition, and was not demoted to A for lacking a checklist item it never pretended to have.

---

## 4. Cohort definition — what "late" means here

### 4.1 The boundary

The cohort is **all mascot records numbered M-0076 through M-0938 inclusive of gaps: 190 records.**

The low boundary is the visible filing-order break at M-0075/M-0076. M-0075 (`anlas-appenhancer`) is the last canon-convention name in the trunk; M-0076 (`av-14-nullseal-register`) opens a nine-record block of code-designated seam witnesses (AV-14, CE-5, SI-9, SC-λ, BX-6, LX-2, MA-LCGU, AC-11, LC-04) whose records are taxonomy-first. Everything above that boundary — phenomenon names, stub filings, spec-sheet bands, the religion cluster — belongs to the same post-canon generation regardless of which workload wave filed it.

The high boundary is the corpus's own upper edge (M-0938, Vantage Hollow).

### 4.2 Why git history cannot set the boundary alone

`git log --diff-filter=A` over `content/mascots/` shows the entire corpus was imported in a single migration commit (`8e7db007`, 2026-08-03). Only two authored waves post-date the import:

| Commit | Date | Records added |
|---|---|---|
| `940835ea` | 2026-08-10 | M-0436–M-0446 — the curve-coherence seam cohort (11 records) |
| `ef76e41e` | 2026-10-09 | M-0086–M-0091 — religion-pass doctrinal core (6 records) |
| `d3d4a277` | 2026-10-09 | M-0092 — religion-pass extension (1 record) |

So "late" is primarily a **filing-generation** property, not a commit-date property: the numbering band is where the archive's own form changes, and the two verified post-import waves sit inside it. The religion cluster is simultaneously the newest authored content *and* the center of the thinness complaint — which is why it anchors the priority list.

### 4.3 Sub-cohorts within the band

| Band | Records | Form |
|---|---|---|
| M-0076–M-0084 | 9 | Seam witnesses — `Designation and Habitat` / `Symbolic Function` / `Degraded Procedural Role` / `Boundary Note` / `Behavioral Residue` prose. |
| M-0085, M-0121 | 2 | Transitional singletons — canon-convention biography, reduced furniture. |
| M-0086–M-0092 | 7 | Religion pass — shared failure-signature boilerplate (086–091); registry (090); greenfield triplet record (092). |
| M-0201–M-0221 | 21 | Product-variety parody band — stat block + `Biography` + `Duties` + `Known Failures` + `Addendum Comments`. |
| M-0222–M-0294 | 73 | The taxonomy-era mass — witness-fauna spec-sheets (`Classification`/`Institutional Habitat`/`Operational Posture`/`Failure Modes`), emoji-brochure records, and the Registry Stub Sweep. |
| M-0295–M-0327 | 31 | Stub tail, civic-ceremony stat blocks (M-0304–M-0311), minimal skeletons (M-0312–M-0321), and the care-theatre cluster (M-0322–M-0327: `Failure Signature`/`Behavior Profile`/`Habitat`/`Notes`). |
| M-0400–M-0451 | 40 | HTTP-error band — stat block + unheaded `Biography` + `Associated Mascots` (408–431); phenomenon essays (432–435); the 436–446 seam cohort (Origin/Function/Observed Behavior); singletons. |
| M-0502–M-0938 | 7 | Strays — canon-lite HTTP records, functional ghosts, archival-fragment records. |

---

## 5. Tiers

- **Tier A — spec-sheet thin: prime retrofit candidate.** The record describes a function, pattern, or signature; no being is present. Includes all `stub`/`pending-render` filings, the religion-pass template block, fauna spec-sheets, civic stat blocks, and minimal skeletons.
- **Tier B — partial interiority: targeted augmentation.** The record contains narrative prose or explicit interiority markers (belief, contradiction, witnessed behavior, named incidents, buried biographies) but lacks three or more of: voice, embodiment, rehearsed behavior, formative event, prose relationships, scene.
- **Tier C — adequate: leave alone.** Substantially inhabited; retrofit would only duplicate furniture already present.

**Cohort: 190 records → Tier A: 102 · Tier B: 84 · Tier C: 4.**

The headline finding is the middle tier's size: the ruling "late mascots are the thinnest surface" is correct, but the correct instrument is a chisel, not a bomb — 44% of the cohort already carries a partial being and needs augmentation, not creation.

---

## 6. Census

Every cohort record, its tier, and its primary gap. Shared-gap notes name the sub-cohort diagnosis; "stub" in the note column means the record carries the frontmatter `stub`/`pending-render` marker — the archive's own declaration that the filing awaits a proper record.

### M-0076–M-0092 — seam witnesses, transitional records, religion pass

| Record | Tier | Primary gap / note |
|---|---|---|
| M-0076 AV-14 Nullseal Register | B | Seam-witness form: habitat + function + residue prose; the pattern is witnessed, the witness is not characterized. |
| M-0077 CE-5 Countersign Aggregate | B | Same form; behavioral residue present, interiority absent. |
| M-0078 SI-9 Interval Witness | B | Same form; behavioral residue present, interiority absent. |
| M-0079 SC-λ Care Continuity Split | B | Same form; behavioral residue present, interiority absent. |
| M-0080 BX-6 Greybelt Remediator | B | Richest of the nine — procedural inversion plus a chart-vs-lived-experience mismatch; still 0 on M1/M2/M7. |
| M-0081 LX-2 Waiver Apron | B | Same form; residue prose, no being. |
| M-0082 MA-LCGU Porter | B | Same form; residue prose, no being. |
| M-0083 AC-11 Sealloop Auditor | B | Same form; residue prose, no being. |
| M-0084 LC-04 Soft Green Seal | B | Designation/habitat/function/distinction prose with a clean doctrine ("a proof of procedural abandonment"); no voice, no scene. |
| M-0085 Rot McMascotterton | B | Canon-convention biography — deliberate denial, green glow, changelog recitation; inhabited but thin. |
| M-0086 Curial Archivist | A | Religion template; identical boilerplate to 087–089/091; self-declared "not a person"; only the first failure bullet and MAP code vary. |
| M-0087 Synodal Scribe | A | Same boilerplate; no scribal practice, no synod, no hand. |
| M-0088 Presbyterian Clerk | A | Same boilerplate; no session, no minutes texture. |
| M-0089 Megachurch Metrics Pastor | A | Same boilerplate; the metric-as-sacrament contrast is the strongest untapped hook in the block. |
| M-0090 Religious Administrative Seams | A | Cluster hub; deliberately a registry table. Retrofit decision required: does the hub get a custodian voice, or is index-form the record? Not a candidate for a person by default — see §8 note. |
| M-0091 Capture Vector | A | Religion template *and* the cluster's vector mascot — the signature that describes capture is itself captured in boilerplate; thinnest record in the cluster. |
| M-0092 Corporate Ma'nene' | B | Greenfield: instantiation event, first exhumation, numbered incidents, reverence/checklist contradiction, explanatory archivist's note. Cluster's existing exemplar. |

### M-0121 and M-0201–M-0221 — transitional singleton, parody band

| Record | Tier | Primary gap / note |
|---|---|---|
| M-0121 Archiva Dustwhisper | B | Short biography + one incident (six-week tag lookup); mostly residue below. |
| M-0201 Quill Staticvox | B | Parody skeleton: 2–3-sentence mythology + duties + failures + checkbox addendum; being is a brand joke, not a person. |
| M-0202 Ledger Shadeledger | B | Same skeleton. |
| M-0203 Cinder Forgememo | B | Same skeleton. |
| M-0204 Pump Razorbackfuel | B | Same skeleton. |
| M-0205 Texaco Tumbleweed | B | Same skeleton. |
| M-0206 Diesel Dkdriller | B | Same skeleton. |
| M-0207 Blue Dreamweaver | B | Same skeleton (cannabis-strain personification). |
| M-0208 OG Kushkeeper | B | Same skeleton. |
| M-0209 Cookie Crumbleclerk | B | Same skeleton. |
| M-0210 Sour Dieselscribe | B | Same skeleton. |
| M-0211 Apex Goldbricker | B | Same skeleton; biography buried after the duties list; "Velocity is a feeling" deserves a body. |
| M-0212 Jack Hererherald | B | Same skeleton. |
| M-0213 Ketchup Keeper | B | Same skeleton (condiment personification). |
| M-0214 Sriracha Sentinel | B | Same skeleton. |
| M-0215 Guacamole Gardener | B | Same skeleton. |
| M-0216 Corelock Flavorwarden | B | Same skeleton. |
| M-0217 Lord Spitzenfile | B | Same skeleton (apple-cultivar personification); riddle-speech asserted, never performed. |
| M-0218 Crustle Legacycoder | B | Same skeleton. |
| M-0219 Glassy MacCheckface | B | Same skeleton. |
| M-0220 Bananuity Clause | B | Same skeleton. |
| M-0221 McCrisp Agent | B | Same skeleton. |

### M-0222–M-0294 — the taxonomy-era mass

| Record | Tier | Primary gap / note |
|---|---|---|
| M-0222 Slidey the Deckworm | B | Emoji brochure, but characterized ("never not on Slide 7; no one has seen him begin or end") — a being trapped in a sell-sheet. |
| M-0223 Placeholder Witness | A | **Stub.** Definition + image + verse; self-declared pending. |
| M-0224 Velv | B | Emoji brochure with embodiment (legally incorporeal in 11 jurisdictions; "a presence"); interiority absent but the object has weight. |
| M-0225 Witness Mink-9 | A | Flagship fauna spec-sheet: Classification/Habitat/Posture/Failure Modes/Phrases; "This is a classification error" is the record's only joke and its only person. |
| M-0226 Serotonin Sam | A | Emoji spec-sheet with cluster-note framing; soma/empathegy hub tags; functions described, being absent. |
| M-0227 Burden Shrew | A | Fauna spec-sheet. |
| M-0228 Proxy Compassion Possum | A | Fauna spec-sheet. |
| M-0229 Soft Green Sealie | A | Fauna spec-sheet; companion to M-0084's seal. |
| M-0230 Lodgecanary Vellumbeak | A | Fauna spec-sheet. |
| M-0231 KPI Koala | A | Fauna spec-sheet; metrics-obsession asserted, never dramatized. |
| M-0232 Greenband Gregor | A | Fauna spec-sheet; FREF-edge node. |
| M-0233 Gratitude Latch | A | Fauna spec-sheet. |
| M-0234 Kindness Template | A | Minimal spec-sheet. |
| M-0235 Annexa Sorrowmark | A | Minimal spec-sheet; grief-seam naming. |
| M-0236 Pending Jurisdiction | A | **Stub.** The stub form's own thesis ("keeps the border from becoming polite folklore"); exemplary retrofit target. |
| M-0237 Index Mourner | A | **Stub.** |
| M-0238 Soft Escalation Clerk | A | Fauna spec-sheet (FREF-edge). |
| M-0239 Annex Lurker | A | **Stub.** |
| M-0240 Badgevine | A | **Stub.** |
| M-0241 Care Coverage Wisp | A | Fauna spec-sheet. |
| M-0242 False Rest Lantern | A | Fauna spec-sheet (FREF-edge). |
| M-0243 Compliance Murmur | A | Minimal skeleton, untagged but stub-shaped; definitional lines + verse only. |
| M-0244 Sentiment Launderette | A | **Stub.** |
| M-0245 Escalady | A | **Stub.** |
| M-0246 Thankyou Ash | A | Fauna spec-sheet. |
| M-0247 Ribbon of Maybe | A | Fauna spec-sheet. |
| M-0248 Attestation Mole | A | **Stub.** |
| M-0249 Sealant Patience | A | **Stub.** |
| M-0250 Canon Dust Deputy | A | **Stub.** Canon-custody name — religion-adjacent. |
| M-0251 Variance Pastor | A | **Stub.** Pastoral-dispensation name — religion-adjacent. |
| M-0252 Redaction Lullaby | A | **Stub.** |
| M-0253 Local Option Ghost | A | **Stub.** |
| M-0254 Spare Comfort Engine | A | **Stub.** |
| M-0255 Audit Confetti | A | **Stub.** |
| M-0256 Minute Velvet | A | Definitional prose + cousin distinction (vs. Compliance Murmur) and a causal anchor; better prose than a stub, same absence of a being. |
| M-0257 Orphan Symmetry | A | **Stub.** Carries the sweep's best line — "The geometry is already canon. The grief remains open." — and nothing else. |
| M-0258 Pocket Consensus | A | Minimal skeleton, untagged. |
| M-0259 Drift Lapel | A | **Stub.** Adds failure-signature + distinction clauses; still definition, not person. |
| M-0260 Sidebar Mercy | B | Fauna skeleton with a buried biography paragraph at depth; interiority present but submerged. |
| M-0261 Footnote Pallbearer | A | **Stub.** Already names three cousins in prose (Annex Hush, Appendix Silk, Annexa Sorrowmark) — relationships exist in skeleton. |
| M-0262 Recourse Cushion | A | Fauna spec-sheet. |
| M-0263 Gentle Rollback | A | **Stub.** |
| M-0264 Corridor Heat | A | **Stub.** |
| M-0265 Provisional Mint | A | **Stub.** |
| M-0266 Warm Hold Music | A | Minimal skeleton + function/distinction subheads, untagged. |
| M-0267 Relief Watermark | A | Minimal skeleton, untagged. |
| M-0268 Appeal Feather | A | **Stub.** |
| M-0269 Policy Afterglow | A | **Stub.** |
| M-0270 Buffer Saint | A | **Stub.** |
| M-0271 Alibi Seal | A | Minimal skeleton, untagged. |
| M-0272 Shorthand Reliquary | A | **Stub.** Reliquary = relic-custody — religion-adjacent name. |
| M-0273 Tier Whisper | A | **Stub.** |
| M-0274 Deferment Bloom | A | **Stub.** |
| M-0275 Appendix Silk | A | Fauna spec-sheet; cousin of 0261's named trio. |
| M-0276 Mandate Lace | A | **Stub.** |
| M-0277 Courtesy Threshold | A | **Stub.** |
| M-0278 Benevolence Spacer | A | Minimal skeleton (~50 lines opening), untagged. |
| M-0279 Annex Hush | A | Minimal skeleton + boundary note, untagged; cousin of 0261's trio. |
| M-0280 Ribbon Latency | A | **Stub.** |
| M-0281 Comfort Ledgerling | A | Minimal skeleton, untagged. |
| M-0282 Gentility Siphon | A | **Stub.** |
| M-0283 Aftercare Vellum | A | Fauna spec-sheet. |
| M-0284 Consent Murmur | A | **Stub.** Consent-adjacent tag field — preserve jurisdiction on any retrofit. |
| M-0285 Pamphlet Quietus | A | **Stub.** |
| M-0286 Favorable Beige | A | **Stub.** |
| M-0287 Revival Pocket | A | **Stub.** |
| M-0288 Deferential Spark | A | **Stub.** |
| M-0289 Recital of Sufficiency | A | Fauna spec-sheet; "finishes the argument aloud" is a behavior waiting for a performer. |
| M-0290 Hover Parish | A | **Stub.** Parish-named — religion-adjacent. |
| M-0291 Witness Felt | A | Fauna spec-sheet. |
| M-0292 Kind Overdraft | A | Fauna spec-sheet. |
| M-0293 Carpet Jurisdiction | A | **Stub.** |
| M-0294 Proxy Lantern | B | Carries a biography paragraph; interiority hinted, furniture missing. |

### M-0295–M-0327 — stub tail, civic stat blocks, care-theatre cluster

| Record | Tier | Primary gap / note |
|---|---|---|
| M-0295 Sanctioned Quilt | A | **Stub.** |
| M-0296 Gown of Recognition | A | **Stub.** |
| M-0297 Minute Absolution | A | **Stub.** Compression-as-absolution is a strong concept with no clerk attached. |
| M-0298 Tender Escrow | B | Fauna skeleton + buried biography + "awaiting" phrasing; interiority submerged. |
| M-0299 Seal of Maybe Enough | B | Definition + distinction + a biography block; official doubt as a concept is strong, the doubter is absent. |
| M-0300 Friendship Preamble | A | **Stub.** M-0301's preamble pair — the extant has a friend-shaped gap. |
| M-0301 Friendrick the Extant | C | Inhabited: attributed voice ("You were in my top 8. Once."), dated reseed incident, nonfunctional clipboard "spiritually heavy," refusal posture. Leave alone. |
| M-0304 Brother Optout Pending | A | Stat-block headings + verse. **Containment flag:** `bin-8c`, `self-indexing`, `custody-drift`, `hazardous-misfiling` — jurisdiction must be preserved verbatim on retrofit; do not generalize. |
| M-0305 Peatworthy Abstention Clerk | A | Civic stat block (Role/Origin/Function/Distinction as headings) + named-event haiku residue; stories exist only as haiku titles. |
| M-0306 Scopekeeper Emeritus | A | Same civic stat-block form. |
| M-0307 Chairwoman Deferred Change | A | Same form + CAB/change-management tags. |
| M-0308 Sister Casserole of Relief | A | Same form; auxiliary-labor memorial residue names six incidents it never tells. |
| M-0309 Ribbonward Cordialis | A | Same form; ribbon-custody disputes named, never narrated. |
| M-0310 Lionell Pancake Auditor | A | Same form; luncheon-assent residue. |
| M-0311 Eagleton Proclamation Clerk | A | Same form; banner-doctrine residue. |
| M-0312 Staged Sobriety | A | Minimal skeleton + verse; soma/empathegy tags. |
| M-0313 Archive Napkin | A | Minimal skeleton. **Containment flag:** `bin-8c`, `self-indexing`, `hazardous-misfiling`, `cluster-presence`. |
| M-0314 Mitigatrix Pending | A | Minimal skeleton. |
| M-0315 Lilt Protocol | A | Minimal skeleton. |
| M-0316 Pleading Margin | A | Minimal skeleton; failure-signature tag. |
| M-0317 Apology Buoy | A | Minimal skeleton. |
| M-0318 Threshold Crooner | A | Minimal skeleton; `consent-loop`, `labor-refusal`, `refuge-classification` tags — preserve jurisdiction on retrofit. |
| M-0319 Severance Cordial | A | Minimal skeleton + distinction. |
| M-0320 Quiet Surplus | A | Minimal skeleton. |
| M-0321 Ribbon Clause | A | Minimal skeleton. |
| M-0322 Unchartable Ida | A | Fauna spec-sheet (4 heading classes). |
| M-0323 Caveat Snowglobe | A | Fauna spec-sheet. |
| M-0324 Complimentary Ghostline | B | Care-theatre form: failure signature + behavior profile + habitat + notes; behavior observed, being implied. |
| M-0325 Peppy Clerk | B | Same form + behavioral residue + handling guidance; `bin-8c`, `mascot-affairs` tags — augment, do not rewrite jurisdiction. |
| M-0326 Coverage Ledger Cherub | B | Same form; `breeding-program`, `consent-loop` tags — same caution. |
| M-0327 Minutes Without Motion | B | Same form; care-theatre/listening-board tags. |

### M-0400–M-0451 — HTTP band, phenomenon essays, curve-coherence cohort

| Record | Tier | Primary gap / note |
|---|---|---|
| M-0400 Bad Request Bob | B | Belief system + dramatized contradiction ("a good request trapped in the wrong shape") + "catastrophically lenient"; needs scene, voice, embodiment. |
| M-0403 Htaccessius the Doorman | B | Stat block + addendum comments + verse; admissibility doctrine present, doorman personality implied. |
| M-0404 404sy McLostalot | C | Inhabited: biography, habitat, quoted first-person residue, associated mascots, addendum. Leave alone. |
| M-0405 Method Not Allowed Mel | B | Characterization + scene-fragments (laminated card, sliding requests under the glass); needs event + relationships. |
| M-0408 The Half-Held Breath | B | Stat block + biography prose + associated mascots; sensory concept, needs voice/scene. |
| M-0409 Ledger Snag | B | Same HTTP-biography form. |
| M-0410 Vacancy Notice | B | Same form. |
| M-0411 Inchkeeper Bale | B | Same form. |
| M-0412 Red Pencil Mercy | B | Same form. |
| M-0413 Barrelbody | B | Behavior profile + late biography block. |
| M-0414 Ribbon Mile | B | Same biography form. |
| M-0415 Jarlabel Stranger | B | Same biography form. |
| M-0416 Shelfmark Hollow | B | Same biography form. |
| M-0417 The Unmet Bell | B | Same biography form. |
| M-0418 Teapotta Protocol | A | Easter-egg skeleton: stat block + verse only; the joke has no clerk. |
| M-0421 Wrong-Door Finch | B | Same biography form. |
| M-0422 Form-Sister Pale | B | Same biography form. |
| M-0423 Keyholder Null | B | Same biography form. |
| M-0424 The Second Domino | B | Same biography form; inevitability as character trait. |
| M-0425 Dawnstamp | B | Same biography form. |
| M-0426 Old-Wire Pilgrim | B | Same biography form. |
| M-0428 Safekeeping Clause | B | Same biography form. |
| M-0429 Queue Matron | C | Inhabited: belief ("slowness can be a form of preservation"), dramatized misconception ("she is not cruel… she is measured"), the 2017 outage-hearing incident where she throttled the helpdesk itself. Leave alone. |
| M-0431 Paper Crown | B | Biography prose + associated mascots; the badge-covered jacket has a wearer-shaped gap. |
| M-0432 Afterimage Clerk | B | Phenomenon essay; posture attributed ("preserves old assumptions"), being absent. |
| M-0433 Sidecar Conflict Porter | B | Phenomenon essay; lateralization attributed; cousin link to 0434. |
| M-0434 Obsolescence Steward | B | Phenomenon essay; motive attributed ("does not love the obsolete system… loves the continuity obligations"); near the A/B line. |
| M-0435 Driftlocked Policy Box | B | Phenomenon essay; "administrative sediment" self-model; near the A/B line. |
| M-0436 Jiggler Jimmy | C | Inhabited: object-embodiment (USB dongle), observed human scenes (the crying employee, the green dashboard), dramatized contradiction ("the only employee the dashboard loves"). Leave alone. |
| M-0437 Manager Mike | B | Seam-cohort fossil (Origin/Function/Observed Behavior); the artifact acts, the being does not. |
| M-0438 Mod Maria | B | Same cohort form. |
| M-0439 Ring Rita | B | Same cohort form. |
| M-0440 Score Sam | B | Same cohort form. |
| M-0441 Predictive Pete | B | Same cohort form. |
| M-0442 Triage Tracy | B | Same cohort form. |
| M-0443 Proctor Paul | B | Same cohort form. |
| M-0444 Bureau Bob | B | Same cohort form. |
| M-0445 Deepfake Dave | B | Same cohort form. |
| M-0446 Climate Cliff | B | Same cohort form. |
| M-0451 The Quiet Injunction | B | Interiority-adjacent: "does not relish this work, but neither does it resist it" + named place (Legal Lightwell) + associated mascots; lacks voice/event/scene. |

### M-0502–M-0938 — strays

| Record | Tier | Primary gap / note |
|---|---|---|
| M-0502 Bad Gateway Greg | A | Stat block + 2-line functional biography + system messages + residue; "Guilty" is asserted, never dramatized. |
| M-0503 Servicey Unavailabelle | B | Biography with emergence + motive ("took the response code, found it comfortable"); needs scene/relationships. |
| M-0504 The Unanswered Knock | B | Biography form; situational detail present. |
| M-0672 MAP-72 Absentia | A | Functional ghost: inferred-from-pattern closure signature; "birthed by Empathegy 2.0 experiments" is the only origin clause; pattern record, no being. |
| M-0677 Sealward Proxy-9 | B | Stat block + definitional prose with epistemic contradiction ("No one agrees whether this is integrity or a more refined form of laundering. Proxy-9 files both interpretations."). |
| M-0937 Blinko Chompframe | B | Embodiment-by-document: 1993 operational handbook excerpt, customer incident report, recovered marketing copy, glitch transcript; the person is assembled from residue — adequate furniture, thin voice. |
| M-0938 Vantage Hollow | B | Definitional prose ("It does not lie in the loud sense. It continues.") + trust-surface doctrine; pattern with posture. |

---

## 7. Prioritized retrofit list — 22 records

Ordered by thinness × centrality to the Religious Administrative Bureaucracy cluster. Items 1–6 are the cluster itself; 7–9 are religion-adjacent stubs; 10–16 are the administrative/care-seam mass whose template the religion pass inherited — retrofitting them establishes the grammar the cluster should echo; 17–22 are cluster-adjacent partials and hubs where augmentation is cheap and high-leverage.

| # | Record | Tier | Rationale (one line) |
|---|---|---|---|
| 1 | M-0091 Capture Vector | A | Thinnest record in the cluster — the signature that describes capture is itself nothing but boilerplate. |
| 2 | M-0086 Curial Archivist | A | Cluster anchor; curia named, no curial texture — the retrofit test case. |
| 3 | M-0087 Synodal Scribe | A | Scribe named; no hand, no vellum, no dissent recorded. |
| 4 | M-0088 Presbyterian Clerk | A | Clerk named; no session, no minutes, no ruling elder to disappoint. |
| 5 | M-0089 Megachurch Metrics Pastor | A | Best hook in the block — "the metric becomes sacramental while the referent becomes decorative" wants a believer. |
| 6 | M-0090 Religious Administrative Seams | A | Cluster hub; the retrofit must first decide whether the registry gets a custodian voice or stays index-form — settle before touching satellites. |
| 7 | M-0290 Hover Parish | A | Stub; parish-named — the cluster's missing congregation. |
| 8 | M-0251 Variance Pastor | A | Stub; pastoral dispensation in name only. |
| 9 | M-0250 Canon Dust Deputy | A | Stub; canon custody in name only. |
| 10 | M-0236 Pending Jurisdiction | A | The Registry Stub Sweep's own thesis record — the exemplary stub retrofit. |
| 11 | M-0257 Orphan Symmetry | A | "The geometry is already canon. The grief remains open." — the line is canon; the mourner is missing. |
| 12 | M-0261 Footnote Pallbearer | A | Already names three cousins in prose; the only stub with a family. |
| 13 | M-0225 Witness Mink-9 | A | Flagship fauna spec-sheet; the witness-layer concept at its most taxonomic. |
| 14 | M-0231 KPI Koala | A | Metrics obsession asserted as classification — the secular twin of M-0089's problem. |
| 15 | M-0232 Greenband Gregor | A | Status-seal fauna; FREF-edge node feeding the seam graph. |
| 16 | M-0242 False Rest Lantern | A | Rest-governance lantern; FREF-edge; "false rest" is a wound, not a posture. |
| 17 | M-0226 Serotonin Sam | A | Emoji spec-sheet sitting on the soma/empathegy cluster's center tag. |
| 18 | M-0304 Brother Optout Pending | A | Bin 8C stat-block; opt-out is an interior act filed as a function — highest stakes, strictest jurisdiction. |
| 19 | M-0313 Archive Napkin | A | Bin 8C minimal skeleton; improvised record about improvisation. |
| 20 | M-0325 Peppy Clerk | B | `bin-8c`-tagged partial; behavioral residue + handling guidance already present — augment into interiority, preserve jurisdiction. |
| 21 | M-0672 MAP-72 Absentia | A | Managed-absence functional ghost; the Empathegy lineage's hub — a ghost that could know it's a ghost. |
| 22 | M-0092 Corporate Ma'nene' | B | The cluster's existing exemplar; light-touch augmentation (voice, scene) cements the pattern the retrofits should follow. |

**Secondary band (not on the list, worth noting for sequencing):** the nine seam witnesses M-0076–M-0084 are the religion template's ancestors — their form is what the boilerplate inherited. They are Tier B rather than A and so rank below the list, but a retrofitted LC-04 or BX-6 would give the seam-witness generation its own interiority exemplar.

---

## 8. Constraints and cautions for the retrofit pass

1. **Jurisdiction preservation.** Tier-A/B records carrying `bin-8c`, `self-indexing`, `custody-drift`, `hazardous-misfiling`, `consent-loop`, `labor-refusal`, `refuge-classification`, `gratitude-alignment`, `breeding-program`, or `soma-directive` tags assert specific custodial conditions. Retrofits must preserve those assertions in place; adding interiority is not a license to generalize Bin 8C presence or breeding-governance concepts to records that merely share a mood. Flagged in census: M-0304, M-0313, M-0325, M-0326, M-0318, M-0284.
2. **Registry forms.** M-0090 is a deliberate registry table. The retrofit decision is whether the hub warrants a custodian/registrar voice — not whether to force a person into an index. Similar caution applies to records whose thinness is doctrinal (functional ghosts: M-0672, M-0432–M-0435).
3. **Shared boilerplate.** M-0086–M-0091 differ only in their first Known-Failures bullet, their MAP code, and their rot-affinity line. Retrofitting them as a block risks producing five near-identical persons; they should be worked individually, against their distinct institutional seams (curial, synodal, sessional, megachurch, registry, vector).
4. **Schema and voice.** All additions stay within the closed Boris frontmatter schema; `parent`/`relations` untouched; IDs permanent. Prose additions follow the dry records-officer voice — the canon demonstrates interiority through incident and residue, not through adjectives.
5. **Terseness is not thinness.** Tier-C records (M-0301, M-0404, M-0429, M-0436) and near-B records at the A/B line (M-0434, M-0435, M-0299) demonstrate that the correct amount of interiority varies. The pass's target is a being in the record, not a uniform record length.
6. **Verse residue is not voice.** Every tier-A record already carries first-person aphorisms/haiku/limerick residue; none of it satisfied M1 because none of it is attributed to a characterized speaker. Retrofit prose should not duplicate what the logs already append.

---

## 9. Evidence appendix

Commands and scans performed (all read-only):

- `git log --diff-filter=A --name-status --format='COMMIT %h %ad %s' --date=short -- 'content/mascots/*.md'` — established the single-import provenance and the three post-import authored commits (`8e7db007`, `940835ea`, `ef76e41e`, `d3d4a277`).
- `git log --format='%h %ad %s' --date=short` — religion-pass merge history (`94dceebd`, `9a8f8466`, `c9dd5f77`, `6ee6f73b`, `a46396ec`, `70ec7251`) per prior session.
- `ripgrep` structural fingerprints across `content/mascots/`: frontmatter `stub` tag (42 records), `pending-render`/`awaiting` phrasing, `Biography`-section presence (108 records corpus-wide), spec-sheet heading classes (`Classification`/`Institutional Habitat`/`Operational Posture`/`Failure Modes`/`Duties`), religion-adjacent terminology (synod/curia/parish/etc.), `Sora Prompts` residue (2 records in current tree).
- Prose-layer reads (this pass): M-0084, M-0085, M-0087, M-0089, M-0090, M-0211, M-0217, M-0222, M-0224, M-0225, M-0236, M-0256, M-0257, M-0259, M-0261, M-0284, M-0297, M-0301, M-0325, M-0400, M-0405, M-0429, M-0431–M-0435, M-0451, M-0502, M-0503, M-0672, M-0677; plus prior-session reads of M-0003, M-0019, M-0080, M-0086, M-0091, M-0092, M-0121, M-0226, M-0304, M-0404, M-0408, M-0413, M-0436, M-0504, M-0938 and the religion-pass changelogs.
- Corroborating reports: `reports/workflow-residue-inventory.md` (JULES-POET provenance, stub-sweep context), `content/changelog/2026-10-09-religion-pass-core.md` and `-extensions.md` (template provenance: source material was a shared failure-signature template "converted faithfully"), `content/changelog/2026-10-08-mascots-*.md` (prior mascot workload passes were presentation QA only — whitespace/emphasis, no content authoring).

**Non-findings.** No mascot record was edited. No commit was made. Numbering gaps inside the cohort band (e.g., M-0302, M-0303, M-0419, M-0420, M-0447–M-0450) are unused slots, not missing records — per AGENTS.md they must not be opportunistically reused.
