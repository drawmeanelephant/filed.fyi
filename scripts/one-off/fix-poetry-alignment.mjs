#!/usr/bin/env node
/**
 * fix-poetry-alignment.mjs
 *
 * Fixes issues reported by scripts/audit-poetry-alignment.mjs:
 *
 *   UNCLAIMED — poem declares parentEntry to a lorelog that exists but does not
 *               claim the poem → add relatedHaiku / relatedLimerick / relatedEntries
 *   ORPHAN    — no parent declared
 *     - FREF basename    → set parentEntry to FREF-… (reference pages)
 *     - LLG / DS / map   → set parentEntry + claim on lorelog
 *     - mascot basename  → set mascotRef
 *
 * Usage:
 *   node scripts/one-off/fix-poetry-alignment.mjs           # dry-run
 *   node scripts/one-off/fix-poetry-alignment.mjs --run     # write changes
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import parseFrontmatter from '../lib/parse-frontmatter.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(projectRoot, 'src/content/docs');
const contentDir = path.join(projectRoot, 'src/content');
const RUN = process.argv.includes('--run');
const TODAY = new Date().toISOString().split('T')[0];

// ── FS helpers ────────────────────────────────────

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

function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return null;
  const afterOpen = raw.indexOf('\n');
  if (afterOpen === -1) return null;
  const closeIdx = raw.indexOf('\n---', afterOpen + 1);
  if (closeIdx === -1) return null;
  return {
    fmRaw: raw.slice(afterOpen + 1, closeIdx),
    body: raw.slice(closeIdx + 4),
  };
}

function findTopLevelKeyRange(fmLines, key) {
  const keyRe = new RegExp(`^${key}:(\\s|$)`);
  let start = -1;
  for (let i = 0; i < fmLines.length; i++) {
    if (keyRe.test(fmLines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) return null;
  let end = start + 1;
  while (end < fmLines.length) {
    const line = fmLines[end];
    if (line.length > 0 && !/^\s/.test(line) && !line.startsWith('#')) break;
    end += 1;
  }
  return { start, end };
}

function setScalarKey(fmLines, key, value) {
  const quoted = typeof value === 'string' ? `"${value}"` : String(value);
  const range = findTopLevelKeyRange(fmLines, key);
  if (range) {
    fmLines[range.start] = `${key}: ${quoted}`;
    if (range.end - range.start > 1) {
      fmLines.splice(range.start + 1, range.end - range.start - 1);
    }
  } else {
    // Prefer after slug/title/caseNumber; else append
    const anchors = ['caseNumber', 'slug', 'title'];
    let inserted = false;
    for (const a of anchors) {
      const r = findTopLevelKeyRange(fmLines, a);
      if (r) {
        fmLines.splice(r.end, 0, `${key}: ${quoted}`);
        inserted = true;
        break;
      }
    }
    if (!inserted) fmLines.push(`${key}: ${quoted}`);
  }
  // touch updatedAt
  const u = findTopLevelKeyRange(fmLines, 'updatedAt');
  if (u) fmLines[u.start] = `updatedAt: ${TODAY}`;
  else fmLines.push(`updatedAt: ${TODAY}`);
}

function writeFrontmatter(filePath, mutateLines) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const split = splitFrontmatter(raw);
  if (!split) throw new Error(`No frontmatter: ${filePath}`);
  const fmLines = split.fmRaw.split('\n');
  mutateLines(fmLines);
  // drop trailing empty lines inside FM for cleanliness
  while (fmLines.length && fmLines[fmLines.length - 1] === '') fmLines.pop();
  const next = `---\n${fmLines.join('\n')}\n---${split.body.startsWith('\n') ? '' : '\n'}${split.body}`;
  if (RUN) fs.writeFileSync(filePath, next, 'utf8');
  return next;
}

/**
 * Ensure a lorelog claims a poem.
 * haikus  → relatedHaiku:  - slug: haikus/<basename>
 * limericks → relatedLimerick: - slug: limericks/<basename>
 * aphorisms → relatedEntries: - collection: "aphorisms" / id: "<basename>"
 */
