---
title: "Presentation QA v2 Reference 05: Rich-Structure Review of Fourteen Records"
parent: changelog
status: published
tags: ["changelog", "reference", "presentation-qa"]
---

# Presentation QA v2 Reference 05: Rich-Structure Review of Fourteen Records

**Maintenance ID:** 0.1.00250.presentation-qa-v2-reference-05
**Date:** 2026-10-09
**Scope:** `content/reference/` — the fourteen records assigned by workload issue #975 (`fref-0080-srbp` through `fref-0200-cbac`, snapshot `1ce4635c5dedba717dc42b40045228044940771c`)

## What changed

- Read all fourteen assigned records in full, frontmatter through final line, including each Related Aphorisms/Haikus/Limericks residue tail. The worktree was cut from `origin/main` at `1ce4635c`, the exact snapshot commit; no intervening diffs on any assigned file.
- `fref-0080-srbp.md`: run-in label `**Boundary Note:**` (line 20) and shorthand `FREF-0070` → `[[reference/FREF-0070-AOPT|FREF-0070]]`. The prefix resolves to exactly one `reference/` record; the APH/HAI/LIM residue records sharing the stem are derived tails, not competing referents — same reading as the approved `FREF-0815` example in the issue.
- `fref-0090-srbg.md`: legacy relative-path link to `fref-0260-bmdh.md` (label "Benevolence Metrics Desk") inside the `<Aside>` addendum → `[[reference/FREF-0260-BMDH|Benevolence Metrics Desk]]` (line 47). Label preserved verbatim; target `id:` verified.
- `fref-0100-dacb.md`: five existing noun-phrase lead-ins → `**Label:**` run-ins (`Example transformation:` line 47, `Common merges:` 65, `Consolidation rules:` 71, `Example tooltip:` 77, `Recommended wording:` 110).
- `fref-0110-dacs.md`: ten minutes-field lead-ins → `**Label:**` run-ins, one per block (`Complaint, as read aloud:` 26, `Discussion:` 31, `Proposal, accepted:` 37, `Background:` 48, `Suggestion from the back of the room:` 53, `Outcome:` 57, `Minutes note:` 63, `Conversation (partial):` 75, `Decision:` 81, `Unattributed, recorded near the bottom margin:` 94). The record is already in label:block form throughout; the bolding makes the minutes structure visible, consistent across all ten.
- `fref-0120-dcsc.md`: recurring card lead-ins → `**Consolidated success class:**` (lines 25, 45, 65) and `**Tooltip suggestion:**` (lines 30, 50, 70), three sections in parallel.
- `fref-0130-ocvh.md`: `Recommended exercise format:` → `**Recommended exercise format:**` (line 85). The sentence-shaped lead-ins `Metadata may include:` (66) and `In such cases:` (107) were read as prose transitions and left plain.
- `fref-0150-mapa.md` and `fref-0160-maii.md`: the two near-identical MAP-Annex records carry the same unbolded field fragments in their glossary and mascot-ecology sub-bullets — `Operational effect:`/`Typical hosts:` (four pairs each) and `Trigger:`/`Behavioral residue:`/`Practical effect:` (two sets each) → `**Label:**` run-ins, matching the record's own already-bold `**Stated objective**`/`**Public summary**` convention. MAP-code tokens (`MAP‑HG‑7B`, `32‑A`, `32‑A‑NEW`) left plain as designations used as names.
- `fref-0170-lgef.md`: three code-spanned lorelog IDs in the Hard anchors bullets → wiki links with source-spelling labels (`[[lorelog/LLG-0300-SC-X|LLG-0300-SC-X]]`, `[[lorelog/LLG-0330-TDE|LLG-0330-TDE]]`, `[[lorelog/LLG-0318-SRO|LLG-0318-SRO]]`, lines 33–34). The bullets literally prescribe retaining a link to these records; the section heading is "Hard anchors."
- `fref-0180-tdci.md`: relative-path link to `fref-0030-avsg.md` (label "FREF-0030-AVSG") inside the `<Aside>` addendum → `[[reference/FREF-0030-AVSG|FREF-0030-AVSG]]` (line 423, label preserved verbatim, `id:` verified); identifier → code span on the filing paths `` `/time_ingestion/` `` and `` `/pre_decay/` `` (lines 219–220); field-fragment → run-in labels on `Example transformation:` (111), `Output format:` (125), `Focus on:` (141), `Constraint:` (156), `Detection priority:`/`Correction:` (204–205), `Filed under:`/`Status:` (218–222), `Goal:` (274, 390), `Allowed behaviors:`/`Disallowed behaviors:` (292, 298), `Input:`/`Output:` (308–312), and the five Incident File template fields (330–338). The record already establishes the `**Use:**` label convention at lines 31–87.
- `fref-0140-ocvs.md`, `fref-0195-fwru.md`, `fref-0200-cbac.md`: reviewed unchanged. ocvs is already a structured checklist whose `If …:` lines are conditional prose, not field labels; fwru is three paragraphs with its one bold pivot already spent; cbac is a draft whose structure already shows.
- Eleven records changed, three reviewed unchanged. Totals reconcile against the fourteen-file assignment.

## What was deliberately left alone

- All frontmatter, canonical IDs, titles, status (including `draft` on cbac), tags, `relations`, `{#...-N}` heading anchors, existing emphasis, code spans (`relatedEntries`, `mascotRef`, the `ts` crosswalk block in srbp), blockquotes, the `[^1]` markers, margin annotations, and every Related verse tail including hard breaks.
- `fref-0120-dcsc.md` line 83: `027.comrade-kernelov` is a filename stem, not a canonical ID token — stays plain per the issue's filename-stem ruling; not flagged.
- `fref-0150-mapa.md`/`fref-0160-maii.md` dangling `[^1]` footnote markers (22 each, no `[^1]:` definition): already flagged **needs decision** under 0.1.00218.reference-016 as the MAP-Annex dangling-marker cluster; not re-flagged, not edited.
- `fref-0180-tdci.md` System Log Fragment and Annotation Drift Snippet (lines 342–358): template residue rendered as loose lines; no allowed transform fits without inventing whitespace, left plain.
- The floating post-`<Aside>` limericks and `## Haikus` nested-heading residue across the slice — established corpus-wide ingest residue, consistent with prior rulings.

## Verification performed

- `git diff` review: only `**` markers, `[[…|…]]` link mechanisms, and two `code spans` differ; no word, order, ID, frontmatter, or verse change.
- `BORIS_BIN=$HOME/.local/bin/boris ./bin/validate_graph.sh` — see PR body for exact outcome.
- Compiled-article inspection of all eleven changed records plus unchanged `fref-0140-ocvs.md` and `fref-0195-fwru.md` controls — see PR body for exact pages and results.

## Unresolved follow-up

- `fref-0200-cbac.md` line 38: bullet truncates mid-word ("even when copies were know") and the section promises "three main device types" with two present — the standing **needs decision** flag recorded under 0.1.00218-era reference-017 (issue #788); truncation is present since the Boris-migration commit. Not repaired, not re-flagged.
- No new needs-decision items arose in this slice.
