# Lorewriting for Filed & Forgotten — batch brief

This document is the voice and scope specification for generating new archive
lore. It is written to be pasted, whole or in part, into the instructions given
to any model generating a lore batch. It exists because voice drift and
incomplete batches are the two most expensive review problems in this
repository, and neither is fixed by asking models to "match the tone."

Pair with `docs/working-with-filed.md` (mechanics: IDs, counts, validation)
and `rules.md` (containment directives). Those documents govern; this one is
about not sounding like a shitlord.

---

## 1. The one rule

**The procedure carries the joke.** Every record is a document doing a job —
a roster, an audit, an incident log, an inventory, a form. The humor is in
what the record faithfully records. The writer never winks.

If a sentence exists to tell the reader why something is funny, absurd, or
ironic, delete it. The fact pattern does the work or nothing does.

## 2. Voice spec

- **Register**: institutional, post-bureaucratic, faintly exhausted. Passive
  voice is welcome. Em-dashes are welcome. Exclamation points are not.
  Rhetorical questions addressed to the reader are not.
- **Precision is the emotion.** Exact counts, exact percentages, exact dates.
  `94.7%` confidence. `67%` of the bereft. `Day 1,140`. The archive expresses
  grief, absurdity, and dread through metadata — see LLG-0390-KCL, where a
  kitchen credit balance is the entire eulogy.
- **Cultural specificity is allowed; meme vocabulary is not.** "One oat-milk
  cortado" in a log line is culture observed flatly. "Vibe coding," "10x
  engineer," "rewrite it in Rust" are punchline-first references that flatter
  the reader for recognizing them. They date the record and break the fiction.
- **The archive does not know it is a website.** No meta-compiler jokes: no
  Boris, no rendering, no "this page," no canonical-target humor. Inside the
  fiction, these are paper-era records that happen to be machines.
- **Current tech-industry buzzwords are never the joke itself.** When the
  concept is needed, bureaucratize it:
  - not "vibe coding" → "generation service"
  - not "tokens" → "billable generation units"
  - not "hallucinated dependency" → "notional dependency"
  - not "agentic" → nothing, cut the passage
- **Punchlines: one per record, at the end, deadpan.** Example shape, from
  LLG-0940's marginalia: `The room was reserved. The room was empty. The
  reservation remains in effect.` If you find a second punchline, pick the
  better one and demote the other to procedure.
- **Titles of invented offices are straight-faced.** "Exhumation Officer,"
  "Director of Metrics Theatre," "Throughput Certification Officer." Not
  "Principal Velocity Daemon" — that is a joke title, and joke titles are the
  reader's job to notice, not the writer's job to announce.

## 3. Canon anchors

Read these before generating anything. They are the voice, not a description
of it:

- `content/lorelog/LLG-0390-KCL.md` — grief expressed as metadata
- `content/lorelog/LLG-0386-LODGE-MERGE.md` — attendance surviving a merger
- `content/reference/fref-0923-manene-protocol.md` — deadpan exhumation procedure
- `content/reference/fref-0944-dpp.md` — artifact-driven: the table is the joke
- `content/lorelog/LLG-0941-VEST-QUORUM.md` — incident log where the log lines
  carry everything and the reviewer notes refuse to explain

## 4. Anti-pattern table

Real corrections from editorial review. Left: what models produce. Right: what
the archive keeps.

| Shitlord draft | Archive voice |
|---|---|
| `Principal Velocity Daemon` | `Throughput Certification Officer` |
| `2.3 million tokens` | `2.3 million billable generation units` |
| `hallucinated dependency made true` | `notional dependency made true` |
| `rewrites working components in Rust` | `rewrites working components in whichever language the current methodological quarter favors` |
| `vibe-coding` (as a tag or noun) | removed entirely |
| Recovered patch notes for `orchestrd 4.0.0 "Agentic"` | removed entirely — parody release notes are cosplay |
| Paragraphs explaining that the placeholder brunch is funny because no brunch occurs | `Catering recorded no consumption. [...] The Steward did not file a correction. There was no field for hunger.` |
| `catering awaits a canonical target` | `catering has not been advised of the contents` |
| Brad laid off, "his ghost endorses him for skills he never had," poltergeist-union material | `Brad's separation record finally propagated through the contact system` |
| `I went to a run club this morning. What happened at mile two changed how I think about distribution.` | `Mile two changed how I think about distribution.` — the artifact stands alone; the scaffolding was the cringe |
| `The system compiled the page you are reading` | deleted — the archive does not know it is a website |

## 5. The full-suite manifest

A topic batch is not finished when it "feels done." It is finished when every
slot below is either filled or deliberately omitted — and the omission is
mentioned in the docket. **Forgotten omission is the failure mode; deliberate
omission is fine.**

| Slot | Pattern | Notes |
|---|---|---|
| Mascot | `content/mascots/NNN.slug.md`, id `mascots/M-0NNN` | The entity. Biography, known failures, ceremonial tasks. |
| Lorelog incident | `content/lorelog/LLG-NNNN-SLUG.md` | The event or structure. Tables, logs, reviewer notes. |
| Reference record | `content/reference/fref-NNNN-slug.md` | The artifact, instrument, form, or protocol the topic implies. If the lorelog cites a form, a metric, or a procedure, that thing exists and has a record. |
| Aphorism(s) | `content/aphorisms/APH-NNN.slug.md` per mascot; `APH-FREF-NNNN-…` per reference | Short, dry, one observation each. Not miniature essays. |
| Limerick | `content/limericks/LIM-LLG-NNNN-SLUG.md` per lorelog | AABBA, hard breaks (two trailing spaces) on every line, final line is the punch. No explanatory prose sections. |
| Haiku | `content/haikus/hai-NNN-slug.md` per mascot | Match the seasonal/observational register of existing haiku. |
| Maintenance docket | `content/changelog/YYYY-MM-DD-slug.md` | One per batch. Count progression must be accurate per collection. |

Non-negotiable mechanics for every batch:

- Trunk `Count: N records.` lines updated in each affected collection index.
- README page and satellite totals updated to match reality at commit time.
- `relations:` wired in frontmatter; satellites point at their subjects.
- No restricted containment vocabulary (Bin 8C, breeding program) — not even
  as a joke, not even once. See `rules.md`.
- Gates before commit: `./bin/validate_graph.sh`,
  `python3 scripts/test_relationship_repair.py`, `./scripts/filed-publish.sh`.
  Report exact results, not vibes.

## 6. Required self-audit before output

Run these questions over every record before considering the batch done. If
any answer is yes, revise before delivering:

1. Does any sentence explain why something is funny or absurd? Delete it.
2. Does any sentence reference the archive as a compiled artifact, website,
   page, or render target? Delete it.
3. Is any current industry meme vocabulary (vibe coding, agentic, 10x, tokens,
   hallucination-as-punchline, Rust evangelism, LinkedIn-influencer cadence)
   doing the comedic work? Bureaucratize or cut.
4. Does any passage parody a real format (release notes, patch notes,
   LinkedIn posts) at length instead of citing it in one flat line? Cut to one
   line or delete.
5. Is there more than one punchline per record? Keep one.
6. Count the suite slots in §5. Which are empty? Empty on purpose, or empty
   because you stopped? Fill or declare.
7. Read the final record aloud in a flat voice, as a clerk filing it. If any
   sentence only works when read with a smirk, rewrite it until it doesn't.
