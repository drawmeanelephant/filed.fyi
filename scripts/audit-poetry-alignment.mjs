#!/usr/bin/env node
/**
 * audit-poetry-alignment.mjs
 *
 * Replicates the EXACT parent-resolution logic used in:
 *   - src/components/starlight/MarkdownContent.astro
 *   - src/components/CollectionRegister.astro
 *
 * For every poem (haiku, limerick, aphorism) it traces:
 *   1. Lorelog claim path  — does a lorelog's relatedHaiku/relatedLimerick list this poem?
 *   2. Mascot claim path   — does the poem's mascotRef/relatedMascots resolve via isMascotMatch()?
 *   3. Self-anchor fallback — poem falls through to /haikus#poem-name (orphan)
 *
 * Statuses:
 *   PASS       — resolves to a real parent
 *   ORPHAN     — no parent found, falls back to self-anchor
 *   AMBIGUOUS  — multiple parents claim this poem
 *   DEAD_REF   — poem declares a ref that doesn't match any parent
 *   LOGIC_GAP  — poem has a thematically-correct ref but isMascotMatch() can't resolve it
 *
 * Usage:
 *   node scripts/audit-poetry-alignment.mjs [--json] [--fix-preview] [--batch N]
 *
 *   --json         Output machine-readable JSON instead of markdown
 *   --fix-preview  Show suggested frontmatter fixes (does not write)
 *   --batch N      Only process batch N (each batch = 30 poems, for chunked review)
 *   --collection X Only process collection X (haikus|limericks|aphorisms)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import parseFrontmatter from './lib/parse-frontmatter.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const docsDir = path.join(projectRoot, 'src/content/docs');
const contentDir = path.join(projectRoot, 'src/content');

// ── CLI Args ──────────────────────────────────────
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const fixPreview = args.includes('--fix-preview');
const batchIdx = args.indexOf('--batch');
const batchNum = batchIdx >= 0 ? parseInt(args[batchIdx + 1], 10) : null;
const collIdx = args.indexOf('--collection');
const collFilter = collIdx >= 0 ? args[collIdx + 1] : null;

// ── File Utilities ────────────────────────────────

function getMdxFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getMdxFiles(full));
    else if (/\.mdx?$/.test(entry.name)) results.push(full);
  }
  return results;
}

// Using shared parseFrontmatter from ./lib/parse-frontmatter.mjs

// ── isMascotMatch — EXACT REPLICA from components ─

function isMascotMatch(poemRef, mascot) {
  if (!poemRef || !mascot) return false;

  const clean = (s) => s
    .replace(/^mascots\//i, '')
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim();

  const rClean = clean(poemRef);
  const rTokens = rClean.split(/\s+/).filter(Boolean);

  // Only match if the number is the LEADING token of the ref (e.g. "672" in
  // "672.map-72-absentia") — not a stray digit embedded in the slug.
  const rLeadingNumber = rTokens.length > 0 && /^\d+$/.test(rTokens[0]) ? rTokens[0] : null;
  if (rLeadingNumber && mascot.mascotId && String(mascot.mascotId) === rLeadingNumber) {
    return true;
  }

  const cleanMascot = (str) => clean(str).split(/\s+/).filter(t => !/^\d+$/.test(t) && t !== 'the');

  const mascotTokens = [
    mascot.id,
    mascot.slug,
    mascot.title,
    mascot.displayName,
    mascot.name,
  ].filter(Boolean).flatMap(cleanMascot);

  const poemTextTokens = rTokens.filter(t => !/^\d+$/.test(t) && t !== 'the');

  if (poemTextTokens.length > 0 && mascotTokens.length > 0) {
    const allMatch = poemTextTokens.every(pt => mascotTokens.includes(pt));
    if (allMatch) return true;

    const titleTokens = cleanMascot(mascot.title || mascot.displayName || '');
    if (titleTokens.length > 0 && titleTokens.every(tt => poemTextTokens.includes(tt))) {
      return true;
    }
  }

  return false;
}

// ── Load All Data ─────────────────────────────────

console.error('Loading mascots...');
const mascotFiles = getMdxFiles(path.join(docsDir, 'mascots'));
const mascots = mascotFiles.map(f => {
  const { frontmatter } = parseFrontmatter(f);
  const id = path.basename(f, path.extname(f));
  return {
    id,
    file: f,
    mascotId: frontmatter.mascotId ?? null,
    slug: frontmatter.slug ?? null,
    title: frontmatter.title ?? null,
    name: frontmatter.name ?? null,
    displayName: frontmatter.name ?? frontmatter.title ?? null,
  };
});
console.error(`  → ${mascots.length} mascots loaded`);

console.error('Loading lorelogs...');
const lorelogFiles = getMdxFiles(path.join(docsDir, 'lorelog'));
const lorelogs = lorelogFiles.map(f => {
  const { frontmatter } = parseFrontmatter(f);
  const id = path.basename(f, path.extname(f));
  return {
    id,
    file: f,
    title: frontmatter.title ?? null,
    caseNumber: frontmatter.caseNumber ?? null,
    mascotRef: frontmatter.mascotRef ?? null,
    relatedHaiku: frontmatter.relatedHaiku ?? [],
    relatedLimerick: frontmatter.relatedLimerick ?? [],
  };
});
console.error(`  → ${lorelogs.length} lorelogs loaded`);

console.error('Loading reference docs...');
const referenceFiles = getMdxFiles(path.join(docsDir, 'reference'));
const referenceDocs = referenceFiles.map(f => {
  const { frontmatter } = parseFrontmatter(f);
  const id = path.basename(f, path.extname(f));
  return {
    id,
    file: f,
    title: frontmatter.title ?? null,
    caseNumber: frontmatter.caseNumber ?? null,
  };
});
console.error(`  → ${referenceDocs.length} reference docs loaded`);

// Build lorelog→poem claim maps (replicating CollectionRegister logic)
const poemToLorelogMap = new Map(); // poemName → lorelogId
for (const lg of lorelogs) {
  for (const h of lg.relatedHaiku) {
    if (h && h.slug) {
      const hName = h.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';
      if (hName) poemToLorelogMap.set(hName, lg.id);
    }
  }
  for (const l of lg.relatedLimerick) {
    if (l && l.slug) {
      const lName = l.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';
      if (lName) poemToLorelogMap.set(lName, lg.id);
    }
  }
}
console.error(`  → ${poemToLorelogMap.size} lorelog→poem claims indexed`);

// ── Load Poetry Collections ───────────────────────

const poetryCollections = [
  { id: 'haikus', dir: path.join(contentDir, 'haikus') },
  { id: 'limericks', dir: path.join(contentDir, 'limericks') },
  { id: 'aphorisms', dir: path.join(contentDir, 'aphorisms') },
];

if (collFilter) {
  const idx = poetryCollections.findIndex(c => c.id === collFilter);
  if (idx < 0) {
    console.error(`Unknown collection: ${collFilter}. Valid: haikus, limericks, aphorisms`);
    process.exit(1);
  }
}

let allPoems = [];

for (const coll of poetryCollections) {
  if (collFilter && coll.id !== collFilter) continue;

  const files = getMdxFiles(coll.dir);
  for (const f of files) {
    const { frontmatter, body } = parseFrontmatter(f);
    const basename = path.basename(f, path.extname(f));
    const poemName = basename.toLowerCase().trim();

    allPoems.push({
      collection: coll.id,
      file: f,
      basename,
      poemName,
      mascotRef: frontmatter.mascotRef ?? null,
      relatedMascots: Array.isArray(frontmatter.relatedMascots) ? frontmatter.relatedMascots.filter(Boolean) : [],
      parentEntry: frontmatter.parentEntry ?? frontmatter.relatedLorelog ?? null,
      body,
    });
  }
}

console.error(`\nTotal poems to audit: ${allPoems.length}`);

// Apply batch filter
if (batchNum != null) {
  const batchSize = 30;
  const start = batchNum * batchSize;
  const end = start + batchSize;
  allPoems = allPoems.slice(start, end);
  console.error(`  → Batch ${batchNum}: poems ${start}–${Math.min(end, allPoems.length + start) - 1}`);
}

// ── Resolution Engine ─────────────────────────────

/**
 * Replicate the exact resolution chain from the Astro components:
 *
 * 1. Check if any lorelog claims this poem via relatedHaiku/relatedLimerick
 * 2. Check if the poem's mascotRef/relatedMascots refs resolve via isMascotMatch()
 * 3. If neither: self-anchor fallback (ORPHAN)
 */
