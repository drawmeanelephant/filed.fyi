// scripts/migrate-poetry-frontmatter.mjs
//
// Normalizes poetry parent-link frontmatter:
//
// Phase A — historical case-file parents
//   relatedLorelog | relatedReferences | relatedEntries  →  parentEntry
//
// Phase B — mascot residue parents
//   mascotRef / relatedMascot / relatedMascots (e.g. "011.formee-formeson")
//     → parentEntry: MASCOT-FORMEE-FORMESON
//   Resolves slugs/ids against src/content/docs/mascots via isMascotMatch.
//   Does NOT overwrite an existing non-empty parentEntry (LLG/FFP/FREF keep primacy).
//   Leaves mascotRef / relatedMascots in place (still used by site matchers).
//
// Rules
// ─────
// 1. Only rewrite files that need a change.
// 2. Preserve exact YAML value text when renaming historical keys.
// 3. Set updatedAt to 2026-07-10 on every rewritten file.
// 4. Standalone poems (no historical parent, no resolvable mascot) stay untouched.
//
// Usage
// ─────
//   node scripts/migrate-poetry-frontmatter.mjs          # live run
//   node scripts/migrate-poetry-frontmatter.mjs --dry    # preview only

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DRY_RUN = process.argv.includes('--dry');
const UPDATED_AT = '2026-07-10';

/** Priority order when more than one historical key is present. */
const HISTORICAL_KEYS = ['relatedLorelog', 'relatedReferences', 'relatedEntries'];

const POETRY_DIRS = [
  path.resolve('./src/content/haikus'),
  path.resolve('./src/content/limericks'),
  path.resolve('./src/content/aphorisms'),
];

const MASCOTS_DIR = path.resolve('./src/content/docs/mascots');

// ─── file helpers ────────────────────────────────────────────────────────────

function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return null;

  const afterOpen = raw.indexOf('\n');
  if (afterOpen === -1) return null;

  const closeIdx = raw.indexOf('\n---', afterOpen + 1);
  if (closeIdx === -1) return null;

  const fmRaw = raw.slice(afterOpen + 1, closeIdx);
  const body = raw.slice(closeIdx + 4);
  return { fmRaw, body };
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

function setUpdatedAt(fmLines, actions) {
  const updatedRange = findTopLevelKeyRange(fmLines, 'updatedAt');
  if (updatedRange) {
    const prev = fmLines[updatedRange.start];
    fmLines[updatedRange.start] = `updatedAt: ${UPDATED_AT}`;
    if (updatedRange.end - updatedRange.start > 1) {
      fmLines.splice(updatedRange.start + 1, updatedRange.end - updatedRange.start - 1);
    }
    if (prev !== `updatedAt: ${UPDATED_AT}`) {
      actions.push(`updatedAt → ${UPDATED_AT}`);
    }
  } else {
    fmLines.push(`updatedAt: ${UPDATED_AT}`);
    actions.push(`added updatedAt: ${UPDATED_AT}`);
  }
}

function writeFrontmatter(filePath, fmLines, body) {
  const next = `---\n${fmLines.join('\n')}\n---${body.startsWith('\n') ? '' : '\n'}${body}`;
  if (!DRY_RUN) {
    fs.writeFileSync(filePath, next, 'utf8');
  }
  return next;
}

function hasMeaningfulParentEntry(data) {
  const pe = data?.parentEntry;
  if (pe == null || pe === '' || pe === 'null') return false;
  if (Array.isArray(pe) && pe.filter(Boolean).length === 0) return false;
  return true;
}

// ─── mascot index + isMascotMatch ────────────────────────────────────────────

/**
 * Mirrors src/lib/poetry-matcher.ts so poem refs like "011.formee-formeson"
 * resolve to the same mascot the site uses.
 */