function ensureLorelogClaim(lorelogFile, collection, poemBasename) {
  const raw = fs.readFileSync(lorelogFile, 'utf8');
  const split = splitFrontmatter(raw);
  if (!split) throw new Error(`No frontmatter: ${lorelogFile}`);
  const fmLines = split.fmRaw.split('\n');
  const { frontmatter } = parseFrontmatter(lorelogFile);
  let changed = false;

  if (collection === 'haikus' || collection === 'limericks') {
    const key = collection === 'haikus' ? 'relatedHaiku' : 'relatedLimerick';
    const slug = `${collection}/${poemBasename}`;
    const existing = frontmatter[key] ?? [];
    const list = Array.isArray(existing) ? existing : existing ? [existing] : [];
    const already = list.some((item) => {
      const s = (item && item.slug ? item.slug : String(item || '')).toLowerCase();
      return s === slug.toLowerCase() || s.endsWith('/' + poemBasename.toLowerCase());
    });
    if (already) return false;

    const range = findTopLevelKeyRange(fmLines, key);
    if (range) {
      // Insert as first item under the key
      fmLines.splice(range.start + 1, 0, `  - slug: ${slug}`);
    } else {
      // Add new key before tags or at end
      const tagsRange = findTopLevelKeyRange(fmLines, 'tags');
      const block = [`${key}:`, `  - slug: ${slug}`];
      if (tagsRange) fmLines.splice(tagsRange.start, 0, ...block);
      else fmLines.push(...block);
    }
    changed = true;
  } else if (collection === 'aphorisms') {
    const existing = frontmatter.relatedEntries ?? [];
    const list = Array.isArray(existing) ? existing : [];
    const already = list.some(
      (re) =>
        re &&
        re.collection === 'aphorisms' &&
        String(re.id || '').toLowerCase() === poemBasename.toLowerCase(),
    );
    if (already) return false;

    const range = findTopLevelKeyRange(fmLines, 'relatedEntries');
    const entryLines = [
      `  - collection: "aphorisms"`,
      `    id: "${poemBasename}"`,
    ];
    if (range) {
      fmLines.splice(range.start + 1, 0, ...entryLines);
    } else {
      const tagsRange = findTopLevelKeyRange(fmLines, 'tags');
      const block = ['relatedEntries:', ...entryLines];
      if (tagsRange) fmLines.splice(tagsRange.start, 0, ...block);
      else fmLines.push(...block);
    }
    changed = true;
  }

  if (!changed) return false;

  const u = findTopLevelKeyRange(fmLines, 'updatedAt');
  if (u) fmLines[u.start] = `updatedAt: "${TODAY}"`;
  else fmLines.push(`updatedAt: "${TODAY}"`);

  while (fmLines.length && fmLines[fmLines.length - 1] === '') fmLines.pop();
  const next = `---\n${fmLines.join('\n')}\n---${split.body.startsWith('\n') ? '' : '\n'}${split.body}`;
  if (RUN) fs.writeFileSync(lorelogFile, next, 'utf8');
  return true;
}

// ── Load catalogs ─────────────────────────────────

console.error(RUN ? '=== LIVE RUN ===' : '=== DRY RUN (pass --run to write) ===');

const lorelogFiles = getMdxFiles(path.join(docsDir, 'lorelog'));
const lorelogs = lorelogFiles.map((f) => {
  const { frontmatter } = parseFrontmatter(f);
  return {
    id: path.basename(f, path.extname(f)),
    file: f,
    caseNumber: frontmatter.caseNumber ?? null,
    relatedHaiku: frontmatter.relatedHaiku ?? [],
    relatedLimerick: frontmatter.relatedLimerick ?? [],
    relatedEntries: frontmatter.relatedEntries ?? [],
  };
});
const lorelogById = new Map(lorelogs.map((l) => [l.id.toLowerCase(), l]));
const lorelogByCase = new Map(
  lorelogs.filter((l) => l.caseNumber).map((l) => [String(l.caseNumber).toLowerCase(), l]),
);

const mascotFiles = getMdxFiles(path.join(docsDir, 'mascots'));
const mascotIds = new Set(mascotFiles.map((f) => path.basename(f, path.extname(f)).toLowerCase()));

const referenceFiles = getMdxFiles(path.join(docsDir, 'reference'));
const referenceCaseNumbers = new Set();
const referenceIds = new Set();
for (const f of referenceFiles) {
  const { frontmatter } = parseFrontmatter(f);
  const id = path.basename(f, path.extname(f));
  referenceIds.add(id.toLowerCase());
  if (frontmatter.caseNumber) referenceCaseNumbers.add(String(frontmatter.caseNumber).toUpperCase());
  // Also accept FREF from filename
  const m = id.match(/^(fref-\d+.*)$/i);
  if (m) referenceCaseNumbers.add(m[1].toUpperCase());
}

// Claim map (poemName → lorelogId) — same as audit
const poemToLorelogMap = new Map();
for (const lg of lorelogs) {
  for (const h of lg.relatedHaiku || []) {
    if (h && h.slug) {
      const hName = h.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';
      if (hName) poemToLorelogMap.set(hName, lg.id);
    }
  }
  for (const l of lg.relatedLimerick || []) {
    if (l && l.slug) {
      const lName = l.slug.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';
      if (lName) poemToLorelogMap.set(lName, lg.id);
    }
  }
  for (const re of lg.relatedEntries || []) {
    if (re && re.id && ['haikus', 'limericks', 'aphorisms'].includes(re.collection)) {
      const pName = re.id.split('/').pop()?.replace(/\.mdx?$/, '').toLowerCase().trim() || '';
      if (pName) poemToLorelogMap.set(pName, lg.id);
    }
  }
}

