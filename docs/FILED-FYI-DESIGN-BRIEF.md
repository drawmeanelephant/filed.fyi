# Filed.fyi design brief

## Direction

Make the archive feel like a calm records system whose contradictions are
visible, searchable, and intentionally unresolved. Use a restrained paper /
ink palette, strong record identifiers, and dense but generous metadata. The
design should make provenance and review state more trustworthy than decorative
theme fidelity.

## Information architecture

### Archive landing

Lead with “Filed & Forgotten” and a short statement of the archive’s purpose.
Show the primary shelves as a small set of cards: Lorelog, Mascots, Reference,
Guides, Posts, Releases, and Poetry. Each card carries a count, latest filing,
and one-line description. Include a compact “needs review” summary that links
to the review queue rather than hiding migration uncertainty.

### Entry page

Use a record header: identifier, title, status, filed/updated dates, and a
one-line summary. Follow with the preserved body. Keep custom source fields in
a clearly labeled “source record” panel until a human maps them; do not silently
promote `caseNumber`, `rotAffinity`, `severity`, or similar fields into Boris
frontmatter. Put related records and poetry after the body, with relationship
kind and resolution state visible.

### Relationship / index page

Treat collection hubs and seam pages as first-class navigation surfaces. Start
with a breadcrumb and shelf description, then group children by stable record
id or date. Add relationship facets for Lorelog, Mascots, Haikus, and Limericks
only when the target is resolved. Put unresolved or ambiguous candidates in a
separate “relationship ledger” section with a review badge; never make a dead
link look canonical.

### Review / manual-intervention state

Use an amber, non-alarmist review treatment with three explicit labels:
`preserved`, `normalized`, and `manual review`. A review card should show the
source path, field/component or asset, reason, and proposed next action. The
raw slice demonstrates why this matters: MDX components, nested YAML, poetry
objects, missing targets, and a source-global image all survive only as review
evidence.

## Mediluna placement

No Mediluna placement is recommended for this slice. Neither the Filed source
nor the target contains a Mediluna reference, asset, or information-architecture
role. Adding it here would be invented brand semantics. Revisit only if a
separate, authoritative Mediluna brief identifies a concrete archive function;
then prefer a restrained footer/utility placement over an entry-page hero.

## Migration guardrails

1. Keep the archive landing and collection indexes hand-authored or explicitly
   mapped; do not infer them from directory names alone.
2. Keep `relatedHaiku` / `relatedLimerick` candidates in a review ledger until
   their `{slug}` object shape and target inventory are proven.
3. Resolve source-global assets through a checked-in adaptation decision; the
   raw pass must continue to fail closed with `EASSET`.
4. Preserve custom fields in provenance or a visible source-record panel before
   any closed-frontmatter mapping is approved.
5. Keep the review queue usable as content: sortable by reason, source path,
   and target resolution, with no implication that “converted” means complete.