function isMascotMatch(poemRef, mascot) {
  if (!poemRef || !mascot) return false;

  const clean = (s) => String(s)
    .replace(/^mascots\//i, '')
    .replace(/\.mdx?$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim();

  const rClean = clean(poemRef);
  const rTokens = rClean.split(/\s+/).filter(Boolean);

  const rLeadingNumber = rTokens.length > 0 && /^\d+$/.test(rTokens[0]) ? rTokens[0] : null;
  const mascotId = String(mascot.mascotId ?? '');
  if (rLeadingNumber && mascotId && rLeadingNumber === mascotId) return true;
  // Also accept zero-padded ids: "011" vs mascotId 11 / "11"
  if (rLeadingNumber && mascotId) {
    const nRef = String(parseInt(rLeadingNumber, 10));
    const nId = String(parseInt(mascotId, 10));
    if (!Number.isNaN(Number(nRef)) && nRef === nId && nRef !== 'NaN') {
      // Leading number alone is not enough if the rest of the slug disagrees —
      // only short-circuit when the ref is purely numeric.
      if (rTokens.length === 1) return true;
    }
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
    if (poemTextTokens.every(pt => mascotTokens.includes(pt))) return true;

    const titleTokens = cleanMascot(mascot.title || mascot.displayName || '');
    if (titleTokens.length > 0 && titleTokens.every(tt => poemTextTokens.includes(tt))) {
      return true;
    }
  }

  return false;
}

function loadMascots() {
  return collectFiles(MASCOTS_DIR).map((filePath) => {
    const data = matter(fs.readFileSync(filePath, 'utf8')).data || {};
    const id = path.basename(filePath, path.extname(filePath));
    return {
      filePath,
      id,
      mascotId: data.mascotId != null ? String(data.mascotId) : '',
      slug: data.slug || '',
      title: data.title || '',
      displayName: data.displayName || '',
      name: data.name || '',
      caseNumber: data.caseNumber ? String(data.caseNumber).toUpperCase() : '',
    };
  }).filter((m) => m.caseNumber);
}

function poemMascotRefs(data) {
  const refs = [
    data.mascotRef,
    data.relatedMascot,
    ...(Array.isArray(data.relatedMascots) ? data.relatedMascots : []),
  ];
  return refs
    .filter((v) => v != null && v !== '' && v !== 'null')
    .map(String);
}

/**
 * Resolve poem mascot refs → single MASCOT- caseNumber.
 * Preference order of refs as declared; first unique successful match wins.
 * Returns { caseNumber, ref, mascotId } or null.
 */
function resolveMascotParent(refs, mascots) {
  if (!refs.length) return null;

  for (const ref of refs) {
    const hits = mascots.filter((m) => isMascotMatch(ref, m));
    if (hits.length === 1) {
      return {
        caseNumber: hits[0].caseNumber,
        ref,
        mascotFile: hits[0].id,
      };
    }
    if (hits.length > 1) {
      // Prefer exact basename / slug hit when ambiguous
      const cleanRef = ref.toLowerCase().replace(/\.mdx?$/, '').split('/').pop();
      const exact = hits.find((m) => {
        const base = m.id.toLowerCase();
        const slug = (m.slug || '').toLowerCase().split('/').pop();
        return cleanRef === base || cleanRef === slug
          || cleanRef.replace(/^\d+\./, '') === base.replace(/^\d+\./, '')
          || cleanRef.replace(/^\d+\./, '') === (slug || '').replace(/^\d+\./, '');
      });
      const chosen = exact || hits[0];
      return {
        caseNumber: chosen.caseNumber,
        ref,
        mascotFile: chosen.id,
        ambiguous: hits.map((h) => h.id),
      };
    }
  }
  return null;
}

// ─── Phase A: historical case-file parents ───────────────────────────────────

function pickHistoricalParent(data) {
  for (const key of HISTORICAL_KEYS) {
    if (
      Object.prototype.hasOwnProperty.call(data, key)
      && data[key] != null
      && data[key] !== ''
      && data[key] !== 'null'
    ) {
      return { value: data[key], sourceKey: key };
    }
  }
  return null;
}

function applyHistoricalMigration(fmLines, data, actions) {
  const historical = pickHistoricalParent(data);
  if (!historical) return false;

  const hasParentEntry = hasMeaningfulParentEntry(data);
  const primaryRange = findTopLevelKeyRange(fmLines, historical.sourceKey);
  if (!primaryRange) {
    throw new Error(`historical key "${historical.sourceKey}" present in data but not found as top-level YAML key`);
  }

  if (!hasParentEntry) {
    fmLines[primaryRange.start] = fmLines[primaryRange.start].replace(
      new RegExp(`^${historical.sourceKey}:`),
      'parentEntry:'
    );
    actions.push(
      `${historical.sourceKey} → parentEntry (${JSON.stringify(historical.value)})`
    );
  } else {
    actions.push(
      `kept existing parentEntry (${JSON.stringify(data.parentEntry)}); dropping historical keys`
    );
  }

  for (const key of [...HISTORICAL_KEYS].reverse()) {
    const range = findTopLevelKeyRange(fmLines, key);
    if (!range) continue;
    fmLines.splice(range.start, range.end - range.start);
    if (key !== historical.sourceKey || hasParentEntry) {
      actions.push(`removed historical key ${key}`);
    }
  }

  return true;
}

// ─── Phase B: mascot refs → parentEntry: MASCOT-… ────────────────────────────

function applyMascotParentMigration(fmLines, data, mascots, actions) {
  // Never overwrite an existing case-file parent (LLG / FFP / FREF / …).
  if (hasMeaningfulParentEntry(data)) return false;

  // Also treat parentEntry already present on the edited line set.
  if (findTopLevelKeyRange(fmLines, 'parentEntry')) {
    const peRange = findTopLevelKeyRange(fmLines, 'parentEntry');
    const peLine = fmLines[peRange.start];
    const peVal = peLine.replace(/^parentEntry:\s*/, '').trim();
    if (peVal && peVal !== 'null' && peVal !== '""' && peVal !== "''") {
      return false;
    }
  }

  const refs = poemMascotRefs(data);
  let resolved = resolveMascotParent(refs, mascots);

  // Fallback: poem caseNumber already is MASCOT-…
  if (!resolved && data.caseNumber) {
    const cn = String(data.caseNumber).toUpperCase();
    if (cn.startsWith('MASCOT-') && mascots.some((m) => m.caseNumber === cn)) {
      resolved = { caseNumber: cn, ref: 'caseNumber', mascotFile: cn };
    }
  }

  if (!resolved) return false;

  const line = `parentEntry: ${resolved.caseNumber}`;

  // Insert near the primary mascot declaration for readability.
  const insertAfterKeys = ['mascotRef', 'relatedMascot', 'relatedMascots', 'title', 'slug'];
  let inserted = false;
  for (const key of insertAfterKeys) {
    const range = findTopLevelKeyRange(fmLines, key);
    if (!range) continue;
    fmLines.splice(range.end, 0, line);
    inserted = true;
    break;
  }
  if (!inserted) {
    fmLines.push(line);
  }

  const via = resolved.ref === 'caseNumber'
    ? 'caseNumber'
    : `mascot ref "${resolved.ref}" → ${resolved.mascotFile}`;
  actions.push(`set parentEntry: ${resolved.caseNumber} (via ${via})`);
  if (resolved.ambiguous) {
    actions.push(`  ⚠ ambiguous match, chose ${resolved.mascotFile} among ${resolved.ambiguous.join(', ')}`);
  }

  return true;
}

// ─── per-file driver ─────────────────────────────────────────────────────────

function processFile(filePath, mascots) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data || {};

  const split = splitFrontmatter(raw);
  if (!split) return null;

  const fmLines = split.fmRaw.split('\n');
  const actions = [];

  const didHistorical = applyHistoricalMigration(fmLines, data, actions);
  const didMascot = applyMascotParentMigration(fmLines, data, mascots, actions);

  if (!didHistorical && !didMascot) return null;

  setUpdatedAt(fmLines, actions);
  writeFrontmatter(filePath, fmLines, split.body);

  return { filePath, actions };
}

// ─── main ────────────────────────────────────────────────────────────────────

function run() {
  console.log('Loading mascots…');
  const mascots = loadMascots();
  console.log(`  ${mascots.length} mascots with caseNumber\n`);

  const allFiles = POETRY_DIRS.flatMap(collectFiles);
  const results = [];
  let errors = 0;
  let unresolvedMascot = 0;

  for (const filePath of allFiles) {
    try {
      // Count poems that have mascot refs but still won't get a parentEntry
      const data = matter(fs.readFileSync(filePath, 'utf8')).data || {};
      const refs = poemMascotRefs(data);
      if (!hasMeaningfulParentEntry(data) && refs.length > 0) {
        if (!resolveMascotParent(refs, mascots) && !(data.caseNumber && String(data.caseNumber).toUpperCase().startsWith('MASCOT-'))) {
          // will stay unresolved unless processFile finds something else
        }
      }

      const result = processFile(filePath, mascots);
      if (result) {
        results.push(result);
      } else if (!hasMeaningfulParentEntry(data) && refs.length > 0 && !resolveMascotParent(refs, mascots)) {
        unresolvedMascot += 1;
        if (unresolvedMascot <= 20) {
          console.warn(
            `  ⚠ unresolved mascot refs in ${path.relative(process.cwd(), filePath)}: ${refs.join(', ')}`
          );
        }
      }
    } catch (err) {
      errors += 1;
      console.error(`ERROR ${path.relative(process.cwd(), filePath)}: ${err.message}`);
    }
  }

  const prefix = DRY_RUN ? '[DRY RUN] ' : '';
  console.log(`\n${prefix}Poetry frontmatter migration complete.\n`);
  console.log(`  Scanned:              ${allFiles.length}`);
  console.log(`  Migrated:             ${results.length}`);
  console.log(`  Unresolved mascot refs: ${unresolvedMascot}`);
  console.log(`  Untouched:            ${allFiles.length - results.length - errors}`);
  if (errors) console.log(`  Errors:               ${errors}`);
  console.log('');

  for (const { filePath, actions } of results) {
    console.log(`  ✔ ${path.relative(process.cwd(), filePath)}`);
    for (const action of actions) {
      console.log(`      ${action}`);
    }
  }

  if (results.length === 0 && errors === 0) {
    console.log('  Nothing to migrate.');
  }
}

run();
