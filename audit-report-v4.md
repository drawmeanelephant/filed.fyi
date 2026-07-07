# Poetry Alignment Audit Report

Generated: 2026-07-07T12:07:47.588Z

## Summary

| Metric | Count |
|--------|-------|
| Total poems audited | 1633 |
| ✅ PASS (resolves to parent) | 895 |
| 🔴 ORPHAN (no parent found) | 506 |
| 💀 DEAD_REF (ref doesn't match) | 14 |
| ⚠️ UNCLAIMED (lorelog exists but doesn't claim) | 214 |
| 🟡 AMBIGUOUS (multiple parents) | 4 |

## Per-Collection Breakdown

| Collection | Total | PASS | ORPHAN | DEAD_REF | UNCLAIMED | AMBIGUOUS |
|------------|-------|------|--------|----------|-----------|-----------|
| haikus | 563 | 328 | 142 | 13 | 79 | 1 |
| limericks | 534 | 338 | 116 | 1 | 77 | 2 |
| aphorisms | 536 | 229 | 248 | 0 | 58 | 1 |

## Non-Passing Poems

| File | Status | Refs | Parent Found | Issues |
|------|--------|------|-------------|--------|
| `hai-040-pngbert-flatly` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-256-minute-velvet` | AMBIGUOUS | minute-velvet, 256.minute-velvet | 256.minute-velvet, 256.apex-goldbricker | Refs [minute-velvet, 256.minute-velvet] match 2 different mascots: 256.minute-velvet, 256.apex-goldbricker |
| `hai-FFP-0380` | DEAD_REF | (none) | — | Poem declares relatedLorelog=""FFP-0380"" but no such lorelog exists |
| `hai-FFP-0381` | DEAD_REF | (none) | — | Poem declares relatedLorelog=""FFP-0381"" but no such lorelog exists |
| `hai-FFP-0382` | DEAD_REF | (none) | — | Poem declares relatedLorelog=""FFP-0382"" but no such lorelog exists |
| `hai-FFP-0383` | DEAD_REF | (none) | — | Poem declares relatedLorelog=""FFP-0383"" but no such lorelog exists |
| `hai-FFP-0384` | DEAD_REF | (none) | — | Poem declares relatedLorelog=""FFP-0384"" but no such lorelog exists |
| `hai-LLG-0405-MEL` | UNCLAIMED | (none) | LLG-0405-MEL | Poem declares relatedLorelog=""LLG-0405-MEL"" and lorelog(s) "LLG-0405-MEL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0408-DTS-DEP` | UNCLAIMED | (none) | LLG-0408-DTS-DEP | Poem declares relatedLorelog=""LLG-0408-DTS-DEP"" and lorelog(s) "LLG-0408-DTS-DEP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0409-IEL` | UNCLAIMED | (none) | LLG-0409-IEL | Poem declares relatedLorelog=""LLG-0409-IEL"" and lorelog(s) "LLG-0409-IEL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0410-BWS` | UNCLAIMED | (none) | LLG-0410-BWS | Poem declares relatedLorelog=""LLG-0410-BWS"" and lorelog(s) "LLG-0410-BWS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0411-RRC` | UNCLAIMED | (none) | LLG-0411-RRC | Poem declares relatedLorelog=""LLG-0411-RRC"" and lorelog(s) "LLG-0411-RRC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0414-WAD` | UNCLAIMED | (none) | LLG-0414-WAD | Poem declares relatedLorelog=""LLG-0414-WAD"" and lorelog(s) "LLG-0414-WAD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0422-SCP` | UNCLAIMED | (none) | LLG-0422-SCP | Poem declares relatedLorelog=""LLG-0422-SCP"" and lorelog(s) "LLG-0422-SCP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0427-RAC` | UNCLAIMED | (none) | LLG-0427-RAC | Poem declares relatedLorelog=""LLG-0427-RAC"" and lorelog(s) "LLG-0427-RAC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0430-HBR` | UNCLAIMED | (none) | LLG-0430-HBR | Poem declares relatedLorelog=""LLG-0430-HBR"" and lorelog(s) "LLG-0430-HBR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0441-TSR` | UNCLAIMED | (none) | LLG-0441-TSR | Poem declares relatedLorelog=""LLG-0441-TSR"" and lorelog(s) "LLG-0441-TSR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0819-K` | UNCLAIMED | (none) | LLG-0819-K | Poem declares relatedLorelog=""LLG-0819-K"" and lorelog(s) "LLG-0819-K" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0864-WRC` | UNCLAIMED | (none) | LLG-0864-WRC | Poem declares relatedLorelog=""LLG-0864-WRC"" and lorelog(s) "LLG-0864-WRC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0870-EAS` | UNCLAIMED | (none) | LLG-0870-EAS | Poem declares relatedLorelog=""LLG-0870-EAS"" and lorelog(s) "LLG-0870-EAS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0871-ASF` | UNCLAIMED | (none) | LLG-0871-ASF | Poem declares relatedLorelog=""LLG-0871-ASF"" and lorelog(s) "LLG-0871-ASF" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-LLG-0890-EPS` | UNCLAIMED | (none) | LLG-0890-EPS | Poem declares relatedLorelog=""LLG-0890-EPS"" and lorelog(s) "LLG-0890-EPS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-OCV-0409-TSC` | UNCLAIMED | (none) | OCV-0409-TSC | Poem declares relatedLorelog=""OCV-0409-TSC"" and lorelog(s) "OCV-0409-TSC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-acknowledgment-deletion-bias` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-assurance-language` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-boundary-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-care-event-lifecycle` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-coma-observation-transcript` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-containment-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-continuity-theatre` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ffp-0385-progress-without-work` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0020-maps` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0030-avsg` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0040-avdn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0050-avoc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0060-acmn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0070-aopt` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0080-srbp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0090-srbg` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0100-dacb` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0110-dacs` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0120-dcsc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0130-ocvh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0140-ocvs` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0150-mapa` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0160-maii` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0170-lgef` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0180-tdci` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0190-slhr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0195-fwru` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0200-cbac` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0210-cbhn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0220-ccmp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0230-cmal` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0240-cmrc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0250-prdm` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0260-bmdh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0270-bmdc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0280-cbnd` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0290-ocvh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0300-clob` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0310-clop` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0320-cseq` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0330-tsac` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0340-tsab` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0350-bhds` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0360-sast` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0370-dcst` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0380-lbkp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0400-metr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0410-sclb` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0420-ancl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0430-easp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0500-egyx` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0510-akdb` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0520-estl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0530-anxr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0540-anxt` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0550-apan` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0560-adjc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0560-asar` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0570-apcr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0570-celc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0580-cmps` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0590-cpsp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0600-ccph` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0610-cthr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0620-cwsh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0630-cwlv` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0635-wwlv` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0636-wcr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0640-dcer` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0650-elfr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0660-glng` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0670-gtcap` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0680-gtlm` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0690-gbhm` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0700-hiar` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0710-ikfr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0720-itbd` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0730-lcob` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0740-moc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0750-pxcm` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0760-rscl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0770-rhkd` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0780-rsfl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0790-rlif` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0800-scrl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0810-slnt` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0820-iels` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0820-spc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0821-avtl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0822-actn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0822-elra` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0823-tsrt` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0824-ovaa` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0825-vhcn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0830-symc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0840-rwrr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0840-teh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0850-vard` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0860-vex` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0870-wtsl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-fref-0880-wprt` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-frontmatter-integrity-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-interpretive-density-report` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-llg-0002-ced` | UNCLAIMED | (none) | LLG-0002-CED | Poem declares relatedLorelog=""LLG-0002-CED"" and lorelog(s) "LLG-0002-CED" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0003-svr` | UNCLAIMED | (none) | LLG-0003-SVR | Poem declares relatedLorelog=""LLG-0003-SVR"" and lorelog(s) "LLG-0003-SVR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0004-smd` | UNCLAIMED | (none) | LLG-0004-SMD | Poem declares relatedLorelog=""LLG-0004-SMD"" and lorelog(s) "LLG-0004-SMD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0007-coma` | UNCLAIMED | (none) | LLG-0007-COMA | Poem declares relatedLorelog=""LLG-0007-COMA"" and lorelog(s) "LLG-0007-COMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0019-coma` | UNCLAIMED | (none) | LLG-0019-COMA | Poem declares relatedLorelog=""LLG-0019-COMA"" and lorelog(s) "LLG-0019-COMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0027-b` | UNCLAIMED | (none) | LLG-0027-B | Poem declares relatedLorelog=""LLG-0027-B"" and lorelog(s) "LLG-0027-B" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0040-c` | UNCLAIMED | (none) | LLG-0040-C | Poem declares relatedLorelog=""LLG-0040-C"" and lorelog(s) "LLG-0040-C" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0051-e` | UNCLAIMED | (none) | LLG-0051-E | Poem declares relatedLorelog=""LLG-0051-E"" and lorelog(s) "LLG-0051-E" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0072-soma` | UNCLAIMED | (none) | LLG-0072-SOMA | Poem declares relatedLorelog=""LLG-0072-SOMA"" and lorelog(s) "LLG-0072-SOMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0103-coma` | UNCLAIMED | (none) | LLG-0103-COMA | Poem declares relatedLorelog=""LLG-0103-COMA"" and lorelog(s) "LLG-0103-COMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0114-soma` | UNCLAIMED | (none) | LLG-0114-SOMA | Poem declares relatedLorelog=""LLG-0114-SOMA"" and lorelog(s) "LLG-0114-SOMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0217-cntr` | UNCLAIMED | (none) | LLG-0217-CNTR | Poem declares relatedLorelog=""LLG-0217-CNTR"" and lorelog(s) "LLG-0217-CNTR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0300-sc-x` | UNCLAIMED | (none) | LLG-0300-SC-X | Poem declares relatedLorelog=""LLG-0300-SC-X"" and lorelog(s) "LLG-0300-SC-X" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0302-cntr` | UNCLAIMED | (none) | LLG-0302-CNTR | Poem declares relatedLorelog=""LLG-0302-CNTR"" and lorelog(s) "LLG-0302-CNTR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0316-mbr` | UNCLAIMED | (none) | LLG-0316-MBR | Poem declares relatedLorelog=""LLG-0316-MBR"" and lorelog(s) "LLG-0316-MBR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0317-rls` | UNCLAIMED | (none) | LLG-0317-RLS | Poem declares relatedLorelog=""LLG-0317-RLS"" and lorelog(s) "LLG-0317-RLS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0318-sro` | UNCLAIMED | (none) | LLG-0318-SRO | Poem declares relatedLorelog=""LLG-0318-SRO"" and lorelog(s) "LLG-0318-SRO" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0319-pas` | UNCLAIMED | (none) | LLG-0319-PAS | Poem declares relatedLorelog=""LLG-0319-PAS"" and lorelog(s) "LLG-0319-PAS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0320-frk` | UNCLAIMED | (none) | LLG-0320-FRK | Poem declares relatedLorelog=""LLG-0320-FRK"" and lorelog(s) "LLG-0320-FRK" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0321-drt` | UNCLAIMED | (none) | LLG-0321-DRT | Poem declares relatedLorelog=""LLG-0321-DRT"" and lorelog(s) "LLG-0321-DRT" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0322-ftd` | UNCLAIMED | (none) | LLG-0322-FTD | Poem declares relatedLorelog=""LLG-0322-FTD"" and lorelog(s) "LLG-0322-FTD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0323-asd` | UNCLAIMED | (none) | LLG-0323-ASD | Poem declares relatedLorelog=""LLG-0323-ASD"" and lorelog(s) "LLG-0323-ASD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0325-ort` | UNCLAIMED | (none) | LLG-0325-ORT | Poem declares relatedLorelog=""LLG-0325-ORT"" and lorelog(s) "LLG-0325-ORT" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0326-dcb` | UNCLAIMED | (none) | LLG-0326-DCB | Poem declares relatedLorelog=""LLG-0326-DCB"" and lorelog(s) "LLG-0326-DCB" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0327-avr` | UNCLAIMED | (none) | LLG-0327-AVR | Poem declares relatedLorelog=""LLG-0327-AVR"" and lorelog(s) "LLG-0327-AVR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0328-mec` | UNCLAIMED | (none) | LLG-0328-MEC | Poem declares relatedLorelog=""LLG-0328-MEC"" and lorelog(s) "LLG-0328-MEC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0329-oir` | UNCLAIMED | (none) | LLG-0329-OIR | Poem declares relatedLorelog=""LLG-0329-OIR"" and lorelog(s) "LLG-0329-OIR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0330-tde` | UNCLAIMED | (none) | LLG-0330-TDE | Poem declares relatedLorelog=""LLG-0330-TDE"" and lorelog(s) "LLG-0330-TDE" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0331-tpi` | UNCLAIMED | (none) | LLG-0331-TPI | Poem declares relatedLorelog=""LLG-0331-TPI"" and lorelog(s) "LLG-0331-TPI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0332-scd` | UNCLAIMED | (none) | LLG-0332-SCD | Poem declares relatedLorelog=""LLG-0332-SCD"" and lorelog(s) "LLG-0332-SCD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0333-meo` | UNCLAIMED | (none) | LLG-0333-MEO | Poem declares relatedLorelog=""LLG-0333-MEO"" and lorelog(s) "LLG-0333-MEO" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0334-csi` | UNCLAIMED | (none) | LLG-0334-CSI | Poem declares relatedLorelog=""LLG-0334-CSI"" and lorelog(s) "LLG-0334-CSI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0375-breed` | UNCLAIMED | (none) | LLG-0375-BREED | Poem declares relatedLorelog=""LLG-0375-BREED"" and lorelog(s) "LLG-0375-BREED" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0376-breed-gov` | UNCLAIMED | (none) | LLG-0376-BREED-GOV | Poem declares relatedLorelog=""LLG-0376-BREED-GOV"" and lorelog(s) "LLG-0376-BREED-GOV" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0379-robot-memo` | UNCLAIMED | (none) | LLG-0379-ROBOT-MEMO | Poem declares relatedLorelog=""LLG-0379-ROBOT-MEMO"" and lorelog(s) "LLG-0379-ROBOT-MEMO" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0401-glp` | UNCLAIMED | (none) | LLG-0401-GLP | Poem declares relatedLorelog=""LLG-0401-GLP"" and lorelog(s) "LLG-0401-GLP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0402-gmp` | UNCLAIMED | (none) | LLG-0402-GMP | Poem declares relatedLorelog=""LLG-0402-GMP"" and lorelog(s) "LLG-0402-GMP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0403-wba` | UNCLAIMED | (none) | LLG-0403-WBA | Poem declares relatedLorelog=""LLG-0403-WBA"" and lorelog(s) "LLG-0403-WBA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0404-uplc` | UNCLAIMED | (none) | LLG-0404-UPLC | Poem declares relatedLorelog=""LLG-0404-UPLC"" and lorelog(s) "LLG-0404-UPLC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0405-dev` | UNCLAIMED | (none) | LLG-0405-DEV | Poem declares relatedLorelog=""LLG-0405-DEV"" and lorelog(s) "LLG-0405-DEV" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0811-eg` | UNCLAIMED | (none) | LLG-0811-EG | Poem declares relatedLorelog=""LLG-0811-EG"" and lorelog(s) "LLG-0811-EG" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0812-ctm` | UNCLAIMED | (none) | LLG-0812-CTM | Poem declares relatedLorelog=""LLG-0812-CTM"" and lorelog(s) "LLG-0812-CTM" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0820-mcr` | UNCLAIMED | (none) | LLG-0820-MCR | Poem declares relatedLorelog=""LLG-0820-MCR"" and lorelog(s) "LLG-0820-MCR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0822-rki` | UNCLAIMED | (none) | LLG-0822-RKI | Poem declares relatedLorelog=""LLG-0822-RKI"" and lorelog(s) "LLG-0822-RKI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0824-gbc` | UNCLAIMED | (none) | LLG-0824-GBC | Poem declares relatedLorelog=""LLG-0824-GBC"" and lorelog(s) "LLG-0824-GBC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0833-gta` | UNCLAIMED | (none) | LLG-0833-GTA | Poem declares relatedLorelog=""LLG-0833-GTA"" and lorelog(s) "LLG-0833-GTA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0840-rcl` | UNCLAIMED | (none) | LLG-0840-RCL | Poem declares relatedLorelog=""LLG-0840-RCL"" and lorelog(s) "LLG-0840-RCL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0842-pcl` | UNCLAIMED | (none) | LLG-0842-PCL | Poem declares relatedLorelog=""LLG-0842-PCL"" and lorelog(s) "LLG-0842-PCL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0846-sip` | UNCLAIMED | (none) | LLG-0846-SIP | Poem declares relatedLorelog=""LLG-0846-SIP"" and lorelog(s) "LLG-0846-SIP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0851-csi` | UNCLAIMED | (none) | LLG-0851-CSI | Poem declares relatedLorelog=""LLG-0851-CSI"" and lorelog(s) "LLG-0851-CSI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0857-wli` | UNCLAIMED | (none) | LLG-0857-WLI | Poem declares relatedLorelog=""LLG-0857-WLI"" and lorelog(s) "LLG-0857-WLI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0861-acs` | UNCLAIMED | (none) | LLG-0861-ACS | Poem declares relatedLorelog=""LLG-0861-ACS"" and lorelog(s) "LLG-0861-ACS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0861-arc` | UNCLAIMED | (none) | LLG-0861-ARC | Poem declares relatedLorelog=""LLG-0861-ARC"" and lorelog(s) "LLG-0861-ARC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0861-fpp` | UNCLAIMED | (none) | LLG-0861-FPP | Poem declares relatedLorelog=""LLG-0861-FPP"" and lorelog(s) "LLG-0861-FPP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0861-frl` | UNCLAIMED | (none) | LLG-0861-FRL | Poem declares relatedLorelog=""LLG-0861-FRL"" and lorelog(s) "LLG-0861-FRL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-0863-mas` | UNCLAIMED | (none) | LLG-0863-MAS | Poem declares relatedLorelog=""LLG-0863-MAS"" and lorelog(s) "LLG-0863-MAS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-bhdss-toast` | DEAD_REF | bhdss | — | Refs [bhdss] did not match any mascot via isMascotMatch() |
| `hai-llg-ia-8c-annex` | DEAD_REF | peppy-clerk | — | Refs [peppy-clerk] did not match any mascot via isMascotMatch(); Closest partial matches: 432.afterimage-clerk (tokens: clerk); 238.soft-escalation-clerk (tokens: clerk); 305.peatworthy-abstention-clerk (tokens: clerk) |
| `hai-llg-ia-8c-drift-01` | UNCLAIMED | (none) | LLG-IA-8C-DRIFT-01 | Poem declares relatedLorelog=""LLG-IA-8C-DRIFT-01"" and lorelog(s) "LLG-IA-8C-DRIFT-01" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-ia-8c-drift-02` | UNCLAIMED | (none) | LLG-IA-8C-DRIFT-02 | Poem declares relatedLorelog=""LLG-IA-8C-DRIFT-02"" and lorelog(s) "LLG-IA-8C-DRIFT-02" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-ma-8c-peppy-01` | DEAD_REF | peppy-clerk | — | Refs [peppy-clerk] did not match any mascot via isMascotMatch(); Closest partial matches: 432.afterimage-clerk (tokens: clerk); 238.soft-escalation-clerk (tokens: clerk); 305.peatworthy-abstention-clerk (tokens: clerk) |
| `hai-llg-ma8c-06` | DEAD_REF | peppy-clerk | — | Refs [peppy-clerk] did not match any mascot via isMascotMatch(); Closest partial matches: 432.afterimage-clerk (tokens: clerk); 238.soft-escalation-clerk (tokens: clerk); 305.peatworthy-abstention-clerk (tokens: clerk) |
| `hai-llg-sys-8-reindex-01` | UNCLAIMED | (none) | LLG-SYS-8-REINDEX-01 | Poem declares relatedLorelog=""LLG-SYS-8-REINDEX-01"" and lorelog(s) "LLG-SYS-8-REINDEX-01" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-llg-sys-8-reindex-02` | DEAD_REF | peppy-clerk | — | Refs [peppy-clerk] did not match any mascot via isMascotMatch(); Closest partial matches: 432.afterimage-clerk (tokens: clerk); 238.soft-escalation-clerk (tokens: clerk); 305.peatworthy-abstention-clerk (tokens: clerk) |
| `hai-llg-tdcip-overcoh` | DEAD_REF | tdcip-lkg | — | Refs [tdcip-lkg] did not match any mascot via isMascotMatch() |
| `hai-map-inc-14` | UNCLAIMED | (none) | map-inc-14 | Poem declares relatedLorelog=""LLG-MAP-INC-14"" and lorelog(s) "map-inc-14" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-mascot-anchoring-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-metrics-of-care` | DEAD_REF | (none) | — | Poem declares relatedLorelog=""LLG-METRICS-OF-CARE"" but no such lorelog exists |
| `hai-ocv-intake-log` | UNCLAIMED | (none) | OCV-INTAKE-LOG | Poem declares relatedLorelog=""LLG-OCV-INTAKE-LOG"" and lorelog(s) "OCV-INTAKE-LOG" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-poetry-audit-report` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-recovered-procedural-artifacts-sticker-pack` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-adjacent-correctness` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-artifact-provenance-ceremonial-use` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-assurance-coordination-minutes` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-avd-internal-notes` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-avd-optics-coordination` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-avd-style-guide` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-benevolence-metrics-desk` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-bmd-calibration-session` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-cbacll` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-cbhn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-ccmpg` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-civic-band-legend` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-cmadn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-cmrcscc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-cross-lodge-briefing` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-cross-lodge-orientation` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-cross-system-equivalency-card` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-dac-band-management` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-dac-session-extract` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-dac-success-class-card` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-easp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-fref-0810-dsl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-fref-0815-map` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-fwru` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-lbp-01` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-m-a-maii` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-ocv-handling-notes` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-ref-ocv-screening-checklist` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-replacement-without-release-index-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-replacement-without-release-routing-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-rest-shaped-feelings` | DEAD_REF | (none) | — | Poem declares relatedLorelog=""LLG-rest-shaped-feelings"" but no such lorelog exists |
| `hai-rot-in-db` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-srb-session-notes` | UNCLAIMED | (none) | SRB-SESSION-NOTES | Poem declares relatedLorelog=""LLG-SRB-SESSION-NOTES"" and lorelog(s) "SRB-SESSION-NOTES" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `hai-trust-records-after-proof-decay` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-trust-surface-crosslinks` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-trust-surface-index-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-trust-surface-routing-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `hai-tsa-session-schedule` | UNCLAIMED | (none) | TSA-SESSION-SCHEDULE | Poem declares relatedLorelog=""LLG-TSA-SESSION-SCHEDULE"" and lorelog(s) "TSA-SESSION-SCHEDULE" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-FREF-0500-EGYX` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0510-AKDB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0520-ESTL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0530-ANXR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0540-ANXT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0550-APAN` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0560-ASAR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0570-CELC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0580-CMPS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0590-CPSP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0600-CCPH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0610-CTHR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0620-CWSH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0630-CWLV` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0640-DCER` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0650-ELFR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0660-GLNG` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0670-GTCAP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0680-GTLM` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0690-GBHM` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0700-HIAR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0710-IKFR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0720-ITBD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0730-LCOB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0740-MOC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0750-PXCM` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0760-RSCL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0770-RHKD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0780-RSFL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0790-RLIF` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0800-SCRL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0810-SLNT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0820-SPC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0830-SYMC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0840-TEH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0850-VARD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0860-VEX` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0870-WTSL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-FREF-0880-WPRT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `LIM-LLG-0002-CED` | UNCLAIMED | (none) | LLG-0002-CED | Poem declares relatedLorelog=""LLG-0002-CED"" and lorelog(s) "LLG-0002-CED" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0003-SVR` | UNCLAIMED | (none) | LLG-0003-SVR | Poem declares relatedLorelog=""LLG-0003-SVR"" and lorelog(s) "LLG-0003-SVR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0004-SMD` | UNCLAIMED | (none) | LLG-0004-SMD | Poem declares relatedLorelog=""LLG-0004-SMD"" and lorelog(s) "LLG-0004-SMD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0007-COMA` | UNCLAIMED | (none) | LLG-0007-COMA | Poem declares relatedLorelog=""LLG-0007-COMA"" and lorelog(s) "LLG-0007-COMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0019-COMA` | UNCLAIMED | (none) | LLG-0019-COMA | Poem declares relatedLorelog=""LLG-0019-COMA"" and lorelog(s) "LLG-0019-COMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0027-B` | UNCLAIMED | (none) | LLG-0027-B | Poem declares relatedLorelog=""LLG-0027-B"" and lorelog(s) "LLG-0027-B" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0040-C` | UNCLAIMED | (none) | LLG-0040-C | Poem declares relatedLorelog=""LLG-0040-C"" and lorelog(s) "LLG-0040-C" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0051-E` | UNCLAIMED | (none) | LLG-0051-E | Poem declares relatedLorelog=""LLG-0051-E"" and lorelog(s) "LLG-0051-E" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0072-SOMA` | UNCLAIMED | (none) | LLG-0072-SOMA | Poem declares relatedLorelog=""LLG-0072-SOMA"" and lorelog(s) "LLG-0072-SOMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0103-COMA` | UNCLAIMED | (none) | LLG-0103-COMA | Poem declares relatedLorelog=""LLG-0103-COMA"" and lorelog(s) "LLG-0103-COMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0114-SOMA` | UNCLAIMED | (none) | LLG-0114-SOMA | Poem declares relatedLorelog=""LLG-0114-SOMA"" and lorelog(s) "LLG-0114-SOMA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0217-CNTR` | UNCLAIMED | (none) | LLG-0217-CNTR | Poem declares relatedLorelog=""LLG-0217-CNTR"" and lorelog(s) "LLG-0217-CNTR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0300-SC-X` | UNCLAIMED | (none) | LLG-0300-SC-X | Poem declares relatedLorelog=""LLG-0300-SC-X"" and lorelog(s) "LLG-0300-SC-X" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0302-CNTR` | UNCLAIMED | (none) | LLG-0302-CNTR | Poem declares relatedLorelog=""LLG-0302-CNTR"" and lorelog(s) "LLG-0302-CNTR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0316-MBR` | UNCLAIMED | (none) | LLG-0316-MBR | Poem declares relatedLorelog=""LLG-0316-MBR"" and lorelog(s) "LLG-0316-MBR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0317-RLS` | UNCLAIMED | (none) | LLG-0317-RLS | Poem declares relatedLorelog=""LLG-0317-RLS"" and lorelog(s) "LLG-0317-RLS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0318-SRO` | UNCLAIMED | (none) | LLG-0318-SRO | Poem declares relatedLorelog=""LLG-0318-SRO"" and lorelog(s) "LLG-0318-SRO" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0319-PAS` | UNCLAIMED | (none) | LLG-0319-PAS | Poem declares relatedLorelog=""LLG-0319-PAS"" and lorelog(s) "LLG-0319-PAS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0320-FRK` | UNCLAIMED | (none) | LLG-0320-FRK | Poem declares relatedLorelog=""LLG-0320-FRK"" and lorelog(s) "LLG-0320-FRK" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0321-DRT` | UNCLAIMED | (none) | LLG-0321-DRT | Poem declares relatedLorelog=""LLG-0321-DRT"" and lorelog(s) "LLG-0321-DRT" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0322-FTD` | UNCLAIMED | (none) | LLG-0322-FTD | Poem declares relatedLorelog=""LLG-0322-FTD"" and lorelog(s) "LLG-0322-FTD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0323-ASD` | UNCLAIMED | (none) | LLG-0323-ASD | Poem declares relatedLorelog=""LLG-0323-ASD"" and lorelog(s) "LLG-0323-ASD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0323-LC04` | UNCLAIMED | (none) | LLG-0323-LC04 | Poem declares relatedLorelog=""LLG-0323-LC04"" and lorelog(s) "LLG-0323-LC04" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0325-ORT` | UNCLAIMED | (none) | LLG-0325-ORT | Poem declares relatedLorelog=""LLG-0325-ORT"" and lorelog(s) "LLG-0325-ORT" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0326-DCB` | UNCLAIMED | (none) | LLG-0326-DCB | Poem declares relatedLorelog=""LLG-0326-DCB"" and lorelog(s) "LLG-0326-DCB" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0327-AVR` | UNCLAIMED | (none) | LLG-0327-AVR | Poem declares relatedLorelog=""LLG-0327-AVR"" and lorelog(s) "LLG-0327-AVR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0328-MEC` | UNCLAIMED | (none) | LLG-0328-MEC | Poem declares relatedLorelog=""LLG-0328-MEC"" and lorelog(s) "LLG-0328-MEC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0329-OIR` | UNCLAIMED | (none) | LLG-0329-OIR | Poem declares relatedLorelog=""LLG-0329-OIR"" and lorelog(s) "LLG-0329-OIR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0330-TDE` | UNCLAIMED | (none) | LLG-0330-TDE | Poem declares relatedLorelog=""LLG-0330-TDE"" and lorelog(s) "LLG-0330-TDE" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0331-TPI` | UNCLAIMED | (none) | LLG-0331-TPI | Poem declares relatedLorelog=""LLG-0331-TPI"" and lorelog(s) "LLG-0331-TPI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0332-SCD` | UNCLAIMED | (none) | LLG-0332-SCD | Poem declares relatedLorelog=""LLG-0332-SCD"" and lorelog(s) "LLG-0332-SCD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0333-MEO` | UNCLAIMED | (none) | LLG-0333-MEO | Poem declares relatedLorelog=""LLG-0333-MEO"" and lorelog(s) "LLG-0333-MEO" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0334-CSI` | UNCLAIMED | (none) | LLG-0334-CSI | Poem declares relatedLorelog=""LLG-0334-CSI"" and lorelog(s) "LLG-0334-CSI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0341-LME` | UNCLAIMED | (none) | LLG-0341-LME | Poem declares relatedLorelog=""LLG-0341-LME"" and lorelog(s) "LLG-0341-LME" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0375-BREED` | UNCLAIMED | (none) | LLG-0375-BREED | Poem declares relatedLorelog=""LLG-0375-BREED"" and lorelog(s) "LLG-0375-BREED" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0376-BREED-GOV` | UNCLAIMED | (none) | LLG-0376-BREED-GOV | Poem declares relatedLorelog=""LLG-0376-BREED-GOV"" and lorelog(s) "LLG-0376-BREED-GOV" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0379-ROBOT-MEMO` | UNCLAIMED | (none) | LLG-0379-ROBOT-MEMO | Poem declares relatedLorelog=""LLG-0379-ROBOT-MEMO"" and lorelog(s) "LLG-0379-ROBOT-MEMO" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0393-RBR` | UNCLAIMED | (none) | LLG-0393-RBR | Poem declares relatedLorelog=""LLG-0393-RBR"" and lorelog(s) "LLG-0393-RBR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0400-TRIAD` | AMBIGUOUS | 005.bricky-goldbricksworth, 019.kindy-mcexistentialcrisis | 005.bricky-goldbricksworth, 019.kindy-mcexistentialcrisis | Refs [005.bricky-goldbricksworth, 019.kindy-mcexistentialcrisis] match 2 different mascots: 005.bricky-goldbricksworth, 019.kindy-mcexistentialcrisis |
| `LIM-LLG-0811-EG` | UNCLAIMED | (none) | LLG-0811-EG | Poem declares relatedLorelog=""LLG-0811-EG"" and lorelog(s) "LLG-0811-EG" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0812-CTM` | UNCLAIMED | (none) | LLG-0812-CTM | Poem declares relatedLorelog=""LLG-0812-CTM"" and lorelog(s) "LLG-0812-CTM" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0820-MCR` | UNCLAIMED | (none) | LLG-0820-MCR | Poem declares relatedLorelog=""LLG-0820-MCR"" and lorelog(s) "LLG-0820-MCR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0822-RKI` | UNCLAIMED | (none) | LLG-0822-RKI | Poem declares relatedLorelog=""LLG-0822-RKI"" and lorelog(s) "LLG-0822-RKI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0824-GBC` | UNCLAIMED | (none) | LLG-0824-GBC | Poem declares relatedLorelog=""LLG-0824-GBC"" and lorelog(s) "LLG-0824-GBC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0833-GTA` | UNCLAIMED | (none) | LLG-0833-GTA | Poem declares relatedLorelog=""LLG-0833-GTA"" and lorelog(s) "LLG-0833-GTA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0840-RCL` | UNCLAIMED | (none) | LLG-0840-RCL | Poem declares relatedLorelog=""LLG-0840-RCL"" and lorelog(s) "LLG-0840-RCL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0842-PCL` | UNCLAIMED | (none) | LLG-0842-PCL | Poem declares relatedLorelog=""LLG-0842-PCL"" and lorelog(s) "LLG-0842-PCL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0846-SIP` | UNCLAIMED | (none) | LLG-0846-SIP | Poem declares relatedLorelog=""LLG-0846-SIP"" and lorelog(s) "LLG-0846-SIP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0851-CSI` | UNCLAIMED | (none) | LLG-0851-CSI | Poem declares relatedLorelog=""LLG-0851-CSI"" and lorelog(s) "LLG-0851-CSI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0857-WLI` | UNCLAIMED | (none) | LLG-0857-WLI | Poem declares relatedLorelog=""LLG-0857-WLI"" and lorelog(s) "LLG-0857-WLI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0861-ACS` | UNCLAIMED | (none) | LLG-0861-ACS | Poem declares relatedLorelog=""LLG-0861-ACS"" and lorelog(s) "LLG-0861-ACS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0861-ARC` | UNCLAIMED | (none) | LLG-0861-ARC | Poem declares relatedLorelog=""LLG-0861-ARC"" and lorelog(s) "LLG-0861-ARC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0861-FRL` | UNCLAIMED | (none) | LLG-0861-FRL | Poem declares relatedLorelog=""LLG-0861-FRL"" and lorelog(s) "LLG-0861-FRL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-0863-MAS` | UNCLAIMED | (none) | LLG-0863-MAS | Poem declares relatedLorelog=""LLG-0863-MAS"" and lorelog(s) "LLG-0863-MAS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-BHDSS-TOAST` | UNCLAIMED | (none) | LLG-BHDSS-TOAST | Poem declares relatedLorelog=""LLG-BHDSS-TOAST"" and lorelog(s) "LLG-BHDSS-TOAST" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-CODEX-SANDBOX-RODEO` | DEAD_REF | (none) | — | Poem declares relatedLorelog=""LLG-CODEX-SANDBOX-RODEO"" but no such lorelog exists |
| `LIM-LLG-IA-8C-DRIFT-01` | UNCLAIMED | (none) | LLG-IA-8C-DRIFT-01 | Poem declares relatedLorelog=""LLG-IA-8C-DRIFT-01"" and lorelog(s) "LLG-IA-8C-DRIFT-01" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-IA-8C-DRIFT-02` | UNCLAIMED | (none) | LLG-IA-8C-DRIFT-02 | Poem declares relatedLorelog=""LLG-IA-8C-DRIFT-02"" and lorelog(s) "LLG-IA-8C-DRIFT-02" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-SYS-8-REINDEX-01` | UNCLAIMED | (none) | LLG-SYS-8-REINDEX-01 | Poem declares relatedLorelog=""LLG-SYS-8-REINDEX-01"" and lorelog(s) "LLG-SYS-8-REINDEX-01" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `LIM-LLG-TDCIP-OVERCOH` | UNCLAIMED | (none) | LLG-TDCIP-OVERCOH | Poem declares relatedLorelog=""LLG-TDCIP-OVERCOH"" and lorelog(s) "LLG-TDCIP-OVERCOH" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-FFP-0380` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-FFP-0381` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-FFP-0382` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-FFP-0383` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-FFP-0384` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-LLG-0408-DTS-DEP` | UNCLAIMED | (none) | LLG-0408-DTS-DEP | Poem declares relatedLorelog=""LLG-0408-DTS-DEP"" and lorelog(s) "LLG-0408-DTS-DEP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0409-IEL` | UNCLAIMED | (none) | LLG-0409-IEL | Poem declares relatedLorelog=""LLG-0409-IEL"" and lorelog(s) "LLG-0409-IEL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0410-BWS` | UNCLAIMED | (none) | LLG-0410-BWS | Poem declares relatedLorelog=""LLG-0410-BWS"" and lorelog(s) "LLG-0410-BWS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0411-RRC` | UNCLAIMED | (none) | LLG-0411-RRC | Poem declares relatedLorelog=""LLG-0411-RRC"" and lorelog(s) "LLG-0411-RRC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0414-WAD` | UNCLAIMED | (none) | LLG-0414-WAD | Poem declares relatedLorelog=""LLG-0414-WAD"" and lorelog(s) "LLG-0414-WAD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0422-SCP` | UNCLAIMED | (none) | LLG-0422-SCP | Poem declares relatedLorelog=""LLG-0422-SCP"" and lorelog(s) "LLG-0422-SCP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0427-RAC` | UNCLAIMED | (none) | LLG-0427-RAC | Poem declares relatedLorelog=""LLG-0427-RAC"" and lorelog(s) "LLG-0427-RAC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0430-HBR` | UNCLAIMED | (none) | LLG-0430-HBR | Poem declares relatedLorelog=""LLG-0430-HBR"" and lorelog(s) "LLG-0430-HBR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0441-TSR` | UNCLAIMED | (none) | LLG-0441-TSR | Poem declares relatedLorelog=""LLG-0441-TSR"" and lorelog(s) "LLG-0441-TSR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0819-K` | UNCLAIMED | (none) | LLG-0819-K | Poem declares relatedLorelog=""LLG-0819-K"" and lorelog(s) "LLG-0819-K" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0864-WRC` | UNCLAIMED | (none) | LLG-0864-WRC | Poem declares relatedLorelog=""LLG-0864-WRC"" and lorelog(s) "LLG-0864-WRC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0870-EAS` | UNCLAIMED | (none) | LLG-0870-EAS | Poem declares relatedLorelog=""LLG-0870-EAS"" and lorelog(s) "LLG-0870-EAS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0871-ASF` | UNCLAIMED | (none) | LLG-0871-ASF | Poem declares relatedLorelog=""LLG-0871-ASF"" and lorelog(s) "LLG-0871-ASF" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-LLG-0890-EPS` | UNCLAIMED | (none) | LLG-0890-EPS | Poem declares relatedLorelog=""LLG-0890-EPS"" and lorelog(s) "LLG-0890-EPS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-OCV-0409-TSC` | UNCLAIMED | (none) | OCV-0409-TSC | Poem declares relatedLorelog=""OCV-0409-TSC"" and lorelog(s) "OCV-0409-TSC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-OCV-INTAKE-LOG` | UNCLAIMED | (none) | OCV-INTAKE-LOG | Poem declares relatedLorelog=""OCV-INTAKE-LOG"" and lorelog(s) "OCV-INTAKE-LOG" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-SRB-SESSION-NOTES` | UNCLAIMED | (none) | SRB-SESSION-NOTES | Poem declares relatedLorelog=""SRB-SESSION-NOTES"" and lorelog(s) "SRB-SESSION-NOTES" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-TSA-SESSION-SCHEDULE` | UNCLAIMED | (none) | TSA-SESSION-SCHEDULE | Poem declares relatedLorelog=""TSA-SESSION-SCHEDULE"" and lorelog(s) "TSA-SESSION-SCHEDULE" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-assurance-drift` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-boundary-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-coma-observation-transcript` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-containment-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-ffp-0385-progress-without-work` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0020-maps` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0030-avsg` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0040-avdn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0050-avoc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0060-acmn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0070-aopt` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0080-srbp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0090-srbg` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0100-dacb` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0110-dacs` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0120-dcsc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0130-ocvh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0140-ocvs` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0150-mapa` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0160-maii` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0170-lgef` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0180-tdci` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0190-slhr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0195-fwru` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0200-cbac` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0210-cbhn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0220-ccmp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0230-cmal` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0240-cmrc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0250-prdm` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0260-bmdh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0270-bmdc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0280-cbnd` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0290-ocvh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0300-clob` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0310-clop` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0320-cseq` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0330-tsac` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0340-tsab` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0350-bhds` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0360-sast` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0370-dcst` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0380-lbkp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0400-metr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0410-sclb` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0420-ancl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0430-easp` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0560-adjc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0570-apcr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0635-wwlv` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0636-wcr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0810-dsl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0815-map` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0820-iels` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0821-avtl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0822-actn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0822-elra` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0823-tsrt` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0824-ovaa` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0825-vhcn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-fref-0840-rwrr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-frontmatter-integrity-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-interpretive-density-report` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-map-inc-14` | UNCLAIMED | (none) | map-inc-14 | Poem declares relatedLorelog=""LLG-MAP-INC-14"" and lorelog(s) "map-inc-14" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `lim-mascot-anchoring-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-minute-velvet` | AMBIGUOUS | 256.minute-velvet | 256.apex-goldbricker, 256.minute-velvet | Refs [256.minute-velvet] match 2 different mascots: 256.apex-goldbricker, 256.minute-velvet |
| `lim-poetry-audit-report` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-recovered-procedural-artifacts-sticker-pack` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-replacement-without-release-index-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-replacement-without-release-routing-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-trust-records-after-proof-decay` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-trust-surface-crosslinks` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-trust-surface-index-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `lim-trust-surface-routing-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-019.kindy-mcexistentialcrisis` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-037.winona-crashingtonmd` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-222.slidey-deckworm` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-256.minute-velvet` | AMBIGUOUS | 256.minute-velvet | 256.apex-goldbricker, 256.minute-velvet | Refs [256.minute-velvet] match 2 different mascots: 256.apex-goldbricker, 256.minute-velvet |
| `APH-409.ledger-snag` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-419.misdirected-envoy` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-420.hush-registry` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-427.ritual-ash` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-430.aftermessage` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-504.unanswered-knock` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-ASSURANCE-DRIFT-LIMERICKS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-DS-404-ALPHA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0020-MAPS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0030-AVSG` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0040-AVDN` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0050-AVOC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0060-ACMN` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0070-AOPT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0080-SRBP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0090-SRBG` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0100-DACB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0110-DACS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0120-DCSC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0130-OCVH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0140-OCVS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0150-MAPA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0160-MAII` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0170-LGEF` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0180-TDCI` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0190-SLHR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0195-FWRU` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0200-CBAC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0210-CBHN` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0220-CCMP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0230-CMAL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0240-CMRC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0250-PRDM` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0260-BMDH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0270-BMDC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0280-CBND` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0300-CLOB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0310-CLOP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0320-CSEQ` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0330-TSAC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0340-TSAB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0350-BHDS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0360-SAST` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0370-DCST` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0380-LBKP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0410-SCLB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0420-ANCL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0430-EASP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0500-EGYX` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0510-AKDB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0520-ESTL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0530-ANXR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0540-ANXT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0550-APAN` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0560-ASAR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0570-CELC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0580-CMPS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0590-CPSP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0600-CCPH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0610-CTHR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0620-CWSH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0630-CWLV` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0640-DCER` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0650-ELFR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0660-GLNG` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0670-GTCAP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0680-GTLM` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0690-GBHM` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0700-HIAR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0710-IKFR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0720-ITBD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0730-LCOB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0740-MOC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0750-PXCM` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0760-RSCL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0770-RHKD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0780-RSFL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0790-RLIF` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0800-SCRL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0810-SLNT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0820-SPC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0830-SYMC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0840-TEH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0850-VARD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0860-VEX` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0870-WTSL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-FREF-0880-WPRT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0001-NAV` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0002-CED` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0003-SVR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0004-SMD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0007-COMA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0012-A` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0019-COMA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0020-COMA19-PBC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0027-B` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0040-C` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0051-E` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0052-MFX` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0072-SOMA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0088-B` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0103-COMA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0114-SOMA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0115-TNS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0217-CNTR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0218-FSD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0220-UIS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0223-EFA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0226-SUPR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0230-HYG` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0244-FSC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0300-SC-X` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0302-CNTR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0311-SRA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0316-LC22` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0316-MBR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0317-RLS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0318-SRO` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0319-PAS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0320-FRK` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0321-DRT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0322-FTD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0323-ASD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0323-LC04` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0324-MAP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0325-ORT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0326-DCB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0326-DXS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0327-AVA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0327-AVR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0328-MEC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0329-OIR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0330-TDE` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0331-TPI` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0332-SCD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0333-MEO` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0334-CSI` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0336-CSE` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0338-SBI` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0339-SIRC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0375-BREED` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0376-BREED-GOV` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0377-GRAT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0378-WFA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0379-ROBOT-MEMO` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0380-MATCH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0381-OPTOUT` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0382-BPD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0383-RAW` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0384-CIR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0385-CEB` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0385-SED` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0386-LODGE-MERGE` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0387-SURV-NOP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0388-EC-ORDER` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0389-AKL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0389-MQM` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0390-HAP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0390-KCL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0391-LAA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0391-RCD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0392-RCS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0392-SGL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0393-BDA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0393-RBR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0394-PRS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0395-MSS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0396-MSP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0397-SBF` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0398-CCO` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0400-SCAS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0400-TRIAD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0401-GLP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0401-SCAS-ECHO` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0402-FSR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0402-GMP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0403-CWR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0403-WBA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0404-DCP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0404-UPLC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0405-DEV` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0405-SAC` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0406-FSD` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0407-SSP` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0408-AH1` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0409-PRE` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-040X-ANLAS` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-04XX-CLIN-404` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0811-EG` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0820-MCR` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0821-SCL` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-0833-GTA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-BHDSS-TOAST` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-CLIN-COMP-KAIZEN` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-CREDITS-GTA` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-DMAIC-RITE` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-EL-0x7E` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-IA-8C-ANNEX` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-IA-8C-DRIFT-01` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-IA-8C-DRIFT-02` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-MA-8C-PEPPY-01` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-MA8C-06` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-SYS-8-REINDEX-01` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-SYS-8-REINDEX-02` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-LLG-TDCIP-OVERCOH` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-OCV-INTAKE-LOG` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-SRB-SESSION-NOTES` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-TSA-SESSION-SCHEDULE` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-coma-observation-transcript` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `APH-map-inc-14` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-417-progress-posture` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-FFP-0380` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-FFP-0381` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-FFP-0382` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-FFP-0383` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-FFP-0384` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-LLG-0340-BPO` | UNCLAIMED | (none) | LLG-0340-BPO | Poem declares relatedLorelog=""LLG-0340-BPO"" and lorelog(s) "LLG-0340-BPO" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0341-LME` | UNCLAIMED | (none) | LLG-0341-LME | Poem declares relatedLorelog=""LLG-0341-LME"" and lorelog(s) "LLG-0341-LME" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0350-DOGE-CHARTER` | UNCLAIMED | (none) | LLG-0350-DOGE-CHARTER | Poem declares relatedLorelog=""LLG-0350-DOGE-CHARTER"" and lorelog(s) "LLG-0350-DOGE-CHARTER" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0351-DOGE-INTAKE` | UNCLAIMED | (none) | LLG-0351-DOGE-INTAKE | Poem declares relatedLorelog=""LLG-0351-DOGE-INTAKE"" and lorelog(s) "LLG-0351-DOGE-INTAKE" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0352-DOGE-RUBRIC` | UNCLAIMED | (none) | LLG-0352-DOGE-RUBRIC | Poem declares relatedLorelog=""LLG-0352-DOGE-RUBRIC"" and lorelog(s) "LLG-0352-DOGE-RUBRIC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0354-DOGE-EDGE-CASES` | UNCLAIMED | (none) | LLG-0354-DOGE-EDGE-CASES | Poem declares relatedLorelog=""LLG-0354-DOGE-EDGE-CASES"" and lorelog(s) "LLG-0354-DOGE-EDGE-CASES" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0355-GEX-2R` | UNCLAIMED | (none) | LLG-0355-GEX-2R | Poem declares relatedLorelog=""LLG-0355-GEX-2R"" and lorelog(s) "LLG-0355-GEX-2R" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0356-DOGE-MEMO-FEELINGS` | UNCLAIMED | (none) | LLG-0356-DOGE-MEMO-FEELINGS | Poem declares relatedLorelog=""LLG-0356-DOGE-MEMO-FEELINGS"" and lorelog(s) "LLG-0356-DOGE-MEMO-FEELINGS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0357-DOGE-RID` | UNCLAIMED | (none) | LLG-0357-DOGE-RID | Poem declares relatedLorelog=""LLG-0357-DOGE-RID"" and lorelog(s) "LLG-0357-DOGE-RID" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0358-DOGE-W3` | UNCLAIMED | (none) | LLG-0358-DOGE-W3 | Poem declares relatedLorelog=""LLG-0358-DOGE-W3"" and lorelog(s) "LLG-0358-DOGE-W3" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0359-DOGE-AFTERCARE` | UNCLAIMED | (none) | LLG-0359-DOGE-AFTERCARE | Poem declares relatedLorelog=""LLG-0359-DOGE-AFTERCARE"" and lorelog(s) "LLG-0359-DOGE-AFTERCARE" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0360-RAGE-CHARTER` | UNCLAIMED | (none) | LLG-0360-RAGE-CHARTER | Poem declares relatedLorelog=""LLG-0360-RAGE-CHARTER"" and lorelog(s) "LLG-0360-RAGE-CHARTER" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0361-DOGE-STAMP-DRIFT` | UNCLAIMED | (none) | LLG-0361-DOGE-STAMP-DRIFT | Poem declares relatedLorelog=""LLG-0361-DOGE-STAMP-DRIFT"" and lorelog(s) "LLG-0361-DOGE-STAMP-DRIFT" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0362-RAGE-EXTRACTION` | UNCLAIMED | (none) | LLG-0362-RAGE-EXTRACTION | Poem declares relatedLorelog=""LLG-0362-RAGE-EXTRACTION"" and lorelog(s) "LLG-0362-RAGE-EXTRACTION" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0363-RAGE-MISIDENTIFICATION` | UNCLAIMED | (none) | LLG-0363-RAGE-MISIDENTIFICATION | Poem declares relatedLorelog=""LLG-0363-RAGE-MISIDENTIFICATION"" and lorelog(s) "LLG-0363-RAGE-MISIDENTIFICATION" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0364-RAGE-BAIT-TAXONOMY` | UNCLAIMED | (none) | LLG-0364-RAGE-BAIT-TAXONOMY | Poem declares relatedLorelog=""LLG-0364-RAGE-BAIT-TAXONOMY"" and lorelog(s) "LLG-0364-RAGE-BAIT-TAXONOMY" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0365-BAIT-B2A` | UNCLAIMED | (none) | LLG-0365-BAIT-B2A | Poem declares relatedLorelog=""LLG-0365-BAIT-B2A"" and lorelog(s) "LLG-0365-BAIT-B2A" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0366-BAIT-B4A` | UNCLAIMED | (none) | LLG-0366-BAIT-B4A | Poem declares relatedLorelog=""LLG-0366-BAIT-B4A"" and lorelog(s) "LLG-0366-BAIT-B4A" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0367-BAIT-B3A` | UNCLAIMED | (none) | LLG-0367-BAIT-B3A | Poem declares relatedLorelog=""LLG-0367-BAIT-B3A"" and lorelog(s) "LLG-0367-BAIT-B3A" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0368-RAGE-AQ` | UNCLAIMED | (none) | LLG-0368-RAGE-AQ | Poem declares relatedLorelog=""LLG-0368-RAGE-AQ"" and lorelog(s) "LLG-0368-RAGE-AQ" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0369-DOGE-SWAB` | UNCLAIMED | (none) | LLG-0369-DOGE-SWAB | Poem declares relatedLorelog=""LLG-0369-DOGE-SWAB"" and lorelog(s) "LLG-0369-DOGE-SWAB" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0370-XEV` | UNCLAIMED | (none) | LLG-0370-XEV | Poem declares relatedLorelog=""LLG-0370-XEV"" and lorelog(s) "LLG-0370-XEV" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0371-BAIT-B2B` | UNCLAIMED | (none) | LLG-0371-BAIT-B2B | Poem declares relatedLorelog=""LLG-0371-BAIT-B2B"" and lorelog(s) "LLG-0371-BAIT-B2B" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0372-BAIT-B5` | UNCLAIMED | (none) | LLG-0372-BAIT-B5 | Poem declares relatedLorelog=""LLG-0372-BAIT-B5"" and lorelog(s) "LLG-0372-BAIT-B5" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0373-DOGE-W5` | UNCLAIMED | (none) | LLG-0373-DOGE-W5 | Poem declares relatedLorelog=""LLG-0373-DOGE-W5"" and lorelog(s) "LLG-0373-DOGE-W5" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0374-DOGE-LA` | UNCLAIMED | (none) | LLG-0374-DOGE-LA | Poem declares relatedLorelog=""LLG-0374-DOGE-LA"" and lorelog(s) "LLG-0374-DOGE-LA" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0399-OCS` | UNCLAIMED | (none) | LLG-0399-OCS | Poem declares relatedLorelog=""LLG-0399-OCS"" and lorelog(s) "LLG-0399-OCS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0400-CMA-TSP` | UNCLAIMED | (none) | LLG-0400-CMA-TSP | Poem declares relatedLorelog=""LLG-0400-CMA-TSP"" and lorelog(s) "LLG-0400-CMA-TSP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0405-MEL` | UNCLAIMED | (none) | LLG-0405-MEL | Poem declares relatedLorelog=""LLG-0405-MEL"" and lorelog(s) "LLG-0405-MEL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0408-DTS-DEP` | UNCLAIMED | (none) | LLG-0408-DTS-DEP | Poem declares relatedLorelog=""LLG-0408-DTS-DEP"" and lorelog(s) "LLG-0408-DTS-DEP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0409-IEL` | UNCLAIMED | (none) | LLG-0409-IEL | Poem declares relatedLorelog=""LLG-0409-IEL"" and lorelog(s) "LLG-0409-IEL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0410-BWS` | UNCLAIMED | (none) | LLG-0410-BWS | Poem declares relatedLorelog=""LLG-0410-BWS"" and lorelog(s) "LLG-0410-BWS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0411-RRC` | UNCLAIMED | (none) | LLG-0411-RRC | Poem declares relatedLorelog=""LLG-0411-RRC"" and lorelog(s) "LLG-0411-RRC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0414-WAD` | UNCLAIMED | (none) | LLG-0414-WAD | Poem declares relatedLorelog=""LLG-0414-WAD"" and lorelog(s) "LLG-0414-WAD" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0422-SCP` | UNCLAIMED | (none) | LLG-0422-SCP | Poem declares relatedLorelog=""LLG-0422-SCP"" and lorelog(s) "LLG-0422-SCP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0427-RAC` | UNCLAIMED | (none) | LLG-0427-RAC | Poem declares relatedLorelog=""LLG-0427-RAC"" and lorelog(s) "LLG-0427-RAC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0430-HBR` | UNCLAIMED | (none) | LLG-0430-HBR | Poem declares relatedLorelog=""LLG-0430-HBR"" and lorelog(s) "LLG-0430-HBR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0441-TSR` | UNCLAIMED | (none) | LLG-0441-TSR | Poem declares relatedLorelog=""LLG-0441-TSR"" and lorelog(s) "LLG-0441-TSR" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0812-CTM` | UNCLAIMED | (none) | LLG-0812-CTM | Poem declares relatedLorelog=""LLG-0812-CTM"" and lorelog(s) "LLG-0812-CTM" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0819-K` | UNCLAIMED | (none) | LLG-0819-K | Poem declares relatedLorelog=""LLG-0819-K"" and lorelog(s) "LLG-0819-K" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0822-RKI` | UNCLAIMED | (none) | LLG-0822-RKI | Poem declares relatedLorelog=""LLG-0822-RKI"" and lorelog(s) "LLG-0822-RKI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0824-GBC` | UNCLAIMED | (none) | LLG-0824-GBC | Poem declares relatedLorelog=""LLG-0824-GBC"" and lorelog(s) "LLG-0824-GBC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0840-RCL` | UNCLAIMED | (none) | LLG-0840-RCL | Poem declares relatedLorelog=""LLG-0840-RCL"" and lorelog(s) "LLG-0840-RCL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0842-PCL` | UNCLAIMED | (none) | LLG-0842-PCL | Poem declares relatedLorelog=""LLG-0842-PCL"" and lorelog(s) "LLG-0842-PCL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0846-SIP` | UNCLAIMED | (none) | LLG-0846-SIP | Poem declares relatedLorelog=""LLG-0846-SIP"" and lorelog(s) "LLG-0846-SIP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0851-CSI` | UNCLAIMED | (none) | LLG-0851-CSI | Poem declares relatedLorelog=""LLG-0851-CSI"" and lorelog(s) "LLG-0851-CSI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0857-WLI` | UNCLAIMED | (none) | LLG-0857-WLI | Poem declares relatedLorelog=""LLG-0857-WLI"" and lorelog(s) "LLG-0857-WLI" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0861-ACS` | UNCLAIMED | (none) | LLG-0861-ACS | Poem declares relatedLorelog=""LLG-0861-ACS"" and lorelog(s) "LLG-0861-ACS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0861-ARC` | UNCLAIMED | (none) | LLG-0861-ARC | Poem declares relatedLorelog=""LLG-0861-ARC"" and lorelog(s) "LLG-0861-ARC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0861-FPP` | UNCLAIMED | (none) | LLG-0861-FPP | Poem declares relatedLorelog=""LLG-0861-FPP"" and lorelog(s) "LLG-0861-FPP" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0861-FRL` | UNCLAIMED | (none) | LLG-0861-FRL | Poem declares relatedLorelog=""LLG-0861-FRL"" and lorelog(s) "LLG-0861-FRL" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0863-MAS` | UNCLAIMED | (none) | LLG-0863-MAS | Poem declares relatedLorelog=""LLG-0863-MAS"" and lorelog(s) "LLG-0863-MAS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0864-WRC` | UNCLAIMED | (none) | LLG-0864-WRC | Poem declares relatedLorelog=""LLG-0864-WRC"" and lorelog(s) "LLG-0864-WRC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0870-EAS` | UNCLAIMED | (none) | LLG-0870-EAS | Poem declares relatedLorelog=""LLG-0870-EAS"" and lorelog(s) "LLG-0870-EAS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0871-ASF` | UNCLAIMED | (none) | LLG-0871-ASF | Poem declares relatedLorelog=""LLG-0871-ASF"" and lorelog(s) "LLG-0871-ASF" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-0890-EPS` | UNCLAIMED | (none) | LLG-0890-EPS | Poem declares relatedLorelog=""LLG-0890-EPS"" and lorelog(s) "LLG-0890-EPS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-LLG-08xx-EPS` | UNCLAIMED | (none) | LLG-08xx-EPS | Poem declares relatedLorelog=""LLG-08xx-EPS"" and lorelog(s) "LLG-08xx-EPS" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-OCV-0409-TSC` | UNCLAIMED | (none) | OCV-0409-TSC | Poem declares relatedLorelog=""OCV-0409-TSC"" and lorelog(s) "OCV-0409-TSC" exist, but do NOT list this poem in relatedHaiku/relatedLimerick |
| `aph-boundary-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-containment-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0290-ocvh` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0400-metr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0560-adjc` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0570-apcr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0635-wwlv` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0636-wcr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0810-dsl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0815-map` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0820-iels` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0821-avtl` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0822-actn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0822-elra` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0823-tsrt` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0824-ovaa` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0825-vhcn` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-fref-0840-rwrr` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-frontmatter-integrity-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-interpretive-density-report` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-mascot-anchoring-audit` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-poetry-audit-report` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-recovered-procedural-artifacts-sticker-pack` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-replacement-without-release-index-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-replacement-without-release-routing-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-trust-records-after-proof-decay` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-trust-surface-crosslinks` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-trust-surface-index-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |
| `aph-trust-surface-routing-note` | ORPHAN | (none) | — | No mascotRef, relatedMascots, or relatedLorelog declared; no lorelog claims this poem |

## Passing Poems

<details><summary>Click to expand (895 poems)</summary>

| File | Parent Type | Parent ID | Resolved Via |
|------|-------------|-----------|--------------|
| `hai-003-blamey-mctypoface` | mascot | 003.blamey-mctypoface | isMascotMatch() (multi-ref, single mascot) |
| `hai-004-boily-mcplaterton` | mascot | 004.boily-mcplaterton | isMascotMatch() (multi-ref, single mascot) |
| `hai-005-bricky-goldbricksworth` | mascot | 005.bricky-goldbricksworth | isMascotMatch() (multi-ref, single mascot) |
| `hai-006-cass-d-failure` | mascot | 006.cass-d-failure | isMascotMatch() (multi-ref, single mascot) |
| `hai-007-crashy-mcthinkslow` | mascot | 007.crashy-mcthinkslow | isMascotMatch() (multi-ref, single mascot) |
| `hai-008-cssandra-cascade` | mascot | 008.cssandra-cascade | isMascotMatch() (multi-ref, single mascot) |
| `hai-009-draft-file-derrick` | mascot | 009.draft-file-derrick | isMascotMatch() (multi-ref, single mascot) |
| `hai-010-forbiddy-noentry` | mascot | 010.forbiddy-noentry | isMascotMatch() (multi-ref, single mascot) |
| `hai-011-formee-formeson` | mascot | 011.formee-formeson | isMascotMatch() (multi-ref, single mascot) |
| `hai-012-gregwar-cache-wizard` | mascot | 012.gregwar-cache-wizard | isMascotMatch() (multi-ref, single mascot) |
| `hai-013-htaccessius-the-doorman` | mascot | 403.htaccessius-the-doorman | isMascotMatch() (multi-ref, single mascot) |
| `hai-014-htmlie-structura` | mascot | 014.htmlie-structura | isMascotMatch() (multi-ref, single mascot) |
| `hai-015-indexer-hexley` | mascot | 015.indexer-hexley | isMascotMatch() (multi-ref, single mascot) |
| `hai-016-jay-skript` | mascot | 016.jay-skript | isMascotMatch() (multi-ref, single mascot) |
| `hai-017-jpegsey-artifactor` | mascot | 017.jpegsey-artifactor | isMascotMatch() (multi-ref, single mascot) |
| `hai-018-kafkey-errorhandler` | mascot | 018.kafkey-errorhandler | isMascotMatch() (multi-ref, single mascot) |
| `hai-019-kindy-mcexistentialcrisis` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() (multi-ref, single mascot) |
| `hai-020-maila-delayden` | mascot | 020.maila-delayden | isMascotMatch() (multi-ref, single mascot) |
| `hai-021-markie-d-down` | mascot | 021.markie-d-down | isMascotMatch() (multi-ref, single mascot) |
| `hai-023-modrewrite-gremblin` | mascot | 023.modrewrite-gremblin | isMascotMatch() (multi-ref, single mascot) |
| `hai-024-moveda-permanently` | mascot | 024.moveda-permanently | isMascotMatch() (multi-ref, single mascot) |
| `hai-025-ami-ghostbyte` | mascot | 025.ami-ghostbyte | isMascotMatch() (multi-ref, single mascot) |
| `hai-026-bea-crashwell` | mascot | 026.bea-crashwell | isMascotMatch() (multi-ref, single mascot) |
| `hai-027-comrade-kernelov` | mascot | 027.comrade-kernelov | isMascotMatch() (multi-ref, single mascot) |
| `hai-028-genny-compileheart` | mascot | 028.genny-compileheart | isMascotMatch() (multi-ref, single mascot) |
| `hai-029-haikool-breeze` | mascot | 029.haikool-breeze | isMascotMatch() (multi-ref, single mascot) |
| `hai-030-holy-doswell` | mascot | 030.holy-doswell | isMascotMatch() (multi-ref, single mascot) |
| `hai-031-melody-errorflood` | mascot | 031.melody-errorflood | isMascotMatch() (multi-ref, single mascot) |
| `hai-032-neppy-sysdream` | mascot | 032.neppy-sysdream | isMascotMatch() (multi-ref, single mascot) |
| `hai-033-planny-f-pipe` | mascot | 033.planny-f-pipe | isMascotMatch() (multi-ref, single mascot) |
| `hai-034-sol-burnout` | mascot | 034.sol-burnout | isMascotMatch() (multi-ref, single mascot) |
| `hai-035-tizzy-blinkensync` | mascot | 035.tizzy-blinkensync | isMascotMatch() (multi-ref, single mascot) |
| `hai-036-whistlin-winstinct` | mascot | 036.whistlin-winstinct | isMascotMatch() (multi-ref, single mascot) |
| `hai-037-winona-crashingtonmd` | mascot | 037.winona-crashingtonmd | isMascotMatch() (multi-ref, single mascot) |
| `hai-039-patchy-mxcli` | mascot | 039.patchy-mxcli | isMascotMatch() (multi-ref, single mascot) |
| `hai-041-reboota-thrice` | mascot | 041.reboota-thrice | isMascotMatch() (multi-ref, single mascot) |
| `hai-042-robots-dot-txt` | mascot | 042.robots-dot-txt | isMascotMatch() (multi-ref, single mascot) |
| `hai-044-spooler-gremlin` | mascot | 044.spooler-gremlin | isMascotMatch() (multi-ref, single mascot) |
| `hai-045-strutter-crashley` | mascot | 045.strutter-crashley | isMascotMatch() (multi-ref, single mascot) |
| `hai-046-svgon-the-line` | mascot | 046.svgon-the-line | isMascotMatch() (multi-ref, single mascot) |
| `hai-048-twiggy-snipsnark` | mascot | 048.twiggy-snipsnark | isMascotMatch() (multi-ref, single mascot) |
| `hai-049-updatey-delaybot` | mascot | 049.updatey-delaybot | isMascotMatch() (multi-ref, single mascot) |
| `hai-050-yammy-mcparseface` | mascot | 050.yammy-mcparseface | isMascotMatch() (multi-ref, single mascot) |
| `hai-051-zooki-lockjaw` | mascot | 051.zooki-lockjaw | isMascotMatch() (multi-ref, single mascot) |
| `hai-052-octomerge` | mascot | 052.octomerge | isMascotMatch() (multi-ref, single mascot) |
| `hai-053-tabby-fields` | mascot | 053.tabby-fields | isMascotMatch() (multi-ref, single mascot) |
| `hai-054-hammy-navstack` | mascot | 054.hammy-navstack | isMascotMatch() (multi-ref, single mascot) |
| `hai-057-zhuzhing-ping` | mascot | 057.zhuzhing-ping | isMascotMatch() (multi-ref, single mascot) |
| `hai-058-yamteams` | mascot | 058.yamteams | isMascotMatch() (multi-ref, single mascot) |
| `hai-059-stackdodge` | mascot | 059.stackdodge | isMascotMatch() (multi-ref, single mascot) |
| `hai-060-courier-rat` | mascot | 060.courier-rat | isMascotMatch() (multi-ref, single mascot) |
| `hai-061-parvovirus-p` | mascot | 061.parvovirus-p | isMascotMatch() (multi-ref, single mascot) |
| `hai-063-parsey-driftchart` | mascot | 063.parsey-driftchart | isMascotMatch() (multi-ref, single mascot) |
| `hai-064-porty-mcbankrupt` | mascot | 064.porty-mcbankrupt | isMascotMatch() (multi-ref, single mascot) |
| `hai-066-malrex-voidrender` | mascot | 066.malrex-voidrender | isMascotMatch() (multi-ref, single mascot) |
| `hai-067-vexsys-antagon` | mascot | 067.vexsys-antagon | isMascotMatch() (multi-ref, single mascot) |
| `hai-068-veritas-rituallis` | mascot | 068.veritas-rituallis | isMascotMatch() (multi-ref, single mascot) |
| `hai-069-vanda-uiguard` | mascot | 069.vanda-uiguard | isMascotMatch() (multi-ref, single mascot) |
| `hai-070-uncacheable-ursula` | mascot | 070.uncacheable-ursula | isMascotMatch() (multi-ref, single mascot) |
| `hai-071-semantic-seymour` | mascot | 071.semantic-seymour | isMascotMatch() (multi-ref, single mascot) |
| `hai-072-deprecatia-fade` | mascot | 072.deprecatia-fade | isMascotMatch() (multi-ref, single mascot) |
| `hai-073-rot-mcmascotterton` | mascot | 073.rot-mcmascotterton | isMascotMatch() (multi-ref, single mascot) |
| `hai-074-datalock-archivia` | mascot | 074.datalock-archivia | isMascotMatch() (multi-ref, single mascot) |
| `hai-075-anlas-appenhancer` | mascot | 075.anlas-appenhancer | isMascotMatch() (multi-ref, single mascot) |
| `hai-076-av-14-nullseal-register` | mascot | 076.av-14-nullseal-register | isMascotMatch() (multi-ref, single mascot) |
| `hai-077-ce-5-countersign-aggregate` | mascot | 077.ce-5-countersign-aggregate | isMascotMatch() (multi-ref, single mascot) |
| `hai-078-si-9-interval-witness` | mascot | 078.si-9-interval-witness | isMascotMatch() (multi-ref, single mascot) |
| `hai-079-sc-lambda-care-continuity-split` | mascot | 079.sc-lambda-care-continuity-split | isMascotMatch() (multi-ref, single mascot) |
| `hai-080-bx-6-greybelt-remediator` | mascot | 080.bx-6-greybelt-remediator | isMascotMatch() (multi-ref, single mascot) |
| `hai-081-lx-2-waiver-apron` | mascot | 081.lx-2-waiver-apron | isMascotMatch() (multi-ref, single mascot) |
| `hai-082-ma-lcgu-porter` | mascot | 082.ma-lcgu-porter | isMascotMatch() (multi-ref, single mascot) |
| `hai-083-ac-11-sealloop-auditor` | mascot | 083.ac-11-sealloop-auditor | isMascotMatch() (multi-ref, single mascot) |
| `hai-084-lc-04-soft-green-seal` | mascot | 084.lc-04-soft-green-seal | isMascotMatch() (multi-ref, single mascot) |
| `hai-121-archiva-dustwhisper` | mascot | 121.archiva-dustwhisper | isMascotMatch() (multi-ref, single mascot) |
| `hai-201-quill-staticvox` | mascot | 201.quill-staticvox | isMascotMatch() (multi-ref, single mascot) |
| `hai-202-ledger-shadeledger` | mascot | 202.ledger-shadeledger | isMascotMatch() (multi-ref, single mascot) |
| `hai-203-cinder-forgememo` | mascot | 203.cinder-forgememo | isMascotMatch() (multi-ref, single mascot) |
| `hai-204-pump-razorbackfuel` | mascot | 204.pump-razorbackfuel | isMascotMatch() (multi-ref, single mascot) |
| `hai-205-texaco-tumbleweed` | mascot | 205.texaco-tumbleweed | isMascotMatch() (multi-ref, single mascot) |
| `hai-206-diesel-dkdriller` | mascot | 206.diesel-dkdriller | isMascotMatch() (multi-ref, single mascot) |
| `hai-207-blue-dreamweaver` | mascot | 207.blue-dreamweaver | isMascotMatch() (multi-ref, single mascot) |
| `hai-208-og-kushkeeper` | mascot | 208.og-kushkeeper | isMascotMatch() (multi-ref, single mascot) |
| `hai-209-cookie-crumbleclerk` | mascot | 209.cookie-crumbleclerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-210-sour-dieselscribe` | mascot | 210.sour-dieselscribe | isMascotMatch() (multi-ref, single mascot) |
| `hai-212-jack-hererherald` | mascot | 212.jack-hererherald | isMascotMatch() (multi-ref, single mascot) |
| `hai-213-ketchup-keeper` | mascot | 213.ketchup-keeper | isMascotMatch() (multi-ref, single mascot) |
| `hai-214-sriracha-sentinel` | mascot | 214.sriracha-sentinel | isMascotMatch() (multi-ref, single mascot) |
| `hai-215-guacamole-gardener` | mascot | 215.guacamole-gardener | isMascotMatch() (multi-ref, single mascot) |
| `hai-216-corelock-flavorwarden` | mascot | 216.corelock-flavorwarden | isMascotMatch() (multi-ref, single mascot) |
| `hai-217-spitzenfile-lord` | mascot | 217.spitzenfile-lord | isMascotMatch() (multi-ref, single mascot) |
| `hai-218-crustle-legacycoder` | mascot | 218.crustle-legacycoder | isMascotMatch() (multi-ref, single mascot) |
| `hai-219-glassy-maccheckface` | mascot | 219.glassy-maccheckface | isMascotMatch() (multi-ref, single mascot) |
| `hai-220-bananuity-clause` | mascot | 220.bananuity-clause | isMascotMatch() (multi-ref, single mascot) |
| `hai-221-mccrisp-agent` | mascot | 221.mccrisp-agent | isMascotMatch() (multi-ref, single mascot) |
| `hai-222-slidey-deckworm` | mascot | 222.slidey-deckworm | isMascotMatch() (multi-ref, single mascot) |
| `hai-223-placeholder-witness` | mascot | 223.placeholder-witness | isMascotMatch() (multi-ref, single mascot) |
| `hai-224-velv-stablecoin` | mascot | 224.velv-stablecoin | isMascotMatch() (multi-ref, single mascot) |
| `hai-225-witness-mink-9` | mascot | 225.witness-mink-9 | isMascotMatch() (multi-ref, single mascot) |
| `hai-226-serotonin-sam` | mascot | 226.serotonin-sam | isMascotMatch() (multi-ref, single mascot) |
| `hai-227-burden-shrew` | mascot | 227.burden-shrew | isMascotMatch() (multi-ref, single mascot) |
| `hai-228-proxy-compassion-possum` | mascot | 228.proxy-compassion-possum | isMascotMatch() (multi-ref, single mascot) |
| `hai-229-soft-green-sealie` | mascot | 229.soft-green-sealie | isMascotMatch() (multi-ref, single mascot) |
| `hai-230-lodgecanary-vellumbeak` | mascot | 230.lodgecanary-vellumbeak | isMascotMatch() (multi-ref, single mascot) |
| `hai-231-kpi-koala` | mascot | 231.kpi-koala | isMascotMatch() (multi-ref, single mascot) |
| `hai-232-greenband-gregor` | mascot | 232.greenband-gregor | isMascotMatch() (multi-ref, single mascot) |
| `hai-233-gratitude-latch` | mascot | 233.gratitude-latch | isMascotMatch() (multi-ref, single mascot) |
| `hai-234-kindness-template` | mascot | 234.kindness-template | isMascotMatch() (multi-ref, single mascot) |
| `hai-235-annexa-sorrowmark` | mascot | 235.annexa-sorrowmark | isMascotMatch() (multi-ref, single mascot) |
| `hai-236-pending-jurisdiction` | mascot | 236.pending-jurisdiction | isMascotMatch() (multi-ref, single mascot) |
| `hai-237-index-mourner` | mascot | 237.index-mourner | isMascotMatch() (multi-ref, single mascot) |
| `hai-238-soft-escalation-clerk` | mascot | 238.soft-escalation-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-239-annex-lurker` | mascot | 239.annex-lurker | isMascotMatch() (multi-ref, single mascot) |
| `hai-240-badgevine` | mascot | 240.badgevine | isMascotMatch() (multi-ref, single mascot) |
| `hai-241-care-coverage-wisp` | mascot | 241.care-coverage-wisp | isMascotMatch() (multi-ref, single mascot) |
| `hai-242-false-rest-lantern` | mascot | 242.false-rest-lantern | isMascotMatch() (multi-ref, single mascot) |
| `hai-243-compliance-murmur` | mascot | 243.compliance-murmur | isMascotMatch() (multi-ref, single mascot) |
| `hai-244-sentiment-launderette` | mascot | 244.sentiment-launderette | isMascotMatch() (multi-ref, single mascot) |
| `hai-245-escalady` | mascot | 245.escalady | isMascotMatch() (multi-ref, single mascot) |
| `hai-246-thankyou-ash` | mascot | 246.thankyou-ash | isMascotMatch() (multi-ref, single mascot) |
| `hai-247-ribbon-of-maybe` | mascot | 247.ribbon-of-maybe | isMascotMatch() (multi-ref, single mascot) |
| `hai-248-attestation-mole` | mascot | 248.attestation-mole | isMascotMatch() (multi-ref, single mascot) |
| `hai-249-sealant-patience` | mascot | 249.sealant-patience | isMascotMatch() (multi-ref, single mascot) |
| `hai-250-canon-dust-deputy` | mascot | 250.canon-dust-deputy | isMascotMatch() (multi-ref, single mascot) |
| `hai-251-variance-pastor` | mascot | 251.variance-pastor | isMascotMatch() (multi-ref, single mascot) |
| `hai-252-redaction-lullaby` | mascot | 252.redaction-lullaby | isMascotMatch() (multi-ref, single mascot) |
| `hai-253-local-option-ghost` | mascot | 253.local-option-ghost | isMascotMatch() (multi-ref, single mascot) |
| `hai-254-spare-comfort-engine` | mascot | 254.spare-comfort-engine | isMascotMatch() (multi-ref, single mascot) |
| `hai-255-audit-confetti` | mascot | 255.audit-confetti | isMascotMatch() (multi-ref, single mascot) |
| `hai-257-orphan-symmetry` | mascot | 257.orphan-symmetry | isMascotMatch() (multi-ref, single mascot) |
| `hai-258-pocket-consensus` | mascot | 258.pocket-consensus | isMascotMatch() (multi-ref, single mascot) |
| `hai-259-drift-lapel` | mascot | 259.drift-lapel | isMascotMatch() (multi-ref, single mascot) |
| `hai-260-sidebar-mercy` | mascot | 260.sidebar-mercy | isMascotMatch() (multi-ref, single mascot) |
| `hai-261-footnote-pallbearer` | mascot | 261.footnote-pallbearer | isMascotMatch() (multi-ref, single mascot) |
| `hai-262-recourse-cushion` | mascot | 262.recourse-cushion | isMascotMatch() (multi-ref, single mascot) |
| `hai-263-gentle-rollback` | mascot | 263.gentle-rollback | isMascotMatch() (multi-ref, single mascot) |
| `hai-264-corridor-heat` | mascot | 264.corridor-heat | isMascotMatch() (multi-ref, single mascot) |
| `hai-265-provisional-mint` | mascot | 265.provisional-mint | isMascotMatch() (multi-ref, single mascot) |
| `hai-266-warm-hold-music` | mascot | 266.warm-hold-music | isMascotMatch() (multi-ref, single mascot) |
| `hai-267-relief-watermark` | mascot | 267.relief-watermark | isMascotMatch() (multi-ref, single mascot) |
| `hai-268-appeal-feather` | mascot | 268.appeal-feather | isMascotMatch() (multi-ref, single mascot) |
| `hai-269-policy-afterglow` | mascot | 269.policy-afterglow | isMascotMatch() (multi-ref, single mascot) |
| `hai-270-buffer-saint` | mascot | 270.buffer-saint | isMascotMatch() (multi-ref, single mascot) |
| `hai-271-alibi-seal` | mascot | 271.alibi-seal | isMascotMatch() (multi-ref, single mascot) |
| `hai-272-shorthand-reliquary` | mascot | 272.shorthand-reliquary | isMascotMatch() (multi-ref, single mascot) |
| `hai-273-tier-whisper` | mascot | 273.tier-whisper | isMascotMatch() (multi-ref, single mascot) |
| `hai-274-deferment-bloom` | mascot | 274.deferment-bloom | isMascotMatch() (multi-ref, single mascot) |
| `hai-275-appendix-silk` | mascot | 275.appendix-silk | isMascotMatch() (multi-ref, single mascot) |
| `hai-276-mandate-lace` | mascot | 276.mandate-lace | isMascotMatch() (multi-ref, single mascot) |
| `hai-277-courtesy-threshold` | mascot | 277.courtesy-threshold | isMascotMatch() (multi-ref, single mascot) |
| `hai-278-benevolence-spacer` | mascot | 278.benevolence-spacer | isMascotMatch() (multi-ref, single mascot) |
| `hai-279-annex-hush` | mascot | 279.annex-hush | isMascotMatch() (multi-ref, single mascot) |
| `hai-280-ribbon-latency` | mascot | 280.ribbon-latency | isMascotMatch() (multi-ref, single mascot) |
| `hai-281-comfort-ledgerling` | mascot | 281.comfort-ledgerling | isMascotMatch() (multi-ref, single mascot) |
| `hai-282-gentility-siphon` | mascot | 282.gentility-siphon | isMascotMatch() (multi-ref, single mascot) |
| `hai-283-aftercare-vellum` | mascot | 283.aftercare-vellum | isMascotMatch() (multi-ref, single mascot) |
| `hai-284-consent-murmur` | mascot | 284.consent-murmur | isMascotMatch() (multi-ref, single mascot) |
| `hai-285-pamphlet-quietus` | mascot | 285.pamphlet-quietus | isMascotMatch() (multi-ref, single mascot) |
| `hai-286-favorable-beige` | mascot | 286.favorable-beige | isMascotMatch() (multi-ref, single mascot) |
| `hai-287-revival-pocket` | mascot | 287.revival-pocket | isMascotMatch() (multi-ref, single mascot) |
| `hai-288-deferential-spark` | mascot | 288.deferential-spark | isMascotMatch() (multi-ref, single mascot) |
| `hai-289-recital-of-sufficiency` | mascot | 289.recital-of-sufficiency | isMascotMatch() (multi-ref, single mascot) |
| `hai-290-hover-parish` | mascot | 290.hover-parish | isMascotMatch() (multi-ref, single mascot) |
| `hai-291-witness-felt` | mascot | 291.witness-felt | isMascotMatch() (multi-ref, single mascot) |
| `hai-292-kind-overdraft` | mascot | 292.kind-overdraft | isMascotMatch() (multi-ref, single mascot) |
| `hai-293-carpet-jurisdiction` | mascot | 293.carpet-jurisdiction | isMascotMatch() (multi-ref, single mascot) |
| `hai-294-proxy-lantern` | mascot | 294.proxy-lantern | isMascotMatch() (multi-ref, single mascot) |
| `hai-295-sanctioned-quilt` | mascot | 295.sanctioned-quilt | isMascotMatch() (multi-ref, single mascot) |
| `hai-296-gown-of-recognition` | mascot | 296.gown-of-recognition | isMascotMatch() (multi-ref, single mascot) |
| `hai-297-minute-absolution` | mascot | 297.minute-absolution | isMascotMatch() (multi-ref, single mascot) |
| `hai-298-tender-escrow` | mascot | 298.tender-escrow | isMascotMatch() (multi-ref, single mascot) |
| `hai-299-seal-of-maybe-enough` | mascot | 299.seal-of-maybe-enough | isMascotMatch() (multi-ref, single mascot) |
| `hai-300-friendship-preamble` | mascot | 300.friendship-preamble | isMascotMatch() (multi-ref, single mascot) |
| `hai-301-friendrick-the-extant` | mascot | 301.friendrick-the-extant | isMascotMatch() (multi-ref, single mascot) |
| `hai-304-brother-optout-pending` | mascot | 304.brother-optout-pending | isMascotMatch() (multi-ref, single mascot) |
| `hai-305-peatworthy-abstention-clerk` | mascot | 305.peatworthy-abstention-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-306-scopekeeper-emeritus` | mascot | 306.scopekeeper-emeritus | isMascotMatch() (multi-ref, single mascot) |
| `hai-307-chairwoman-deferred-change` | mascot | 307.chairwoman-deferred-change | isMascotMatch() (multi-ref, single mascot) |
| `hai-308-sister-casserole-of-relief` | mascot | 308.sister-casserole-of-relief | isMascotMatch() (multi-ref, single mascot) |
| `hai-309-ribbonward-cordialis` | mascot | 309.ribbonward-cordialis | isMascotMatch() (multi-ref, single mascot) |
| `hai-310-lionell-pancake-auditor` | mascot | 310.lionell-pancake-auditor | isMascotMatch() (multi-ref, single mascot) |
| `hai-311-eagleton-proclamation-clerk` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-312-staged-sobriety` | mascot | 312.staged-sobriety | isMascotMatch() (multi-ref, single mascot) |
| `hai-313-archive-napkin` | mascot | 313.archive-napkin | isMascotMatch() (multi-ref, single mascot) |
| `hai-314-mitigatrix-pending` | mascot | 314.mitigatrix-pending | isMascotMatch() (multi-ref, single mascot) |
| `hai-315-lilt-protocol` | mascot | 315.lilt-protocol | isMascotMatch() (multi-ref, single mascot) |
| `hai-316-pleading-margin` | mascot | 316.pleading-margin | isMascotMatch() (multi-ref, single mascot) |
| `hai-317-apology-buoy` | mascot | 317.apology-buoy | isMascotMatch() (multi-ref, single mascot) |
| `hai-318-threshold-crooner` | mascot | 318.threshold-crooner | isMascotMatch() (multi-ref, single mascot) |
| `hai-319-severance-cordial` | mascot | 319.severance-cordial | isMascotMatch() |
| `hai-320-quiet-surplus` | mascot | 320.quiet-surplus | isMascotMatch() |
| `hai-321-ribbon-clause` | mascot | 321.ribbon-clause | isMascotMatch() |
| `hai-322-unchartable-ida` | mascot | 322.unchartable-ida | isMascotMatch() |
| `hai-323-caveat-snowglobe` | mascot | 323.caveat-snowglobe | isMascotMatch() |
| `hai-324-complimentary-ghostline` | mascot | 324.complimentary-ghostline | isMascotMatch() |
| `hai-326-coverage-ledger-cherub` | mascot | 326.coverage-ledger-cherub | isMascotMatch() |
| `hai-327-minutes-without-motion` | mascot | 327.minutes-without-motion | isMascotMatch() |
| `hai-400.bad-request-bob` | mascot | 400.bad-request-bob | isMascotMatch() |
| `hai-404-404sy-mclostalot` | mascot | 404.404sy-mclostalot | isMascotMatch() |
| `hai-405.method-not-allowed-mel` | mascot | 405.method-not-allowed-mel | isMascotMatch() (multi-ref, single mascot) |
| `hai-408-the-half-held-breath` | mascot | 408.the-half-held-breath | isMascotMatch() (multi-ref, single mascot) |
| `hai-409-ledger-snag` | mascot | 409.ledger-snag | isMascotMatch() (multi-ref, single mascot) |
| `hai-410-vacancy-notice` | mascot | 410.vacancy-notice | isMascotMatch() (multi-ref, single mascot) |
| `hai-411-inchkeeper-bale` | mascot | 411.inchkeeper-bale | isMascotMatch() (multi-ref, single mascot) |
| `hai-412-red-pencil-mercy` | mascot | 412.red-pencil-mercy | isMascotMatch() (multi-ref, single mascot) |
| `hai-413-barrelbody` | mascot | 413.barrelbody | isMascotMatch() (multi-ref, single mascot) |
| `hai-414-ribbon-mile` | mascot | 414.ribbon-mile | isMascotMatch() (multi-ref, single mascot) |
| `hai-415-jarlabel-stranger` | mascot | 415.jarlabel-stranger | isMascotMatch() (multi-ref, single mascot) |
| `hai-416-shelfmark-hollow` | mascot | 416.shelfmark-hollow | isMascotMatch() (multi-ref, single mascot) |
| `hai-417-the-unmet-bell` | mascot | 417.the-unmet-bell | isMascotMatch() (multi-ref, single mascot) |
| `hai-418-teapotta-protocol` | mascot | 418.teapotta-protocol | isMascotMatch() (multi-ref, single mascot) |
| `hai-421-wrong-door-finch` | mascot | 421.wrong-door-finch | isMascotMatch() (multi-ref, single mascot) |
| `hai-422-form-sister-pale` | mascot | 422.form-sister-pale | isMascotMatch() (multi-ref, single mascot) |
| `hai-423-keyholder-null` | mascot | 423.keyholder-null | isMascotMatch() (multi-ref, single mascot) |
| `hai-424-the-second-domino` | mascot | 424.the-second-domino | isMascotMatch() (multi-ref, single mascot) |
| `hai-425-dawnstamp` | mascot | 425.dawnstamp | isMascotMatch() (multi-ref, single mascot) |
| `hai-426-old-wire-pilgrim` | mascot | 426.old-wire-pilgrim | isMascotMatch() (multi-ref, single mascot) |
| `hai-428-safekeeping-clause` | mascot | 428.safekeeping-clause | isMascotMatch() (multi-ref, single mascot) |
| `hai-429-queue-matron` | mascot | 429.queue-matron | isMascotMatch() (multi-ref, single mascot) |
| `hai-431-paper-crown` | mascot | 431.paper-crown | isMascotMatch() (multi-ref, single mascot) |
| `hai-432.afterimage-clerk` | mascot | 432.afterimage-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-433.sidecar-conflict-porter` | mascot | 433.sidecar-conflict-porter | isMascotMatch() (multi-ref, single mascot) |
| `hai-434.obsolescence-steward` | mascot | 434.obsolescence-steward | isMascotMatch() (multi-ref, single mascot) |
| `hai-435.driftlocked-policy-box` | mascot | 435.driftlocked-policy-box | isMascotMatch() (multi-ref, single mascot) |
| `hai-451-the-quiet-injunction` | mascot | 451.the-quiet-injunction | isMascotMatch() (multi-ref, single mascot) |
| `hai-502-bad-gateway-greg` | mascot | 502.bad-gateway-greg | isMascotMatch() (multi-ref, single mascot) |
| `hai-503-servicey-unavailabelle` | mascot | 503.servicey-unavailabelle | isMascotMatch() (multi-ref, single mascot) |
| `hai-504-unanswered-knock` | mascot | 504.unanswered-knock | isMascotMatch() (multi-ref, single mascot) |
| `hai-54-clicky-the-orphaned-ui` | mascot | clicky-the-orphaned-ui | isMascotMatch() (multi-ref, single mascot) |
| `hai-672-map-72-absentia` | mascot | 672.map-72-absentia | isMascotMatch() |
| `hai-677-sealward-proxy-9` | mascot | 677.sealward-proxy-9 | isMascotMatch() |
| `hai-937-blinko-chompframe` | mascot | 937.blinko-chompframe | isMascotMatch() |
| `hai-938.vantage-hollow` | mascot | 938.vantage-hollow | isMascotMatch() |
| `hai-ds-404-alpha` | lorelog | DS-404-ALPHA | lorelog.relatedHaiku/relatedLimerick |
| `hai-llg-0001-nav` | lorelog | LLG-0001-NAV | lorelog.relatedHaiku/relatedLimerick |
| `hai-llg-0012-a` | lorelog | LLG-0012-A | lorelog.relatedHaiku/relatedLimerick |
| `hai-llg-0020-coma19-pbc` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0052-mfx` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0088-b` | mascot | 004.boily-mcplaterton | isMascotMatch() |
| `hai-llg-0115-tns` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0218-fsd` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0220-uis` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0223-efa` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0226-supr` | mascot | 011.formee-formeson | isMascotMatch() |
| `hai-llg-0230-hyg` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0244-fsc` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0311-sra` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0316-lc22` | mascot | 073.datty-puritas | isMascotMatch() |
| `hai-llg-0323-lc04` | mascot | 076.av-14-nullseal-register | isMascotMatch() |
| `hai-llg-0324-map` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0326-dxs` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0327-ava` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0336-cse` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0338-sbi` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0339-sirc` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0340-bpo` | mascot | 080.bx-6-greybelt-remediator | isMascotMatch() |
| `hai-llg-0341-lme` | mascot | 081.lx-2-waiver-apron | isMascotMatch() |
| `hai-llg-0350-doge-charter` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0351-doge-intake` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0352-doge-rubric` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0354-doge-edge-cases` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0355-gex-2r` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0356-doge-memo-feelings` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0357-doge-rid` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0358-doge-w3` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0359-doge-aftercare` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0360-rage-charter` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0361-doge-stamp-drift` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0362-rage-extraction` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0363-rage-misidentification` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0364-rage-bait-taxonomy` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0365-bait-b2a` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0366-bait-b4a` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0367-bait-b3a` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0368-rage-aq` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0369-doge-swab` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0370-xev` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0371-bait-b2b` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0372-bait-b5` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0373-doge-w5` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0374-doge-la` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0377-grat` | mascot | 006.cass-d-failure | isMascotMatch() |
| `hai-llg-0378-wfa` | mascot | 051.zooki-lockjaw | isMascotMatch() |
| `hai-llg-0380-match` | mascot | 226.serotonin-sam | isMascotMatch() |
| `hai-llg-0381-optout` | mascot | 301.friendrick-the-extant | isMascotMatch() |
| `hai-llg-0382-bpd` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0383-raw` | mascot | 068.veritas-rituallis | isMascotMatch() |
| `hai-llg-0384-cir` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0385-ceb` | mascot | 058.yamteams | isMascotMatch() |
| `hai-llg-0385-sed` | mascot | 049.updatey-delaybot | isMascotMatch() |
| `hai-llg-0386-lodge-merge` | mascot | 305.peatworthy-abstention-clerk | isMascotMatch() |
| `hai-llg-0387-surv-nop` | mascot | 677.sealward-proxy-9 | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0388-ec-order` | mascot | 307.chairwoman-deferred-change | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0389-akl` | mascot | 308.sister-casserole-of-relief | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0389-mqm` | mascot | 308.sister-casserole-of-relief | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0390-hap` | mascot | 305.peatworthy-abstention-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0390-kcl` | mascot | 308.sister-casserole-of-relief | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0391-laa` | mascot | 310.lionell-pancake-auditor | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0391-rcd` | mascot | 309.ribbonward-cordialis | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0392-rcs` | mascot | 309.ribbonward-cordialis | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0392-sgl` | mascot | 310.lionell-pancake-auditor | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0393-bda` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0393-rbr` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0394-prs` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0395-mss` | mascot | 309.ribbonward-cordialis | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0396-msp` | mascot | 308.sister-casserole-of-relief | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0397-sbf` | mascot | 310.lionell-pancake-auditor | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0398-cco` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0399-ocs` | mascot | 308.sister-casserole-of-relief | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0400-cma-tsp` | mascot | 005.bricky-goldbricksworth | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0400-scas` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() (multi-ref, single mascot) |
| `hai-llg-0400-triad` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0401-scas-echo` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0402-fsr` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0403-cwr` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0404-dcp` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0405-sac` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0406-fsd` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0407-ssp` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0408-ah1` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-0409-pre` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-040x-anlas` | mascot | 075.anlas-appenhancer | isMascotMatch() |
| `hai-llg-04xx-clin-404` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-0821-scl` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `hai-llg-08xx-eps` | mascot | 229.soft-green-sealie | isMascotMatch() |
| `hai-llg-clin-comp-kaizen` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `hai-llg-credits-gta` | mascot | 058.yamteams | isMascotMatch() |
| `hai-llg-dmaic-rite` | mascot | 073.datty-puritas | isMascotMatch() |
| `hai-llg-el-0x7e` | mascot | 222.slidey-deckworm | isMascotMatch() |
| `LIM-LLG-0001-NAV` | lorelog | LLG-0001-NAV | lorelog.relatedHaiku/relatedLimerick |
| `LIM-LLG-0012-A` | lorelog | LLG-0012-A | lorelog.relatedHaiku/relatedLimerick |
| `LIM-LLG-0020-COMA19-PBC` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0052-MFX` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0088-B` | mascot | 004.boily-mcplaterton | isMascotMatch() |
| `LIM-LLG-0115-TNS` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0218-FSD` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0220-UIS` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0223-EFA` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0226-SUPR` | mascot | 011.formee-formeson | isMascotMatch() |
| `LIM-LLG-0230-HYG` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0244-FSC` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0311-SRA` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0316-LC22` | mascot | 073.datty-puritas | isMascotMatch() |
| `LIM-LLG-0324-MAP` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0326-DXS` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0327-AVA` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0336-CSE` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0338-SBI` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0339-SIRC` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0340-BPO` | mascot | 080.bx-6-greybelt-remediator | isMascotMatch() |
| `LIM-LLG-0350-DOGE-CHARTER` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0351-DOGE-INTAKE` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0352-DOGE-RUBRIC` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0354-DOGE-EDGE-CASES` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0355-GEX-2R` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0356-DOGE-MEMO-FEELINGS` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0357-DOGE-RID` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0358-DOGE-W3` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0359-DOGE-AFTERCARE` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0360-RAGE-CHARTER` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0361-DOGE-STAMP-DRIFT` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0362-RAGE-EXTRACTION` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0363-RAGE-MISIDENTIFICATION` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0364-RAGE-BAIT-TAXONOMY` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0365-BAIT-B2A` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0366-BAIT-B4A` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0367-BAIT-B3A` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0368-RAGE-AQ` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0369-DOGE-SWAB` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0370-XEV` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0371-BAIT-B2B` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0372-BAIT-B5` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0373-DOGE-W5` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0374-DOGE-LA` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0377-GRAT` | mascot | 006.cass-d-failure | isMascotMatch() |
| `LIM-LLG-0378-WFA` | mascot | 051.zooki-lockjaw | isMascotMatch() |
| `LIM-LLG-0380-MATCH` | mascot | 226.serotonin-sam | isMascotMatch() |
| `LIM-LLG-0381-OPTOUT` | mascot | 301.friendrick-the-extant | isMascotMatch() |
| `LIM-LLG-0382-BPD` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0383-RAW` | mascot | 068.veritas-rituallis | isMascotMatch() |
| `LIM-LLG-0384-CIR` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0385-CEB` | mascot | 058.yamteams | isMascotMatch() |
| `LIM-LLG-0385-SED` | mascot | 049.updatey-delaybot | isMascotMatch() |
| `LIM-LLG-0386-LODGE-MERGE` | mascot | 305.peatworthy-abstention-clerk | isMascotMatch() |
| `LIM-LLG-0387-SURV-NOP` | mascot | 677.sealward-proxy-9 | isMascotMatch() |
| `LIM-LLG-0388-EC-ORDER` | mascot | 307.chairwoman-deferred-change | isMascotMatch() |
| `LIM-LLG-0389-AKL` | mascot | 308.sister-casserole-of-relief | isMascotMatch() |
| `LIM-LLG-0389-MQM` | mascot | 308.sister-casserole-of-relief | isMascotMatch() |
| `LIM-LLG-0390-HAP` | mascot | 305.peatworthy-abstention-clerk | isMascotMatch() |
| `LIM-LLG-0390-KCL` | mascot | 308.sister-casserole-of-relief | isMascotMatch() |
| `LIM-LLG-0391-LAA` | mascot | 310.lionell-pancake-auditor | isMascotMatch() |
| `LIM-LLG-0391-RCD` | mascot | 309.ribbonward-cordialis | isMascotMatch() |
| `LIM-LLG-0392-RCS` | mascot | 309.ribbonward-cordialis | isMascotMatch() |
| `LIM-LLG-0392-SGL` | mascot | 310.lionell-pancake-auditor | isMascotMatch() |
| `LIM-LLG-0393-BDA` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() |
| `LIM-LLG-0394-PRS` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() |
| `LIM-LLG-0395-MSS` | mascot | 309.ribbonward-cordialis | isMascotMatch() |
| `LIM-LLG-0396-MSP` | mascot | 308.sister-casserole-of-relief | isMascotMatch() |
| `LIM-LLG-0397-SBF` | mascot | 310.lionell-pancake-auditor | isMascotMatch() |
| `LIM-LLG-0398-CCO` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() |
| `LIM-LLG-0399-OCS` | mascot | 308.sister-casserole-of-relief | isMascotMatch() |
| `LIM-LLG-0400-CMA-TSP` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0400-SCAS` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0401-GLP` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0401-SCAS-ECHO` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0402-FSR` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0402-GMP` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0403-CWR` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0403-WBA` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0404-DCP` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0404-UPLC` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0405-DEV` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0405-SAC` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0406-FSD` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0407-SSP` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0408-AH1` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0409-PRE` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-040X-ANLAS` | mascot | 075.anlas-appenhancer | isMascotMatch() |
| `LIM-LLG-04XX-CLIN-404` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-0821-SCL` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `LIM-LLG-0861-FPP` | mascot | 301.friendrick-the-extant | isMascotMatch() |
| `LIM-LLG-08xx-EPS` | mascot | 229.soft-green-sealie | isMascotMatch() |
| `LIM-LLG-CLIN-COMP-KAIZEN` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `LIM-LLG-CREDITS-GTA` | mascot | 058.yamteams | isMascotMatch() |
| `LIM-LLG-DMAIC-RITE` | mascot | 073.datty-puritas | isMascotMatch() |
| `LIM-LLG-EL-0x7E` | mascot | 222.slidey-deckworm | isMascotMatch() |
| `LIM-LLG-IA-8C-ANNEX` | mascot | 082.ma-lcgu-porter | isMascotMatch() |
| `LIM-LLG-MA-8C-PEPPY-01` | mascot | 082.ma-lcgu-porter | isMascotMatch() |
| `LIM-LLG-MA8C-06` | mascot | 082.ma-lcgu-porter | isMascotMatch() |
| `LIM-LLG-SYS-8-REINDEX-02` | mascot | 082.ma-lcgu-porter | isMascotMatch() |
| `lim-400.bad-request-bob` | mascot | 400.bad-request-bob | isMascotMatch() |
| `lim-404sy-mclostalot` | mascot | 404.404sy-mclostalot | isMascotMatch() |
| `lim-405.method-not-allowed-mel` | mascot | 405.method-not-allowed-mel | isMascotMatch() |
| `lim-432.afterimage-clerk` | mascot | 432.afterimage-clerk | isMascotMatch() |
| `lim-433.sidecar-conflict-porter` | mascot | 433.sidecar-conflict-porter | isMascotMatch() |
| `lim-434.obsolescence-steward` | mascot | 434.obsolescence-steward | isMascotMatch() |
| `lim-435.driftlocked-policy-box` | mascot | 435.driftlocked-policy-box | isMascotMatch() |
| `lim-938.vantage-hollow` | mascot | 938.vantage-hollow | isMascotMatch() |
| `lim-LLG-0405-MEL` | mascot | 405.method-not-allowed-mel | isMascotMatch() |
| `lim-ac-11-sealloop-auditor` | mascot | 083.ac-11-sealloop-auditor | isMascotMatch() |
| `lim-aftercare-vellum` | mascot | 283.aftercare-vellum | isMascotMatch() |
| `lim-alibi-seal` | mascot | 271.alibi-seal | isMascotMatch() |
| `lim-ami-ghostbyte` | mascot | 025.ami-ghostbyte | isMascotMatch() |
| `lim-anlas-appenhancer` | mascot | 075.anlas-appenhancer | isMascotMatch() |
| `lim-annex-hush` | mascot | 279.annex-hush | isMascotMatch() |
| `lim-annex-lurker` | mascot | 239.annex-lurker | isMascotMatch() |
| `lim-annexa-sorrowmark` | mascot | 235.annexa-sorrowmark | isMascotMatch() |
| `lim-apology-buoy` | mascot | 317.apology-buoy | isMascotMatch() |
| `lim-appeal-feather` | mascot | 268.appeal-feather | isMascotMatch() |
| `lim-appendix-silk` | mascot | 275.appendix-silk | isMascotMatch() |
| `lim-archiva-dustwhisper` | mascot | 121.archiva-dustwhisper | isMascotMatch() |
| `lim-archive-napkin` | mascot | 313.archive-napkin | isMascotMatch() |
| `lim-attestation-mole` | mascot | 248.attestation-mole | isMascotMatch() |
| `lim-audit-confetti` | mascot | 255.audit-confetti | isMascotMatch() |
| `lim-av-14-nullseal-register` | mascot | 076.av-14-nullseal-register | isMascotMatch() |
| `lim-bad-gateway-greg` | mascot | 502.bad-gateway-greg | isMascotMatch() |
| `lim-badgevine` | mascot | 240.badgevine | isMascotMatch() |
| `lim-bananuity-clause` | mascot | 220.bananuity-clause | isMascotMatch() |
| `lim-barrelbody` | mascot | 413.barrelbody | isMascotMatch() |
| `lim-bea-crashwell` | mascot | 026.bea-crashwell | isMascotMatch() |
| `lim-benevolence-spacer` | mascot | 278.benevolence-spacer | isMascotMatch() |
| `lim-blamey-mctypoface` | mascot | 003.blamey-mctypoface | isMascotMatch() |
| `lim-blinko-chompframe` | mascot | 937.blinko-chompframe | isMascotMatch() |
| `lim-blue-dreamweaver` | mascot | 207.blue-dreamweaver | isMascotMatch() |
| `lim-boily-mcplaterton` | mascot | 004.boily-mcplaterton | isMascotMatch() |
| `lim-bricky-goldbricksworth` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `lim-brother-optout-pending` | mascot | 304.brother-optout-pending | isMascotMatch() |
| `lim-buffer-saint` | mascot | 270.buffer-saint | isMascotMatch() |
| `lim-burden-shrew` | mascot | 227.burden-shrew | isMascotMatch() |
| `lim-bx-6-greybelt-remediator` | mascot | 080.bx-6-greybelt-remediator | isMascotMatch() |
| `lim-canon-dust-deputy` | mascot | 250.canon-dust-deputy | isMascotMatch() |
| `lim-care-coverage-wisp` | mascot | 241.care-coverage-wisp | isMascotMatch() |
| `lim-carpet-jurisdiction` | mascot | 293.carpet-jurisdiction | isMascotMatch() |
| `lim-cass-d-failure` | mascot | 006.cass-d-failure | isMascotMatch() |
| `lim-caveat-snowglobe` | mascot | 323.caveat-snowglobe | isMascotMatch() |
| `lim-ce-5-countersign-aggregate` | mascot | 077.ce-5-countersign-aggregate | isMascotMatch() |
| `lim-chairwoman-deferred-change` | mascot | 307.chairwoman-deferred-change | isMascotMatch() |
| `lim-cinder-forgememo` | mascot | 203.cinder-forgememo | isMascotMatch() |
| `lim-clicky-the-orphaned-ui` | mascot | clicky-the-orphaned-ui | isMascotMatch() |
| `lim-comfort-ledgerling` | mascot | 281.comfort-ledgerling | isMascotMatch() |
| `lim-compliance-murmur` | mascot | 243.compliance-murmur | isMascotMatch() |
| `lim-complimentary-ghostline` | mascot | 324.complimentary-ghostline | isMascotMatch() |
| `lim-comrade-kernelov` | mascot | 027.comrade-kernelov | isMascotMatch() |
| `lim-consent-murmur` | mascot | 284.consent-murmur | isMascotMatch() |
| `lim-cookie-crumbleclerk` | mascot | 209.cookie-crumbleclerk | isMascotMatch() |
| `lim-corelock-flavorwarden` | mascot | 216.corelock-flavorwarden | isMascotMatch() |
| `lim-corridor-heat` | mascot | 264.corridor-heat | isMascotMatch() |
| `lim-courier-rat` | mascot | 060.courier-rat | isMascotMatch() |
| `lim-courtesy-threshold` | mascot | 277.courtesy-threshold | isMascotMatch() |
| `lim-coverage-ledger-cherub` | mascot | 326.coverage-ledger-cherub | isMascotMatch() |
| `lim-crashy-mcthinkslow` | mascot | 007.crashy-mcthinkslow | isMascotMatch() |
| `lim-crustle-legacycoder` | mascot | 218.crustle-legacycoder | isMascotMatch() |
| `lim-cssandra-cascade` | mascot | 008.cssandra-cascade | isMascotMatch() |
| `lim-datalock-archivia` | mascot | 074.datalock-archivia | isMascotMatch() |
| `lim-datty-puritas` | mascot | 073.datty-puritas | isMascotMatch() |
| `lim-dawnstamp` | mascot | 425.dawnstamp | isMascotMatch() |
| `lim-deferential-spark` | mascot | 288.deferential-spark | isMascotMatch() |
| `lim-deferment-bloom` | mascot | 274.deferment-bloom | isMascotMatch() |
| `lim-deprecatia-fade` | mascot | 072.deprecatia-fade | isMascotMatch() |
| `lim-diesel-dkdriller` | mascot | 206.diesel-dkdriller | isMascotMatch() |
| `lim-draft-file-derrick` | mascot | 009.draft-file-derrick | isMascotMatch() |
| `lim-drift-lapel` | mascot | 259.drift-lapel | isMascotMatch() |
| `lim-ds-404-alpha` | lorelog | DS-404-ALPHA | lorelog.relatedHaiku/relatedLimerick |
| `lim-eagleton-proclamation-clerk` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() |
| `lim-escalady` | mascot | 245.escalady | isMascotMatch() |
| `lim-false-rest-lantern` | mascot | 242.false-rest-lantern | isMascotMatch() |
| `lim-favorable-beige` | mascot | 286.favorable-beige | isMascotMatch() |
| `lim-footnote-pallbearer` | mascot | 261.footnote-pallbearer | isMascotMatch() |
| `lim-forbiddy-noentry` | mascot | 010.forbiddy-noentry | isMascotMatch() |
| `lim-form-sister-pale` | mascot | 422.form-sister-pale | isMascotMatch() |
| `lim-formee-formeson` | mascot | 011.formee-formeson | isMascotMatch() |
| `lim-friendrick-the-extant` | mascot | 301.friendrick-the-extant | isMascotMatch() |
| `lim-friendship-preamble` | mascot | 300.friendship-preamble | isMascotMatch() |
| `lim-genny-compileheart` | mascot | 028.genny-compileheart | isMascotMatch() |
| `lim-gentility-siphon` | mascot | 282.gentility-siphon | isMascotMatch() |
| `lim-gentle-rollback` | mascot | 263.gentle-rollback | isMascotMatch() |
| `lim-glassy-maccheckface` | mascot | 219.glassy-maccheckface | isMascotMatch() |
| `lim-gown-of-recognition` | mascot | 296.gown-of-recognition | isMascotMatch() |
| `lim-gratitude-latch` | mascot | 233.gratitude-latch | isMascotMatch() |
| `lim-greenband-gregor` | mascot | 232.greenband-gregor | isMascotMatch() |
| `lim-gregwar-cache-wizard` | mascot | 012.gregwar-cache-wizard | isMascotMatch() |
| `lim-guacamole-gardener` | mascot | 215.guacamole-gardener | isMascotMatch() |
| `lim-haikool-breeze` | mascot | 029.haikool-breeze | isMascotMatch() |
| `lim-hammy-navstack` | mascot | 054.hammy-navstack | isMascotMatch() |
| `lim-holy-doswell` | mascot | 030.holy-doswell | isMascotMatch() |
| `lim-hover-parish` | mascot | 290.hover-parish | isMascotMatch() |
| `lim-htaccessius-the-doorman` | mascot | 403.htaccessius-the-doorman | isMascotMatch() |
| `lim-htmlie-structura` | mascot | 014.htmlie-structura | isMascotMatch() |
| `lim-inchkeeper-bale` | mascot | 411.inchkeeper-bale | isMascotMatch() |
| `lim-index-mourner` | mascot | 237.index-mourner | isMascotMatch() |
| `lim-indexer-hexley` | mascot | 015.indexer-hexley | isMascotMatch() |
| `lim-jack-hererherald` | mascot | 212.jack-hererherald | isMascotMatch() |
| `lim-jarlabel-stranger` | mascot | 415.jarlabel-stranger | isMascotMatch() |
| `lim-jay-skript` | mascot | 016.jay-skript | isMascotMatch() |
| `lim-jpegsey-artifactor` | mascot | 017.jpegsey-artifactor | isMascotMatch() |
| `lim-kafkey-errorhandler` | mascot | 018.kafkey-errorhandler | isMascotMatch() |
| `lim-ketchup-keeper` | mascot | 213.ketchup-keeper | isMascotMatch() |
| `lim-keyholder-null` | mascot | 423.keyholder-null | isMascotMatch() |
| `lim-kind-overdraft` | mascot | 292.kind-overdraft | isMascotMatch() |
| `lim-kindness-template` | mascot | 234.kindness-template | isMascotMatch() |
| `lim-kindy-mcexistentialcrisis` | mascot | 019.kindy-mcexistentialcrisis | isMascotMatch() |
| `lim-kpi-kaola` | mascot | 221.mccrisp-agent | isMascotMatch() |
| `lim-kpi-koala` | mascot | 231.kpi-koala | isMascotMatch() |
| `lim-lc-04-soft-green-seal` | mascot | 084.lc-04-soft-green-seal | isMascotMatch() |
| `lim-ledger-shadeledger` | mascot | 202.ledger-shadeledger | isMascotMatch() |
| `lim-ledger-snag` | mascot | 409.ledger-snag | isMascotMatch() |
| `lim-lilt-protocol` | mascot | 315.lilt-protocol | isMascotMatch() |
| `lim-lionell-pancake-auditor` | mascot | 310.lionell-pancake-auditor | isMascotMatch() |
| `lim-local-option-ghost` | mascot | 253.local-option-ghost | isMascotMatch() |
| `lim-lodgecanary-vellumbeak` | mascot | 230.lodgecanary-vellumbeak | isMascotMatch() |
| `lim-lx-2-waiver-apron` | mascot | 081.lx-2-waiver-apron | isMascotMatch() |
| `lim-ma-lcgu-porter` | mascot | 082.ma-lcgu-porter | isMascotMatch() |
| `lim-maila-delayden` | mascot | 020.maila-delayden | isMascotMatch() |
| `lim-malrex-voidrender` | mascot | 066.malrex-voidrender | isMascotMatch() |
| `lim-mandate-lace` | mascot | 276.mandate-lace | isMascotMatch() |
| `lim-map-72-absentia` | mascot | 672.map-72-absentia | isMascotMatch() |
| `lim-markie-d-down` | mascot | 021.markie-d-down | isMascotMatch() |
| `lim-mccrisp-agent` | mascot | 221.mccrisp-agent | isMascotMatch() |
| `lim-melody-errorflood` | mascot | 031.melody-errorflood | isMascotMatch() |
| `lim-minute-absolution` | mascot | 297.minute-absolution | isMascotMatch() |
| `lim-minutes-without-motion` | mascot | 327.minutes-without-motion | isMascotMatch() |
| `lim-mitigatrix-pending` | mascot | 314.mitigatrix-pending | isMascotMatch() |
| `lim-modrewrite-gremblin` | mascot | 023.modrewrite-gremblin | isMascotMatch() |
| `lim-moveda-permanently` | mascot | 024.moveda-permanently | isMascotMatch() |
| `lim-neppy-sysdream` | mascot | 032.neppy-sysdream | isMascotMatch() |
| `lim-octomerge` | mascot | 052.octomerge | isMascotMatch() |
| `lim-og-kushkeeper` | mascot | 208.og-kushkeeper | isMascotMatch() |
| `lim-old-wire-pilgrim` | mascot | 426.old-wire-pilgrim | isMascotMatch() |
| `lim-orphan-symmetry` | mascot | 257.orphan-symmetry | isMascotMatch() |
| `lim-pamphlet-quietus` | mascot | 285.pamphlet-quietus | isMascotMatch() |
| `lim-paper-crown` | mascot | 431.paper-crown | isMascotMatch() |
| `lim-parsey-driftchart` | mascot | 063.parsey-driftchart | isMascotMatch() |
| `lim-parvovirus-p` | mascot | 061.parvovirus-p | isMascotMatch() |
| `lim-patchy-mxcli` | mascot | 039.patchy-mxcli | isMascotMatch() |
| `lim-peatworthy-abstention-clerk` | mascot | 305.peatworthy-abstention-clerk | isMascotMatch() |
| `lim-pending-jurisdiction` | mascot | 236.pending-jurisdiction | isMascotMatch() |
| `lim-placeholder-witness` | mascot | 223.placeholder-witness | isMascotMatch() |
| `lim-planny-f-pipe` | mascot | 033.planny-f-pipe | isMascotMatch() |
| `lim-pleading-margin` | mascot | 316.pleading-margin | isMascotMatch() |
| `lim-pngbert-flatly` | mascot | 040.pngbert-flatly | isMascotMatch() |
| `lim-pocket-consensus` | mascot | 258.pocket-consensus | isMascotMatch() |
| `lim-policy-afterglow` | mascot | 269.policy-afterglow | isMascotMatch() |
| `lim-porty-mcbankrupt` | mascot | 064.porty-mcbankrupt | isMascotMatch() |
| `lim-provisional-mint` | mascot | 265.provisional-mint | isMascotMatch() |
| `lim-proxy-compassion-possum` | mascot | 228.proxy-compassion-possum | isMascotMatch() |
| `lim-proxy-lantern` | mascot | 294.proxy-lantern | isMascotMatch() |
| `lim-pump-razorbackfuel` | mascot | 204.pump-razorbackfuel | isMascotMatch() |
| `lim-queue-matron` | mascot | 429.queue-matron | isMascotMatch() |
| `lim-quiet-surplus` | mascot | 320.quiet-surplus | isMascotMatch() |
| `lim-quill-staticvox` | mascot | 201.quill-staticvox | isMascotMatch() |
| `lim-reboota-thrice` | mascot | 041.reboota-thrice | isMascotMatch() |
| `lim-recital-of-sufficiency` | mascot | 289.recital-of-sufficiency | isMascotMatch() |
| `lim-recourse-cushion` | mascot | 262.recourse-cushion | isMascotMatch() |
| `lim-red-pencil-mercy` | mascot | 412.red-pencil-mercy | isMascotMatch() |
| `lim-redaction-lullaby` | mascot | 252.redaction-lullaby | isMascotMatch() |
| `lim-relief-watermark` | mascot | 267.relief-watermark | isMascotMatch() |
| `lim-revival-pocket` | mascot | 287.revival-pocket | isMascotMatch() |
| `lim-ribbon-clause` | mascot | 321.ribbon-clause | isMascotMatch() |
| `lim-ribbon-latency` | mascot | 280.ribbon-latency | isMascotMatch() |
| `lim-ribbon-mile` | mascot | 414.ribbon-mile | isMascotMatch() |
| `lim-ribbon-of-maybe` | mascot | 247.ribbon-of-maybe | isMascotMatch() |
| `lim-ribbonward-cordialis` | mascot | 309.ribbonward-cordialis | isMascotMatch() |
| `lim-robots-dot-txt` | mascot | 042.robots-dot-txt | isMascotMatch() |
| `lim-rot-mcmascotterton` | mascot | 073.rot-mcmascotterton | isMascotMatch() |
| `lim-safekeeping-clause` | mascot | 428.safekeeping-clause | isMascotMatch() |
| `lim-sanctioned-quilt` | mascot | 295.sanctioned-quilt | isMascotMatch() |
| `lim-sc-lambda-care-continuity-split` | mascot | 079.sc-lambda-care-continuity-split | isMascotMatch() |
| `lim-scopekeeper-emeritus` | mascot | 306.scopekeeper-emeritus | isMascotMatch() |
| `lim-seal-of-maybe-enough` | mascot | 299.seal-of-maybe-enough | isMascotMatch() |
| `lim-sealant-patience` | mascot | 249.sealant-patience | isMascotMatch() |
| `lim-sealward-proxy-9` | mascot | 677.sealward-proxy-9 | isMascotMatch() |
| `lim-semantic-seymour` | mascot | 071.semantic-seymour | isMascotMatch() |
| `lim-sentiment-launderette` | mascot | 244.sentiment-launderette | isMascotMatch() |
| `lim-serotonin-sam` | mascot | 226.serotonin-sam | isMascotMatch() |
| `lim-servicey-unavailabelle` | mascot | 503.servicey-unavailabelle | isMascotMatch() |
| `lim-severance-cordial` | mascot | 319.severance-cordial | isMascotMatch() |
| `lim-shelfmark-hollow` | mascot | 416.shelfmark-hollow | isMascotMatch() |
| `lim-shorthand-reliquary` | mascot | 272.shorthand-reliquary | isMascotMatch() |
| `lim-si-9-interval-witness` | mascot | 078.si-9-interval-witness | isMascotMatch() |
| `lim-sidebar-mercy` | mascot | 260.sidebar-mercy | isMascotMatch() |
| `lim-sister-casserole-of-relief` | mascot | 308.sister-casserole-of-relief | isMascotMatch() |
| `lim-slidey-deckworm` | mascot | 222.slidey-deckworm | isMascotMatch() |
| `lim-soft-escalation-clerk` | mascot | 238.soft-escalation-clerk | isMascotMatch() |
| `lim-soft-green-sealie` | mascot | 229.soft-green-sealie | isMascotMatch() |
| `lim-sol-burnout` | mascot | 034.sol-burnout | isMascotMatch() |
| `lim-sour-dieselscribe` | mascot | 210.sour-dieselscribe | isMascotMatch() |
| `lim-spare-comfort-engine` | mascot | 254.spare-comfort-engine | isMascotMatch() |
| `lim-spitzenfile-lord` | mascot | 217.spitzenfile-lord | isMascotMatch() |
| `lim-spooler-gremlin` | mascot | 044.spooler-gremlin | isMascotMatch() |
| `lim-sriracha-sentinel` | mascot | 214.sriracha-sentinel | isMascotMatch() |
| `lim-stackdodge` | mascot | 059.stackdodge | isMascotMatch() |
| `lim-staged-sobriety` | mascot | 312.staged-sobriety | isMascotMatch() |
| `lim-strutter-crashley` | mascot | 045.strutter-crashley | isMascotMatch() |
| `lim-svgon-the-line` | mascot | 046.svgon-the-line | isMascotMatch() |
| `lim-tabby-fields` | mascot | 053.tabby-fields | isMascotMatch() |
| `lim-teapotta-protocol` | mascot | 418.teapotta-protocol | isMascotMatch() |
| `lim-tender-escrow` | mascot | 298.tender-escrow | isMascotMatch() |
| `lim-texaco-tumbleweed` | mascot | 205.texaco-tumbleweed | isMascotMatch() |
| `lim-thankyou-ash` | mascot | 246.thankyou-ash | isMascotMatch() |
| `lim-the-half-held-breath` | mascot | 408.the-half-held-breath | isMascotMatch() |
| `lim-the-quiet-injunction` | mascot | 451.the-quiet-injunction | isMascotMatch() |
| `lim-the-second-domino` | mascot | 424.the-second-domino | isMascotMatch() |
| `lim-the-unmet-bell` | mascot | 417.the-unmet-bell | isMascotMatch() |
| `lim-threshold-crooner` | mascot | 318.threshold-crooner | isMascotMatch() |
| `lim-tier-whisper` | mascot | 273.tier-whisper | isMascotMatch() |
| `lim-tizzy-blinkensync` | mascot | 035.tizzy-blinkensync | isMascotMatch() |
| `lim-twiggy-snipsnark` | mascot | 048.twiggy-snipsnark | isMascotMatch() |
| `lim-unanswered-knock` | mascot | 504.unanswered-knock | isMascotMatch() |
| `lim-uncacheable-ursula` | mascot | 070.uncacheable-ursula | isMascotMatch() |
| `lim-unchartable-ida` | mascot | 322.unchartable-ida | isMascotMatch() |
| `lim-updatey-delaybot` | mascot | 049.updatey-delaybot | isMascotMatch() |
| `lim-vacancy-notice` | mascot | 410.vacancy-notice | isMascotMatch() |
| `lim-vanda-uiguard` | mascot | 069.vanda-uiguard | isMascotMatch() |
| `lim-variance-pastor` | mascot | 251.variance-pastor | isMascotMatch() |
| `lim-velv-stablecoin` | mascot | 224.velv-stablecoin | isMascotMatch() |
| `lim-veritas-rituallis` | mascot | 068.veritas-rituallis | isMascotMatch() |
| `lim-vexsys-antagon` | mascot | 067.vexsys-antagon | isMascotMatch() |
| `lim-warm-hold-music` | mascot | 266.warm-hold-music | isMascotMatch() |
| `lim-whistlin-winstinct` | mascot | 036.whistlin-winstinct | isMascotMatch() |
| `lim-winona-crashingtonmd` | mascot | 037.winona-crashingtonmd | isMascotMatch() |
| `lim-witness-felt` | mascot | 291.witness-felt | isMascotMatch() |
| `lim-witness-mink-9` | mascot | 225.witness-mink-9 | isMascotMatch() |
| `lim-wrong-door-finch` | mascot | 421.wrong-door-finch | isMascotMatch() |
| `lim-yammy-mcparseface` | mascot | 050.yammy-mcparseface | isMascotMatch() |
| `lim-yamteams` | mascot | 058.yamteams | isMascotMatch() |
| `lim-zhuzhing-ping` | mascot | 057.zhuzhing-ping | isMascotMatch() |
| `lim-zooki-lockjaw` | mascot | 051.zooki-lockjaw | isMascotMatch() |
| `APH-003.blamey-mctypoface` | mascot | 003.blamey-mctypoface | isMascotMatch() |
| `APH-004.boily-mcplaterton` | mascot | 004.boily-mcplaterton | isMascotMatch() |
| `APH-005.bricky-goldbricksworth` | mascot | 005.bricky-goldbricksworth | isMascotMatch() |
| `APH-006.cass-d-failure` | mascot | 006.cass-d-failure | isMascotMatch() |
| `APH-007.crashy-mcthinkslow` | mascot | 007.crashy-mcthinkslow | isMascotMatch() |
| `APH-008.cssandra-cascade` | mascot | 008.cssandra-cascade | isMascotMatch() |
| `APH-009.draft-file-derrick` | mascot | 009.draft-file-derrick | isMascotMatch() |
| `APH-010.forbiddy-noentry` | mascot | 010.forbiddy-noentry | isMascotMatch() |
| `APH-011.formee-formeson` | mascot | 011.formee-formeson | isMascotMatch() |
| `APH-012.gregwar-cache-wizard` | mascot | 012.gregwar-cache-wizard | isMascotMatch() |
| `APH-013.htaccessius-the-doorman` | mascot | 403.htaccessius-the-doorman | isMascotMatch() |
| `APH-014.htmlie-structura` | mascot | 014.htmlie-structura | isMascotMatch() |
| `APH-015.indexer-hexley` | mascot | 015.indexer-hexley | isMascotMatch() |
| `APH-016.jay-skript` | mascot | 016.jay-skript | isMascotMatch() |
| `APH-017.jpegsey-artifactor` | mascot | 017.jpegsey-artifactor | isMascotMatch() |
| `APH-018.kafkey-errorhandler` | mascot | 018.kafkey-errorhandler | isMascotMatch() |
| `APH-020.maila-delayden` | mascot | 020.maila-delayden | isMascotMatch() |
| `APH-021.markie-d-down` | mascot | 021.markie-d-down | isMascotMatch() |
| `APH-023.modrewrite-gremblin` | mascot | 023.modrewrite-gremblin | isMascotMatch() |
| `APH-024.moveda-permanently` | mascot | 024.moveda-permanently | isMascotMatch() |
| `APH-025.ami-ghostbyte` | mascot | 025.ami-ghostbyte | isMascotMatch() |
| `APH-026.bea-crashwell` | mascot | 026.bea-crashwell | isMascotMatch() |
| `APH-027.comrade-kernelov` | mascot | 027.comrade-kernelov | isMascotMatch() |
| `APH-028.genny-compileheart` | mascot | 028.genny-compileheart | isMascotMatch() |
| `APH-029.haikool-breeze` | mascot | 029.haikool-breeze | isMascotMatch() |
| `APH-030.holy-doswell` | mascot | 030.holy-doswell | isMascotMatch() |
| `APH-031.melody-errorflood` | mascot | 031.melody-errorflood | isMascotMatch() |
| `APH-032.neppy-sysdream` | mascot | 032.neppy-sysdream | isMascotMatch() |
| `APH-033.planny-f-pipe` | mascot | 033.planny-f-pipe | isMascotMatch() |
| `APH-034.sol-burnout` | mascot | 034.sol-burnout | isMascotMatch() |
| `APH-035.tizzy-blinkensync` | mascot | 035.tizzy-blinkensync | isMascotMatch() |
| `APH-036.whistlin-winstinct` | mascot | 036.whistlin-winstinct | isMascotMatch() |
| `APH-039.patchy-mxcli` | mascot | 039.patchy-mxcli | isMascotMatch() |
| `APH-040.pngbert-flatly` | mascot | 040.pngbert-flatly | isMascotMatch() |
| `APH-041.reboota-thrice` | mascot | 041.reboota-thrice | isMascotMatch() |
| `APH-042.robots-dot-txt` | mascot | 042.robots-dot-txt | isMascotMatch() |
| `APH-044.spooler-gremlin` | mascot | 044.spooler-gremlin | isMascotMatch() |
| `APH-045.strutter-crashley` | mascot | 045.strutter-crashley | isMascotMatch() |
| `APH-046.svgon-the-line` | mascot | 046.svgon-the-line | isMascotMatch() |
| `APH-048.twiggy-snipsnark` | mascot | 048.twiggy-snipsnark | isMascotMatch() |
| `APH-049.updatey-delaybot` | mascot | 049.updatey-delaybot | isMascotMatch() |
| `APH-050.yammy-mcparseface` | mascot | 050.yammy-mcparseface | isMascotMatch() |
| `APH-051.zooki-lockjaw` | mascot | 051.zooki-lockjaw | isMascotMatch() |
| `APH-052.octomerge` | mascot | 052.octomerge | isMascotMatch() |
| `APH-053.tabby-fields` | mascot | 053.tabby-fields | isMascotMatch() |
| `APH-054.hammy-navstack` | mascot | 054.hammy-navstack | isMascotMatch() |
| `APH-057.zhuzhing-ping` | mascot | 057.zhuzhing-ping | isMascotMatch() |
| `APH-058.yamteams` | mascot | 058.yamteams | isMascotMatch() |
| `APH-059.stackdodge` | mascot | 059.stackdodge | isMascotMatch() |
| `APH-060.courier-rat` | mascot | 060.courier-rat | isMascotMatch() |
| `APH-061.parvovirus-p` | mascot | 061.parvovirus-p | isMascotMatch() |
| `APH-063.parsey-driftchart` | mascot | 063.parsey-driftchart | isMascotMatch() |
| `APH-064.porty-mcbankrupt` | mascot | 064.porty-mcbankrupt | isMascotMatch() |
| `APH-066.malrex-voidrender` | mascot | 066.malrex-voidrender | isMascotMatch() |
| `APH-067.vexsys-antagon` | mascot | 067.vexsys-antagon | isMascotMatch() |
| `APH-068.veritas-rituallis` | mascot | 068.veritas-rituallis | isMascotMatch() |
| `APH-069.vanda-uiguard` | mascot | 069.vanda-uiguard | isMascotMatch() |
| `APH-070.uncacheable-ursula` | mascot | 070.uncacheable-ursula | isMascotMatch() |
| `APH-071.semantic-seymour` | mascot | 071.semantic-seymour | isMascotMatch() |
| `APH-072.deprecatia-fade` | mascot | 072.deprecatia-fade | isMascotMatch() |
| `APH-073.datty-puritas` | mascot | 073.datty-puritas | isMascotMatch() |
| `APH-073.rot-mcmascotterton` | mascot | 073.rot-mcmascotterton | isMascotMatch() |
| `APH-074.datalock-archivia` | mascot | 074.datalock-archivia | isMascotMatch() |
| `APH-075.anlas-appenhancer` | mascot | 075.anlas-appenhancer | isMascotMatch() |
| `APH-076.av-14-nullseal-register` | mascot | 076.av-14-nullseal-register | isMascotMatch() |
| `APH-077.ce-5-countersign-aggregate` | mascot | 077.ce-5-countersign-aggregate | isMascotMatch() |
| `APH-078.si-9-interval-witness` | mascot | 078.si-9-interval-witness | isMascotMatch() |
| `APH-079.sc-lambda-care-continuity-split` | mascot | 079.sc-lambda-care-continuity-split | isMascotMatch() |
| `APH-080.bx-6-greybelt-remediator` | mascot | 080.bx-6-greybelt-remediator | isMascotMatch() |
| `APH-081.lx-2-waiver-apron` | mascot | 081.lx-2-waiver-apron | isMascotMatch() |
| `APH-082.ma-lcgu-porter` | mascot | 082.ma-lcgu-porter | isMascotMatch() |
| `APH-083.ac-11-sealloop-auditor` | mascot | 083.ac-11-sealloop-auditor | isMascotMatch() |
| `APH-084.lc-04-soft-green-seal` | mascot | 084.lc-04-soft-green-seal | isMascotMatch() |
| `APH-121.archiva-dustwhisper` | mascot | 121.archiva-dustwhisper | isMascotMatch() |
| `APH-201.quill-staticvox` | mascot | 201.quill-staticvox | isMascotMatch() |
| `APH-202.ledger-shadeledger` | mascot | 202.ledger-shadeledger | isMascotMatch() |
| `APH-203.cinder-forgememo` | mascot | 203.cinder-forgememo | isMascotMatch() |
| `APH-204.pump-razorbackfuel` | mascot | 204.pump-razorbackfuel | isMascotMatch() |
| `APH-205.texaco-tumbleweed` | mascot | 205.texaco-tumbleweed | isMascotMatch() |
| `APH-206.diesel-dkdriller` | mascot | 206.diesel-dkdriller | isMascotMatch() |
| `APH-207.blue-dreamweaver` | mascot | 207.blue-dreamweaver | isMascotMatch() |
| `APH-208.og-kushkeeper` | mascot | 208.og-kushkeeper | isMascotMatch() |
| `APH-209.cookie-crumbleclerk` | mascot | 209.cookie-crumbleclerk | isMascotMatch() |
| `APH-210.sour-dieselscribe` | mascot | 210.sour-dieselscribe | isMascotMatch() |
| `APH-212.jack-hererherald` | mascot | 212.jack-hererherald | isMascotMatch() |
| `APH-213.ketchup-keeper` | mascot | 213.ketchup-keeper | isMascotMatch() |
| `APH-214.sriracha-sentinel` | mascot | 214.sriracha-sentinel | isMascotMatch() |
| `APH-215.guacamole-gardener` | mascot | 215.guacamole-gardener | isMascotMatch() |
| `APH-216.corelock-flavorwarden` | mascot | 216.corelock-flavorwarden | isMascotMatch() |
| `APH-217.spitzenfile-lord` | mascot | 217.spitzenfile-lord | isMascotMatch() |
| `APH-218.crustle-legacycoder` | mascot | 218.crustle-legacycoder | isMascotMatch() |
| `APH-219.glassy-maccheckface` | mascot | 219.glassy-maccheckface | isMascotMatch() |
| `APH-220.bananuity-clause` | mascot | 220.bananuity-clause | isMascotMatch() |
| `APH-221.mccrisp-agent` | mascot | 221.mccrisp-agent | isMascotMatch() |
| `APH-223.placeholder-witness` | mascot | 223.placeholder-witness | isMascotMatch() |
| `APH-224.velv-stablecoin` | mascot | 224.velv-stablecoin | isMascotMatch() |
| `APH-225.witness-mink-9` | mascot | 225.witness-mink-9 | isMascotMatch() |
| `APH-226.serotonin-sam` | mascot | 226.serotonin-sam | isMascotMatch() |
| `APH-227.burden-shrew` | mascot | 227.burden-shrew | isMascotMatch() |
| `APH-228.proxy-compassion-possum` | mascot | 228.proxy-compassion-possum | isMascotMatch() |
| `APH-229.soft-green-sealie` | mascot | 229.soft-green-sealie | isMascotMatch() |
| `APH-230.lodgecanary-vellumbeak` | mascot | 230.lodgecanary-vellumbeak | isMascotMatch() |
| `APH-231.kpi-koala` | mascot | 231.kpi-koala | isMascotMatch() |
| `APH-232.greenband-gregor` | mascot | 232.greenband-gregor | isMascotMatch() |
| `APH-233.gratitude-latch` | mascot | 233.gratitude-latch | isMascotMatch() |
| `APH-234.kindness-template` | mascot | 234.kindness-template | isMascotMatch() |
| `APH-235.annexa-sorrowmark` | mascot | 235.annexa-sorrowmark | isMascotMatch() |
| `APH-236.pending-jurisdiction` | mascot | 236.pending-jurisdiction | isMascotMatch() |
| `APH-237.index-mourner` | mascot | 237.index-mourner | isMascotMatch() |
| `APH-238.soft-escalation-clerk` | mascot | 238.soft-escalation-clerk | isMascotMatch() |
| `APH-239.annex-lurker` | mascot | 239.annex-lurker | isMascotMatch() |
| `APH-240.badgevine` | mascot | 240.badgevine | isMascotMatch() |
| `APH-241.care-coverage-wisp` | mascot | 241.care-coverage-wisp | isMascotMatch() |
| `APH-242.false-rest-lantern` | mascot | 242.false-rest-lantern | isMascotMatch() |
| `APH-243.compliance-murmur` | mascot | 243.compliance-murmur | isMascotMatch() |
| `APH-244.sentiment-launderette` | mascot | 244.sentiment-launderette | isMascotMatch() |
| `APH-245.escalady` | mascot | 245.escalady | isMascotMatch() |
| `APH-246.thankyou-ash` | mascot | 246.thankyou-ash | isMascotMatch() |
| `APH-247.ribbon-of-maybe` | mascot | 247.ribbon-of-maybe | isMascotMatch() |
| `APH-248.attestation-mole` | mascot | 248.attestation-mole | isMascotMatch() |
| `APH-249.sealant-patience` | mascot | 249.sealant-patience | isMascotMatch() |
| `APH-250.canon-dust-deputy` | mascot | 250.canon-dust-deputy | isMascotMatch() |
| `APH-251.variance-pastor` | mascot | 251.variance-pastor | isMascotMatch() |
| `APH-252.redaction-lullaby` | mascot | 252.redaction-lullaby | isMascotMatch() |
| `APH-253.local-option-ghost` | mascot | 253.local-option-ghost | isMascotMatch() |
| `APH-254.spare-comfort-engine` | mascot | 254.spare-comfort-engine | isMascotMatch() |
| `APH-255.audit-confetti` | mascot | 255.audit-confetti | isMascotMatch() |
| `APH-257.orphan-symmetry` | mascot | 257.orphan-symmetry | isMascotMatch() |
| `APH-258.pocket-consensus` | mascot | 258.pocket-consensus | isMascotMatch() |
| `APH-259.drift-lapel` | mascot | 259.drift-lapel | isMascotMatch() |
| `APH-260.sidebar-mercy` | mascot | 260.sidebar-mercy | isMascotMatch() |
| `APH-261.footnote-pallbearer` | mascot | 261.footnote-pallbearer | isMascotMatch() |
| `APH-262.recourse-cushion` | mascot | 262.recourse-cushion | isMascotMatch() |
| `APH-263.gentle-rollback` | mascot | 263.gentle-rollback | isMascotMatch() |
| `APH-264.corridor-heat` | mascot | 264.corridor-heat | isMascotMatch() |
| `APH-265.provisional-mint` | mascot | 265.provisional-mint | isMascotMatch() |
| `APH-266.warm-hold-music` | mascot | 266.warm-hold-music | isMascotMatch() |
| `APH-267.relief-watermark` | mascot | 267.relief-watermark | isMascotMatch() |
| `APH-268.appeal-feather` | mascot | 268.appeal-feather | isMascotMatch() |
| `APH-269.policy-afterglow` | mascot | 269.policy-afterglow | isMascotMatch() |
| `APH-270.buffer-saint` | mascot | 270.buffer-saint | isMascotMatch() |
| `APH-271.alibi-seal` | mascot | 271.alibi-seal | isMascotMatch() |
| `APH-272.shorthand-reliquary` | mascot | 272.shorthand-reliquary | isMascotMatch() |
| `APH-273.tier-whisper` | mascot | 273.tier-whisper | isMascotMatch() |
| `APH-274.deferment-bloom` | mascot | 274.deferment-bloom | isMascotMatch() |
| `APH-275.appendix-silk` | mascot | 275.appendix-silk | isMascotMatch() |
| `APH-276.mandate-lace` | mascot | 276.mandate-lace | isMascotMatch() |
| `APH-277.courtesy-threshold` | mascot | 277.courtesy-threshold | isMascotMatch() |
| `APH-278.benevolence-spacer` | mascot | 278.benevolence-spacer | isMascotMatch() |
| `APH-279.annex-hush` | mascot | 279.annex-hush | isMascotMatch() |
| `APH-280.ribbon-latency` | mascot | 280.ribbon-latency | isMascotMatch() |
| `APH-281.comfort-ledgerling` | mascot | 281.comfort-ledgerling | isMascotMatch() |
| `APH-282.gentility-siphon` | mascot | 282.gentility-siphon | isMascotMatch() |
| `APH-283.aftercare-vellum` | mascot | 283.aftercare-vellum | isMascotMatch() |
| `APH-284.consent-murmur` | mascot | 284.consent-murmur | isMascotMatch() |
| `APH-285.pamphlet-quietus` | mascot | 285.pamphlet-quietus | isMascotMatch() |
| `APH-286.favorable-beige` | mascot | 286.favorable-beige | isMascotMatch() |
| `APH-287.revival-pocket` | mascot | 287.revival-pocket | isMascotMatch() |
| `APH-288.deferential-spark` | mascot | 288.deferential-spark | isMascotMatch() |
| `APH-289.recital-of-sufficiency` | mascot | 289.recital-of-sufficiency | isMascotMatch() |
| `APH-290.hover-parish` | mascot | 290.hover-parish | isMascotMatch() |
| `APH-291.witness-felt` | mascot | 291.witness-felt | isMascotMatch() |
| `APH-292.kind-overdraft` | mascot | 292.kind-overdraft | isMascotMatch() |
| `APH-293.carpet-jurisdiction` | mascot | 293.carpet-jurisdiction | isMascotMatch() |
| `APH-294.proxy-lantern` | mascot | 294.proxy-lantern | isMascotMatch() |
| `APH-295.sanctioned-quilt` | mascot | 295.sanctioned-quilt | isMascotMatch() |
| `APH-296.gown-of-recognition` | mascot | 296.gown-of-recognition | isMascotMatch() |
| `APH-297.minute-absolution` | mascot | 297.minute-absolution | isMascotMatch() |
| `APH-298.tender-escrow` | mascot | 298.tender-escrow | isMascotMatch() |
| `APH-299.seal-of-maybe-enough` | mascot | 299.seal-of-maybe-enough | isMascotMatch() |
| `APH-300.friendship-preamble` | mascot | 300.friendship-preamble | isMascotMatch() |
| `APH-301.friendrick-the-extant` | mascot | 301.friendrick-the-extant | isMascotMatch() |
| `APH-304.brother-optout-pending` | mascot | 304.brother-optout-pending | isMascotMatch() |
| `APH-305.peatworthy-abstention-clerk` | mascot | 305.peatworthy-abstention-clerk | isMascotMatch() |
| `APH-306.scopekeeper-emeritus` | mascot | 306.scopekeeper-emeritus | isMascotMatch() |
| `APH-307.chairwoman-deferred-change` | mascot | 307.chairwoman-deferred-change | isMascotMatch() |
| `APH-308.sister-casserole-of-relief` | mascot | 308.sister-casserole-of-relief | isMascotMatch() |
| `APH-309.ribbonward-cordialis` | mascot | 309.ribbonward-cordialis | isMascotMatch() |
| `APH-310.lionell-pancake-auditor` | mascot | 310.lionell-pancake-auditor | isMascotMatch() |
| `APH-311.eagleton-proclamation-clerk` | mascot | 311.eagleton-proclamation-clerk | isMascotMatch() |
| `APH-312.staged-sobriety` | mascot | 312.staged-sobriety | isMascotMatch() |
| `APH-313.archive-napkin` | mascot | 313.archive-napkin | isMascotMatch() |
| `APH-314.mitigatrix-pending` | mascot | 314.mitigatrix-pending | isMascotMatch() |
| `APH-315.lilt-protocol` | mascot | 315.lilt-protocol | isMascotMatch() |
| `APH-316.pleading-margin` | mascot | 316.pleading-margin | isMascotMatch() |
| `APH-317.apology-buoy` | mascot | 317.apology-buoy | isMascotMatch() |
| `APH-318.threshold-crooner` | mascot | 318.threshold-crooner | isMascotMatch() |
| `APH-319.severance-cordial` | mascot | 319.severance-cordial | isMascotMatch() |
| `APH-320.quiet-surplus` | mascot | 320.quiet-surplus | isMascotMatch() |
| `APH-321.ribbon-clause` | mascot | 321.ribbon-clause | isMascotMatch() |
| `APH-322.unchartable-ida` | mascot | 322.unchartable-ida | isMascotMatch() |
| `APH-323.caveat-snowglobe` | mascot | 323.caveat-snowglobe | isMascotMatch() |
| `APH-324.complimentary-ghostline` | mascot | 324.complimentary-ghostline | isMascotMatch() |
| `APH-326.coverage-ledger-cherub` | mascot | 326.coverage-ledger-cherub | isMascotMatch() |
| `APH-327.minutes-without-motion` | mascot | 327.minutes-without-motion | isMascotMatch() |
| `APH-404.404sy-mclostalot` | mascot | 404.404sy-mclostalot | isMascotMatch() |
| `APH-408.the-half-held-breath` | mascot | 408.the-half-held-breath | isMascotMatch() |
| `APH-410.vacancy-notice` | mascot | 410.vacancy-notice | isMascotMatch() |
| `APH-411.inchkeeper-bale` | mascot | 411.inchkeeper-bale | isMascotMatch() |
| `APH-412.red-pencil-mercy` | mascot | 412.red-pencil-mercy | isMascotMatch() |
| `APH-413.barrelbody` | mascot | 413.barrelbody | isMascotMatch() |
| `APH-414.ribbon-mile` | mascot | 414.ribbon-mile | isMascotMatch() |
| `APH-415.jarlabel-stranger` | mascot | 415.jarlabel-stranger | isMascotMatch() |
| `APH-416.shelfmark-hollow` | mascot | 416.shelfmark-hollow | isMascotMatch() |
| `APH-417.the-unmet-bell` | mascot | 417.the-unmet-bell | isMascotMatch() |
| `APH-418.teapotta-protocol` | mascot | 418.teapotta-protocol | isMascotMatch() |
| `APH-421.wrong-door-finch` | mascot | 421.wrong-door-finch | isMascotMatch() |
| `APH-422.form-sister-pale` | mascot | 422.form-sister-pale | isMascotMatch() |
| `APH-423.keyholder-null` | mascot | 423.keyholder-null | isMascotMatch() |
| `APH-424.the-second-domino` | mascot | 424.the-second-domino | isMascotMatch() |
| `APH-425.dawnstamp` | mascot | 425.dawnstamp | isMascotMatch() |
| `APH-426.old-wire-pilgrim` | mascot | 426.old-wire-pilgrim | isMascotMatch() |
| `APH-428.safekeeping-clause` | mascot | 428.safekeeping-clause | isMascotMatch() |
| `APH-429.queue-matron` | mascot | 429.queue-matron | isMascotMatch() |
| `APH-431.paper-crown` | mascot | 431.paper-crown | isMascotMatch() |
| `APH-451.the-quiet-injunction` | mascot | 451.the-quiet-injunction | isMascotMatch() |
| `APH-502.bad-gateway-greg` | mascot | 502.bad-gateway-greg | isMascotMatch() |
| `APH-503.servicey-unavailabelle` | mascot | 503.servicey-unavailabelle | isMascotMatch() |
| `APH-672.map-72-absentia` | mascot | 672.map-72-absentia | isMascotMatch() |
| `APH-677.sealward-proxy-9` | mascot | 677.sealward-proxy-9 | isMascotMatch() |
| `APH-937.blinko-chompframe` | mascot | 937.blinko-chompframe | isMascotMatch() |
| `APH-clicky-the-orphaned-ui` | mascot | clicky-the-orphaned-ui | isMascotMatch() |
| `aph-400.bad-request-bob` | mascot | 400.bad-request-bob | isMascotMatch() |
| `aph-405.method-not-allowed-mel` | mascot | 405.method-not-allowed-mel | isMascotMatch() |
| `aph-432.afterimage-clerk` | mascot | 432.afterimage-clerk | isMascotMatch() |
| `aph-433.sidecar-conflict-porter` | mascot | 433.sidecar-conflict-porter | isMascotMatch() |
| `aph-434.obsolescence-steward` | mascot | 434.obsolescence-steward | isMascotMatch() |
| `aph-435.driftlocked-policy-box` | mascot | 435.driftlocked-policy-box | isMascotMatch() |
| `aph-938.vantage-hollow` | mascot | 938.vantage-hollow | isMascotMatch() |

</details>