function resolvePoem(poem) {
  const result = {
    status: 'ORPHAN',
    parentType: null,
    parentId: null,
    resolvedVia: null,
    refs: [],
    issues: [],
    matchDetails: null,
  };

  // Collect all refs the poem declares
  const poemRefs = [poem.mascotRef, ...poem.relatedMascots].filter(Boolean);
  result.refs = poemRefs;

  // Check layout tags
  const hasLimerick = /<Limerick/i.test(poem.body || '');
  const hasBroside = /<Broside/i.test(poem.body || '');
  if (!hasLimerick && !hasBroside) {
    result.issues.push('Poem is missing required layout tags (<Limerick> or <Broside>)');
  }

  // ── Step 1: Lorelog claim check ──
  // This mirrors CollectionRegister's poemToLorelogMap lookup
  if (poemToLorelogMap.has(poem.poemName)) {
    const lorelogId = poemToLorelogMap.get(poem.poemName);
    result.status = 'PASS';
    result.parentType = 'lorelog';
    result.parentId = lorelogId;
    result.resolvedVia = 'lorelog.relatedHaiku/relatedLimerick';

    // Cross-check: if poem also declares a parentEntry, does it match?
    if (poem.parentEntry && poem.parentEntry !== 'null') {
      const declaredParents = (Array.isArray(poem.parentEntry) ? poem.parentEntry : [poem.parentEntry])
        .map(x => String(x).toLowerCase().trim());
      const actualLlg = lorelogId.toLowerCase().trim();
      const hasMatch = declaredParents.some(declared => actualLlg.includes(declared) || declared.includes(actualLlg));
      if (!hasMatch) {
        result.issues.push(`Poem declares parentEntry="${JSON.stringify(poem.parentEntry)}" but lorelog claiming it is "${lorelogId}"`);
      }
    }

    // Note: In MarkdownContent.astro, lorelog display uses relatedHaiku/relatedLimerick
    // but CollectionRegister uses poemToLorelogMap. Both should agree.
    return result;
  }

  // ── Step 2: Mascot ref resolution ──
  if (poemRefs.length > 0) {
    const matchedMascots = [];

    for (const ref of poemRefs) {
      for (const m of mascots) {
        if (isMascotMatch(ref, m)) {
          matchedMascots.push({ ref, mascotId: m.id, mascotTitle: m.title });
        }
      }
    }

    if (matchedMascots.length === 1) {
      result.status = 'PASS';
      result.parentType = 'mascot';
      result.parentId = matchedMascots[0].mascotId;
      result.resolvedVia = 'isMascotMatch()';
      result.matchDetails = matchedMascots[0];
      return result;
    }

    if (matchedMascots.length > 1) {
      // De-duplicate (same mascot matched by multiple refs)
      const unique = [...new Map(matchedMascots.map(m => [m.mascotId, m])).values()];
      if (unique.length === 1) {
        result.status = 'PASS';
        result.parentType = 'mascot';
        result.parentId = unique[0].mascotId;
        result.resolvedVia = 'isMascotMatch() (multi-ref, single mascot)';
        result.matchDetails = unique[0];
        return result;
      }

      result.status = 'AMBIGUOUS';
      result.parentType = 'mascot';
      result.parentId = unique.map(m => m.mascotId).join(', ');
      result.resolvedVia = 'isMascotMatch() matched multiple mascots';
      result.matchDetails = unique;
      result.issues.push(`Refs [${poemRefs.join(', ')}] match ${unique.length} different mascots: ${unique.map(m => m.mascotId).join(', ')}`);
      return result;
    }

    // Refs exist but matched nothing
    result.status = 'DEAD_REF';
    result.issues.push(`Refs [${poemRefs.join(', ')}] did not match any mascot via isMascotMatch()`);

    // Attempt to find what they MIGHT have meant
    const suggestions = [];
    for (const ref of poemRefs) {
      const cleanRef = ref.replace(/^mascots\//i, '').replace(/\.mdx?$/i, '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
      for (const m of mascots) {
        const cleanId = m.id.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
        // Check for partial overlap
        const refTokens = cleanRef.split(/\s+/).filter(t => !/^\d+$/.test(t) && t !== 'the');
        const idTokens = cleanId.split(/\s+/).filter(t => !/^\d+$/.test(t) && t !== 'the');
        const overlap = refTokens.filter(t => idTokens.includes(t));
        if (overlap.length > 0 && overlap.length >= Math.min(refTokens.length, idTokens.length) * 0.5) {
          suggestions.push({ ref, mascotId: m.id, overlap: overlap.join(', '), overlapRatio: overlap.length / Math.max(refTokens.length, idTokens.length) });
        }
      }
    }
    if (suggestions.length > 0) {
      suggestions.sort((a, b) => b.overlapRatio - a.overlapRatio);
      result.issues.push(`Closest partial matches: ${suggestions.slice(0, 3).map(s => `${s.mascotId} (tokens: ${s.overlap})`).join('; ')}`);
    }

    return result;
  }

  // ── Step 3: Check poem's parentEntry (poem-side declaration) ──
  // Some poems declare parentEntry but the parent doesn't claim them back (or it's a reference page which doesn't have explicit poem links, but they match).
  if (poem.parentEntry && poem.parentEntry !== 'null') {
    const declaredParents = (Array.isArray(poem.parentEntry) ? poem.parentEntry : [poem.parentEntry])
      .map(x => String(x).toLowerCase().trim());
    
    // Find if any of the declared parents exist in lorelogs
    const matchingLorelogs = lorelogs.filter(lg => {
      const lgId = lg.id.toLowerCase().trim();
      const lgCaseNum = lg.caseNumber ? lg.caseNumber.toLowerCase().trim() : '';
      return declaredParents.some(declared => lgId === declared || lgId.includes(declared) || declared.includes(lgId) || lgCaseNum === declared);
    });

    if (matchingLorelogs.length > 0) {
      // Lorelog exists but doesn't claim this poem
      result.status = 'UNCLAIMED';
      result.parentType = 'lorelog';
      result.parentId = matchingLorelogs.map(m => m.id).join(', ');
      result.resolvedVia = 'poem.parentEntry (NOT claimed by lorelog)';
      result.issues.push(`Poem declares parentEntry="${JSON.stringify(poem.parentEntry)}" and lorelog(s) "${result.parentId}" exist, but do NOT list this poem in relatedHaiku/relatedLimerick`);
      return result;
    }

    // Find if any of the declared parents exist in reference pages
    const matchingReferences = referenceDocs.filter(refDoc => {
      const refId = refDoc.id.toLowerCase().trim();
      const refCaseNum = refDoc.caseNumber ? refDoc.caseNumber.toLowerCase().trim() : '';
      return declaredParents.some(declared => refId === declared || refId.includes(declared) || declared.includes(refId) || refCaseNum === declared);
    });

    if (matchingReferences.length > 0) {
      // Reference page exists! Since reference pages don't have claim arrays, this is a PASS
      result.status = 'PASS';
      result.parentType = 'reference';
      result.parentId = matchingReferences[0].id;
      result.resolvedVia = 'parentEntry (matches reference page)';
      return result;
    }

    // Neither exists
    result.status = 'DEAD_REF';
    result.issues.push(`Poem declares parentEntry="${JSON.stringify(poem.parentEntry)}" but no matching lorelog or reference doc exists`);
    return result;
  }

  // Pure orphan — no refs at all
  result.status = 'ORPHAN';
  result.issues.push('No mascotRef, relatedMascots, or parentEntry declared; no lorelog claims this poem');
  return result;
}

// ── Run Audit ─────────────────────────────────────

console.error('\nRunning resolution audit...\n');

const results = allPoems.map(poem => {
  const resolution = resolvePoem(poem);
  return {
    file: path.relative(projectRoot, poem.file),
    basename: poem.basename,
    collection: poem.collection,
    poemName: poem.poemName,
    ...resolution,
  };
});

// ── Statistics ────────────────────────────────────

const stats = {
  total: results.length,
  pass: results.filter(r => r.status === 'PASS').length,
  orphan: results.filter(r => r.status === 'ORPHAN').length,
  deadRef: results.filter(r => r.status === 'DEAD_REF').length,
  unclaimed: results.filter(r => r.status === 'UNCLAIMED').length,
  ambiguous: results.filter(r => r.status === 'AMBIGUOUS').length,
  missingTags: results.filter(r => r.issues.some(i => i.includes('layout tags'))).length,
};

const byCollection = {};
for (const r of results) {
  if (!byCollection[r.collection]) {
    byCollection[r.collection] = { total: 0, pass: 0, orphan: 0, deadRef: 0, unclaimed: 0, ambiguous: 0, missingTags: 0 };
  }
  byCollection[r.collection].total++;
  if (r.status === 'PASS') byCollection[r.collection].pass++;
  else if (r.status === 'ORPHAN') byCollection[r.collection].orphan++;
  else if (r.status === 'DEAD_REF') byCollection[r.collection].deadRef++;
  else if (r.status === 'UNCLAIMED') byCollection[r.collection].unclaimed++;
  else if (r.status === 'AMBIGUOUS') byCollection[r.collection].ambiguous++;

  if (r.issues.some(i => i.includes('layout tags'))) {
    byCollection[r.collection].missingTags++;
  }
}

// ── Output ────────────────────────────────────────

if (jsonOutput) {
  console.log(JSON.stringify({ stats, byCollection, results }, null, 2));
  process.exit(0);
}

// Markdown output
const today = new Date().toISOString().split('T')[0];
const lines = [];
lines.push('---');
lines.push('title: "Poetry Alignment Audit Report"');
lines.push(`date: ${today}`);
lines.push(`updatedAt: ${today}`);
lines.push(`total_poems: ${stats.total}`);
lines.push(`pass_poems: ${stats.pass}`);
lines.push(`orphan_poems: ${stats.orphan}`);
lines.push(`dead_ref_poems: ${stats.deadRef}`);
lines.push(`unclaimed_poems: ${stats.unclaimed}`);
lines.push(`ambiguous_poems: ${stats.ambiguous}`);
lines.push(`missing_tags_poems: ${stats.missingTags}`);
if (batchNum != null) lines.push(`batch: ${batchNum}`);
if (collFilter) lines.push(`collection_filter: "${collFilter}"`);
lines.push('---');
lines.push('');
lines.push('# Poetry Alignment Audit Report');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
if (batchNum != null) lines.push(`Batch: ${batchNum}`);
if (collFilter) lines.push(`Collection filter: ${collFilter}`);
lines.push('');

// Summary
lines.push('## Summary');
lines.push('');
lines.push(`| Metric | Count |`);
lines.push(`|--------|-------|`);
lines.push(`| Total poems audited | ${stats.total} |`);
lines.push(`| ✅ PASS (resolves to parent) | ${stats.pass} |`);
lines.push(`| 🔴 ORPHAN (no parent found) | ${stats.orphan} |`);
lines.push(`| 💀 DEAD_REF (ref doesn't match) | ${stats.deadRef} |`);
lines.push(`| ⚠️ UNCLAIMED (lorelog exists but doesn't claim) | ${stats.unclaimed} |`);
lines.push(`| 🟡 AMBIGUOUS (multiple parents) | ${stats.ambiguous} |`);
lines.push(`| ❌ MISSING_TAGS (no <Limerick> or <Broside>) | ${stats.missingTags} |`);
lines.push('');

// Per-collection breakdown
lines.push('## Per-Collection Breakdown');
lines.push('');
lines.push('| Collection | Total | PASS | ORPHAN | DEAD_REF | UNCLAIMED | AMBIGUOUS | MISSING_TAGS |');
lines.push('|------------|-------|------|--------|----------|-----------|-----------|--------------|');
for (const [coll, s] of Object.entries(byCollection)) {
  lines.push(`| ${coll} | ${s.total} | ${s.pass} | ${s.orphan} | ${s.deadRef} | ${s.unclaimed} | ${s.ambiguous} | ${s.missingTags} |`);
}
lines.push('');

// Failures detail
const failures = results.filter(r => r.status !== 'PASS' || r.issues.length > 0);
if (failures.length > 0) {
  lines.push('## Non-Passing or Faulty Poems');
  lines.push('');
  lines.push('| File | Status | Refs | Parent Found | Issues |');
  lines.push('|------|--------|------|-------------|--------|');
  for (const f of failures) {
    const refs = f.refs.length > 0 ? f.refs.join(', ') : '(none)';
    const parent = f.parentId || '—';
    const issues = f.issues.join('; ') || '—';
    lines.push(`| \`${f.basename}\` | ${f.status} | ${refs} | ${parent} | ${issues} |`);
  }
  lines.push('');
}

// Passing poems (compact)
const passing = results.filter(r => r.status === 'PASS' && r.issues.length === 0);
if (passing.length > 0) {
  lines.push('## Passing Poems');
  lines.push('');
  lines.push(`<details><summary>Click to expand (${passing.length} poems)</summary>`);
  lines.push('');
  lines.push('| File | Parent Type | Parent ID | Resolved Via |');
  lines.push('|------|-------------|-----------|--------------|');
  for (const p of passing) {
    lines.push(`| \`${p.basename}\` | ${p.parentType} | ${p.parentId} | ${p.resolvedVia} |`);
  }
  lines.push('');
  lines.push('</details>');
  lines.push('');
}

// Write to exports/poetry-alignment-audit.md
const EXPORT_DIR = path.join(projectRoot, 'exports');
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}
const reportPath = path.join(EXPORT_DIR, 'poetry-alignment-audit.md');
fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
console.log(`✓ Created exports/poetry-alignment-audit.md`);

// Summary to stderr
console.error('─'.repeat(60));
console.error(`Audit complete: ${stats.pass} PASS (aligned) / ${stats.total - stats.pass} NON-PASS out of ${stats.total} poems`);
if (stats.orphan) console.error(`  🔴 ${stats.orphan} orphans (no parent at all)`);
if (stats.deadRef) console.error(`  💀 ${stats.deadRef} dead refs (ref doesn't match any mascot)`);
if (stats.unclaimed) console.error(`  ⚠️  ${stats.unclaimed} unclaimed (lorelog exists but doesn't list poem)`);
if (stats.ambiguous) console.error(`  🟡 ${stats.ambiguous} ambiguous (multiple parents matched)`);
if (stats.missingTags) console.error(`  ❌ ${stats.missingTags} missing layout tags (<Limerick> or <Broside>)`);
console.error('─'.repeat(60));