function resolveLorelog(declared) {
  if (!declared) return null;
  const d = String(declared).toLowerCase().trim();
  if (lorelogById.has(d)) return lorelogById.get(d);
  if (lorelogByCase.has(d)) return lorelogByCase.get(d);
  // fuzzy: strip optional LLG- prefix mismatch, includes
  for (const lg of lorelogs) {
    const lgId = lg.id.toLowerCase();
    const lgCase = lg.caseNumber ? String(lg.caseNumber).toLowerCase() : '';
    if (lgId === d || lgCase === d) return lg;
    if (lgId.includes(d) || d.includes(lgId)) return lg;
    if (lgCase && (lgCase.includes(d) || d.includes(lgCase))) return lg;
    // LLG-SRB-SESSION-NOTES ↔ SRB-SESSION-NOTES
    if (d.replace(/^llg-/, '') === lgId.replace(/^llg-/, '')) return lg;
  }
  return null;
}

function extractFrefCode(basename) {
  const m = basename.match(/FREF-(\d+[A-Z0-9-]*)/i);
  if (!m) return null;
  return `FREF-${m[1].toUpperCase()}`;
}

function extractParentFromBasename(basename) {
  // APH-LLG-0316-MBR → LLG-0316-MBR
  // APH-DS-404-ALPHA → DS-404-ALPHA
  // APH-map-inc-14 → map-inc-14
  // LIM-FREF-0500-EGYX → FREF-0500-EGYX
  const fref = extractFrefCode(basename);
  if (fref) return { type: 'fref', id: fref };

  const stripped = basename.replace(/^(APH|HAI|LIM|hai|lim|aph)-/i, '');
  if (/^(LLG-|DS-|map-)/i.test(stripped)) {
    return { type: 'lorelog', id: stripped };
  }
  if (mascotIds.has(stripped.toLowerCase())) {
    return { type: 'mascot', id: stripped };
  }
  // hai-040-pngbert-flatly style (no APH- prefix pattern with leading number)
  if (mascotIds.has(basename.toLowerCase())) {
    return { type: 'mascot', id: basename };
  }
  // try stripping hai-/lim-/aph- then looking for NNN.name
  const m = basename.match(/^(?:hai|lim|aph|APH|HAI|LIM)-?(\d{3}\..+)$/);
  if (m && mascotIds.has(m[1].toLowerCase())) {
    return { type: 'mascot', id: m[1] };
  }
  // basename is like hai-040-pngbert-flatly but mascot is 040.pngbert-flatly
  const dotted = basename.replace(/^(hai|lim|aph)-(\d{3})-/i, '$2.');
  if (dotted !== basename && mascotIds.has(dotted.toLowerCase())) {
    return { type: 'mascot', id: dotted };
  }
  return null;
}

// ── Load poems & decide fixes ─────────────────────

const poetryCollections = [
  { id: 'haikus', dir: path.join(contentDir, 'haikus') },
  { id: 'limericks', dir: path.join(contentDir, 'limericks') },
  { id: 'aphorisms', dir: path.join(contentDir, 'aphorisms') },
];

const stats = {
  unclaimedClaimed: 0,
  orphanParentSet: 0,
  orphanMascotSet: 0,
  orphanClaimed: 0,
  skipped: 0,
  errors: [],
};

const actions = [];

