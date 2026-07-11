// scripts/migrate-poetry-frontmatter.mjs
//
// Normalizes historical parent-link frontmatter on poetry collections:
//   relatedLorelog | relatedReferences | relatedEntries  →  parentEntry
//
// Rules
// ─────
// 1. Only rewrite files that declare at least one historical field.
// 2. Preserve the exact string/array value when renaming to parentEntry.
// 3. Prefer relatedLorelog, then relatedReferences, then relatedEntries
//    when more than one historical key is present.
// 4. Always drop the historical keys after migration.
// 5. Set updatedAt to 2026-07-10 on every rewritten file.
// 6. Standalone poems (no historical parent fields) are left untouched.
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

/** Recursively collect .md / .mdx files under a directory. */
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

/**
 * Split a markdown/MDX file into frontmatter lines + body, without re-serializing YAML.
 * Returns null when the file has no valid frontmatter block.
 */
function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return null;

  const afterOpen = raw.indexOf('\n');
  if (afterOpen === -1) return null;

  const closeIdx = raw.indexOf('\n---', afterOpen + 1);
  if (closeIdx === -1) return null;

  const fmRaw = raw.slice(afterOpen + 1, closeIdx);
  let bodyStart = closeIdx + 4; // past "\n---"
  // Keep the newline after closing --- if present (body includes leading \n).
  const body = raw.slice(bodyStart);
  const openLine = raw.slice(0, afterOpen + 1); // "---\n" (or "---\r\n")

  return { openLine, fmRaw, body };
}

/**
 * Find top-level YAML key line ranges in frontmatter text.
 * Multi-line values (folded scalars, indented blocks) are included until the next top-level key.
 */
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
    // Next top-level key (no leading whitespace, not empty, not a comment-only continuation heuristic)
    if (line.length > 0 && !/^\s/.test(line) && !line.startsWith('#')) {
      break;
    }
    end += 1;
  }

  return { start, end };
}

/**
 * Pick the parent value from historical keys via gray-matter data (priority order).
 * Returns { value, sourceKey } or null when none are present.
 */
function pickHistoricalParent(data) {
  for (const key of HISTORICAL_KEYS) {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] != null && data[key] !== '') {
      return { value: data[key], sourceKey: key };
    }
  }
  return null;
}

/**
 * Migrate one poetry file. Returns a summary object, or null if untouched.
 *
 * Uses gray-matter for detection, then line-level edits so the exact YAML
 * scalar/block for the parent value is preserved (no full re-stringify).
 */
function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data || {};

  const historical = pickHistoricalParent(data);
  if (!historical) {
    // Standalone poem — do not invent parentEntry, do not touch the file.
    return null;
  }

  const split = splitFrontmatter(raw);
  if (!split) {
    throw new Error('gray-matter parsed data but raw frontmatter split failed');
  }

  const fmLines = split.fmRaw.split('\n');
  const actions = [];
  const hasParentEntry = data.parentEntry != null && data.parentEntry !== '';

  // 1) Rename primary historical key → parentEntry in place (preserves exact value text).
  const primaryRange = findTopLevelKeyRange(fmLines, historical.sourceKey);
  if (!primaryRange) {
    throw new Error(`historical key "${historical.sourceKey}" present in data but not found as top-level YAML key`);
  }

  if (!hasParentEntry) {
    const primaryLine = fmLines[primaryRange.start];
    fmLines[primaryRange.start] = primaryLine.replace(
      new RegExp(`^${historical.sourceKey}:`),
      'parentEntry:'
    );
    actions.push(
      `${historical.sourceKey} → parentEntry (${JSON.stringify(historical.value)})`
    );
  } else {
    // parentEntry already set — drop historical keys only.
    actions.push(
      `kept existing parentEntry (${JSON.stringify(data.parentEntry)}); dropping historical keys`
    );
  }

  // 2) Remove all historical keys (primary may already be renamed; others still present).
  // Work from bottom to top so indices stay valid.
  for (const key of [...HISTORICAL_KEYS].reverse()) {
    const range = findTopLevelKeyRange(fmLines, key);
    if (!range) continue;
    fmLines.splice(range.start, range.end - range.start);
    if (key !== historical.sourceKey || hasParentEntry) {
      actions.push(`removed historical key ${key}`);
    }
  }

  // 3) Set / bump updatedAt.
  const updatedRange = findTopLevelKeyRange(fmLines, 'updatedAt');
  if (updatedRange) {
    const prev = fmLines[updatedRange.start];
    fmLines[updatedRange.start] = `updatedAt: ${UPDATED_AT}`;
    // Drop any multi-line continuation of the old updatedAt (rare).
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

  const next = `---\n${fmLines.join('\n')}\n---${split.body.startsWith('\n') ? '' : '\n'}${split.body}`;

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, next, 'utf8');
  }

  return { filePath, actions };
}

function run() {
  const allFiles = POETRY_DIRS.flatMap(collectFiles);
  const results = [];
  let errors = 0;

  for (const filePath of allFiles) {
    try {
      const result = processFile(filePath);
      if (result) results.push(result);
    } catch (err) {
      errors += 1;
      console.error(`ERROR ${path.relative(process.cwd(), filePath)}: ${err.message}`);
    }
  }

  const prefix = DRY_RUN ? '[DRY RUN] ' : '';
  console.log(`\n${prefix}Poetry frontmatter migration complete.\n`);
  console.log(`  Scanned:  ${allFiles.length}`);
  console.log(`  Migrated: ${results.length}`);
  console.log(`  Standalone (untouched): ${allFiles.length - results.length - errors}`);
  if (errors) console.log(`  Errors:   ${errors}`);
  console.log('');

  for (const { filePath, actions } of results) {
    console.log(`  ✔ ${path.relative(process.cwd(), filePath)}`);
    for (const action of actions) {
      console.log(`      ${action}`);
    }
  }

  if (results.length === 0 && errors === 0) {
    console.log('  Nothing to migrate — no historical parent fields found.');
  }
}

run();