for (const coll of poetryCollections) {
  for (const file of getMdxFiles(coll.dir)) {
    const { frontmatter } = parseFrontmatter(file);
    const basename = path.basename(file, path.extname(file));
    const poemName = basename.toLowerCase().trim();
    const parentEntry = frontmatter.parentEntry ?? frontmatter.relatedLorelog ?? null;
    const mascotRef = frontmatter.mascotRef ?? null;
    const relatedMascots = Array.isArray(frontmatter.relatedMascots)
      ? frontmatter.relatedMascots.filter(Boolean)
      : [];
    const poemRefs = [mascotRef, ...relatedMascots].filter(Boolean);

    // Already claimed by a lorelog → nothing to do for alignment
    if (poemToLorelogMap.has(poemName)) continue;

    // Has mascot refs — audit resolves via isMascotMatch; leave alone unless orphan-ish
    // (if refs exist we don't treat as orphan)

    // Case A: has parentEntry → find lorelog and claim (UNCLAIMED path)
    if (parentEntry && parentEntry !== 'null') {
      const declared = Array.isArray(parentEntry) ? parentEntry : [parentEntry];
      let claimed = false;
      for (const d of declared) {
        const lg = resolveLorelog(d);
        if (lg) {
          actions.push({
            kind: 'claim',
            poem: basename,
            collection: coll.id,
            lorelog: lg.id,
            file,
            lorelogFile: lg.file,
          });
          claimed = true;
          break;
        }
      }
      // If parentEntry points at FREF/mascot/guide etc., audit already PASSes — skip
      if (!claimed) {
        // nothing
      }
      continue;
    }

    // Case B: pure orphan (no parent, no mascot refs that we can rely on)
    // Note: dead mascot refs are handled by audit separately; we only fix empty orphans
    if (poemRefs.length > 0) continue;

    const inferred = extractParentFromBasename(basename);
    if (!inferred) {
      stats.skipped++;
      stats.errors.push(`Could not infer parent for orphan ${basename}`);
      continue;
    }

    if (inferred.type === 'fref') {
      // Verify reference roughly exists
      const ok =
        referenceCaseNumbers.has(inferred.id.toUpperCase()) ||
        referenceIds.has(inferred.id.toLowerCase()) ||
        referenceIds.has(inferred.id.toLowerCase().replace(/^fref-/, 'fref-')) ||
        [...referenceIds].some((id) => id.includes(inferred.id.toLowerCase().replace(/^fref-/, '')));
      actions.push({
        kind: 'set-parent',
        poem: basename,
        collection: coll.id,
        parentEntry: inferred.id,
        file,
        note: ok ? 'fref' : 'fref (unverified ref file)',
      });
    } else if (inferred.type === 'lorelog') {
      const lg = resolveLorelog(inferred.id);
      if (!lg) {
        stats.skipped++;
        stats.errors.push(`No lorelog for inferred ${inferred.id} (${basename})`);
        continue;
      }
      actions.push({
        kind: 'set-parent-and-claim',
        poem: basename,
        collection: coll.id,
        parentEntry: lg.caseNumber || lg.id,
        lorelog: lg.id,
        file,
        lorelogFile: lg.file,
      });
    } else if (inferred.type === 'mascot') {
      actions.push({
        kind: 'set-mascot',
        poem: basename,
        collection: coll.id,
        mascotRef: inferred.id,
        file,
      });
    }
  }
}

// ── Apply ─────────────────────────────────────────

console.error(`Planned actions: ${actions.length}`);

for (const a of actions) {
  try {
    if (a.kind === 'claim') {
      const did = ensureLorelogClaim(a.lorelogFile, a.collection, a.poem);
      if (did) {
        stats.unclaimedClaimed++;
        console.log(`[claim] ${a.collection}/${a.poem} → ${a.lorelog}`);
      } else {
        console.log(`[claim-skip] already claimed ${a.collection}/${a.poem} on ${a.lorelog}`);
      }
    } else if (a.kind === 'set-parent') {
      writeFrontmatter(a.file, (lines) => {
        setScalarKey(lines, 'parentEntry', a.parentEntry);
      });
      stats.orphanParentSet++;
      console.log(`[parent] ${a.collection}/${a.poem} parentEntry=${a.parentEntry} (${a.note || ''})`);
    } else if (a.kind === 'set-parent-and-claim') {
      writeFrontmatter(a.file, (lines) => {
        setScalarKey(lines, 'parentEntry', a.parentEntry);
      });
      stats.orphanParentSet++;
      const did = ensureLorelogClaim(a.lorelogFile, a.collection, a.poem);
      if (did) stats.orphanClaimed++;
      console.log(
        `[parent+claim] ${a.collection}/${a.poem} parentEntry=${a.parentEntry} → ${a.lorelog}`,
      );
    } else if (a.kind === 'set-mascot') {
      writeFrontmatter(a.file, (lines) => {
        setScalarKey(lines, 'mascotRef', a.mascotRef);
        // null out empty mascotRef null if present as null literal is handled by set
      });
      stats.orphanMascotSet++;
      console.log(`[mascot] ${a.collection}/${a.poem} mascotRef=${a.mascotRef}`);
    }
  } catch (err) {
    stats.errors.push(`${a.poem}: ${err.message}`);
    console.error(`ERROR ${a.poem}:`, err.message);
  }
}

console.error('─'.repeat(60));
console.error(`unclaimed → claimed:     ${stats.unclaimedClaimed}`);
console.error(`orphan parentEntry set:  ${stats.orphanParentSet}`);
console.error(`orphan lorelog claimed:  ${stats.orphanClaimed}`);
console.error(`orphan mascotRef set:    ${stats.orphanMascotSet}`);
console.error(`skipped:                 ${stats.skipped}`);
if (stats.errors.length) {
  console.error(`errors (${stats.errors.length}):`);
  for (const e of stats.errors.slice(0, 30)) console.error(`  - ${e}`);
}
console.error(RUN ? 'Changes written.' : 'Dry run only — re-run with --run to apply.');
console.error('─'.repeat(60));
