// scripts/normalize-version-fields.mjs
//
// Harmonizes the `version` and `versionLabel` frontmatter fields across all
// Markdown / MDX content files.
//
// Rules applied
// ─────────────
// 1. `version` must always be a quoted semver or numeric string: "1.0.0", "0.1.0", etc.
// 2. `versionLabel` is the home for human-readable descriptors.
// 3. If `version` contains a text label (non-numeric, non-semver):
//      → Move that text to `versionLabel` (if not already present / identical).
//      → Set `version` to "1.0.0".
// 4. Numeric coercions:
//      → Bare int / quoted int / single-quoted int  (1, "1", '1')  →  "1.0.0"
//      → v-prefixed semver  (v0.1.0)                               →  "0.1.0"
//      → Bare float          (1.0)                                  →  "1.0.0"
//      → Bare two-part semver (0.1.0, 1.0.0, 1.1.0 …)             →  "<same, quoted>"
// 5. If `versionLabel` exists but `version` is absent → add `version: "1.0.0"`.
// 6. Files that already have a correctly-quoted semver `version` are left alone.
//
// Usage
// ─────
//   node scripts/normalize-version-fields.mjs          # live run
//   node scripts/normalize-version-fields.mjs --dry    # preview only (no writes)

import fs from 'fs';
import path from 'path';

const DRY_RUN = process.argv.includes('--dry');
const DOCS_DIR = path.join(process.cwd(), 'src/content/docs');
const TODAY = new Date().toISOString().split('T')[0];

// ─── helpers ────────────────────────────────────────────────────────────────

/** Recursively collect all .md / .mdx files under a directory. */
function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

/** Strip surrounding YAML quotes (single or double). */
function stripYamlQuotes(s) {
  s = s.trim();
  if ((s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

/**
 * Classify a raw YAML scalar value string (the part after "version: ").
 *
 * Returns an object:
 *   { kind: 'semver' | 'numeric' | 'label', normalized: string, raw: string }
 *
 *   kind 'semver'  → value is (or can be trivially coerced to) a semver string
 *   kind 'numeric' → bare integer
 *   kind 'label'   → free-text descriptor
 *   normalized     → the canonical double-quoted-ready value (no outer quotes)
 */
function classifyVersionValue(rawScalar) {
  const unquoted = stripYamlQuotes(rawScalar);

  // v-prefixed semver: v0.1.0 → 0.1.0
  if (/^v\d+\.\d+\.\d+$/.test(unquoted)) {
    return { kind: 'semver', normalized: unquoted.slice(1), raw: rawScalar };
  }

  // Full semver (x.y.z)
  if (/^\d+\.\d+\.\d+$/.test(unquoted)) {
    return { kind: 'semver', normalized: unquoted, raw: rawScalar };
  }

  // Two-part version (x.y) — treat as x.y.0
  if (/^\d+\.\d+$/.test(unquoted)) {
    const [maj, min] = unquoted.split('.');
    return { kind: 'semver', normalized: `${maj}.${min}.0`, raw: rawScalar };
  }

  // Bare or quoted integer
  if (/^\d+$/.test(unquoted)) {
    return { kind: 'numeric', normalized: `${unquoted}.0.0`, raw: rawScalar };
  }

  // Everything else is a label
  return { kind: 'label', normalized: unquoted, raw: rawScalar };
}

// ─── frontmatter extraction ──────────────────────────────────────────────────

/**
 * Parse the YAML frontmatter block out of raw file content.
 * Returns { hasFrontmatter, fmStart, fmEnd, fmLines, bodyStart }
 *   fmStart / fmEnd  → character offsets of the opening/closing "---" lines
 *   fmLines          → the lines *between* the delimiters
 *   bodyStart        → character offset of everything after the closing "---\n"
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { hasFrontmatter: false };
  }
  const afterOpen = content.indexOf('\n') + 1;
  const closeIdx = content.indexOf('\n---', afterOpen);
  if (closeIdx === -1) {
    return { hasFrontmatter: false };
  }
  const fmRaw = content.slice(afterOpen, closeIdx);
  const bodyStart = closeIdx + 4; // skip "\n---"
  // skip optional trailing newline after closing ---
  const bodyOffset = content[bodyStart] === '\n' ? bodyStart + 1 : bodyStart;
  return {
    hasFrontmatter: true,
    fmRaw,
    bodyOffset,
  };
}

// ─── core transform ──────────────────────────────────────────────────────────

/**
 * Given the raw text of a single frontmatter block (lines between --- delimiters),
 * apply all version normalization rules and return:
 *   { changed: boolean, newFmRaw: string, actions: string[] }
 */
function transformFrontmatter(fmRaw, filePath) {
  const lines = fmRaw.split('\n');
  const actions = [];

  // Locate the version and versionLabel lines (top-level keys only — not indented)
  let versionLineIdx = -1;
  let versionLabelLineIdx = -1;
  let updatedAtLineIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (/^version:\s/.test(lines[i])) versionLineIdx = i;
    else if (/^versionLabel:\s/.test(lines[i])) versionLabelLineIdx = i;
    else if (/^updatedAt:\s/.test(lines[i])) updatedAtLineIdx = i;
  }

  const hasVersion = versionLineIdx !== -1;
  const hasVersionLabel = versionLabelLineIdx !== -1;

  // ── Case: no version field at all ──────────────────────────────────────────
  if (!hasVersion && !hasVersionLabel) {
    // Nothing to do for this file.
    return { changed: false, newFmRaw: fmRaw, actions };
  }

  // ── Case: versionLabel exists but version is absent ────────────────────────
  if (!hasVersion && hasVersionLabel) {
    // Insert version: "1.0.0" immediately before versionLabel
    lines.splice(versionLabelLineIdx, 0, 'version: "1.0.0"');
    actions.push('Inserted missing version: "1.0.0" (versionLabel was present)');
    versionLineIdx = versionLabelLineIdx;
    versionLabelLineIdx = versionLabelLineIdx + 1;
    // Fall through to the updatedAt bump below.
    return finalize(lines, updatedAtLineIdx, actions);
  }

  // ── Parse the current version scalar ──────────────────────────────────────
  const versionLine = lines[versionLineIdx];
  // Capture the scalar portion: everything after "version: "
  const versionScalarMatch = versionLine.match(/^version:\s+(.+)$/);
  if (!versionScalarMatch) {
    // Malformed line — skip
    return { changed: false, newFmRaw: fmRaw, actions };
  }
  const rawScalar = versionScalarMatch[1].trim();
  const { kind, normalized } = classifyVersionValue(rawScalar);

  if (kind === 'semver') {
    // Already a valid semver — just ensure it's double-quoted.
    const alreadyDoubleQuoted = /^"[^"]+"$/.test(rawScalar.trim());
    if (alreadyDoubleQuoted) {
      // Verify the normalized value inside the quotes matches what we'd produce.
      const inner = stripYamlQuotes(rawScalar);
      if (inner === normalized) {
        // Already perfect — nothing to do for this field.
        // Still might need updatedAt if other fields changed; but since nothing
        // changed here, return unchanged.
        return { changed: false, newFmRaw: fmRaw, actions };
      }
    }
    // Re-emit as double-quoted
    lines[versionLineIdx] = `version: "${normalized}"`;
    actions.push(`Normalized version: ${rawScalar} → "${normalized}"`);

  } else if (kind === 'numeric') {
    lines[versionLineIdx] = `version: "${normalized}"`;
    actions.push(`Coerced numeric version: ${rawScalar} → "${normalized}"`);

  } else {
    // kind === 'label' — demote to versionLabel, set version to "1.0.0"
    const labelText = normalized;

    if (hasVersionLabel) {
      const existingLabelLine = lines[versionLabelLineIdx];
      const existingLabelMatch = existingLabelLine.match(/^versionLabel:\s+(.+)$/);
      const existingLabel = existingLabelMatch
        ? stripYamlQuotes(existingLabelMatch[1].trim())
        : '';

      if (existingLabel === labelText) {
        // versionLabel already carries the same text — just fix version
        lines[versionLineIdx] = `version: "1.0.0"`;
        actions.push(`Demoted duplicate label in version → "1.0.0" (versionLabel unchanged: "${labelText}")`);
      } else {
        // Different label already in versionLabel — preserve it, warn
        lines[versionLineIdx] = `version: "1.0.0"`;
        actions.push(`Demoted version label to "1.0.0"; existing versionLabel differs — kept as-is ("${existingLabel}")`);
        actions.push(`  ⚠ Discarded version label: "${labelText}"`);
      }
    } else {
      // No versionLabel — insert one after the version line
      lines[versionLineIdx] = `version: "1.0.0"`;
      lines.splice(versionLineIdx + 1, 0, `versionLabel: "${labelText}"`);
      actions.push(`Demoted label from version: "${labelText}" → versionLabel; set version: "1.0.0"`);
    }
  }

  return finalize(lines, updatedAtLineIdx, actions);
}

/** Bump updatedAt and return the final result object. */
function finalize(lines, updatedAtLineIdx, actions) {
  // Bump updatedAt if found
  if (updatedAtLineIdx !== -1) {
    const old = lines[updatedAtLineIdx];
    lines[updatedAtLineIdx] = `updatedAt: ${TODAY}`;
    if (old !== lines[updatedAtLineIdx]) {
      actions.push(`Bumped updatedAt → ${TODAY}`);
    }
  }

  return {
    changed: true,
    newFmRaw: lines.join('\n'),
    actions,
  };
}

// ─── file processor ──────────────────────────────────────────────────────────

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);

  if (!parsed.hasFrontmatter) return null;

  const { fmRaw, bodyOffset } = parsed;
  const { changed, newFmRaw, actions } = transformFrontmatter(fmRaw, filePath);

  if (!changed) return null;

  const newContent = `---\n${newFmRaw}\n---\n${content.slice(bodyOffset)}`;

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }

  return { filePath, actions };
}

// ─── main ────────────────────────────────────────────────────────────────────

function run() {
  const allFiles = collectFiles(DOCS_DIR);
  const results = [];

  for (const filePath of allFiles) {
    try {
      const result = processFile(filePath);
      if (result) results.push(result);
    } catch (err) {
      console.error(`ERROR processing ${path.relative(process.cwd(), filePath)}: ${err.message}`);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const prefix = DRY_RUN ? '[DRY RUN] ' : '';
  console.log(`\n${prefix}Version normalization complete.\n`);
  console.log(`  Files ${DRY_RUN ? 'would be modified' : 'modified'}: ${results.length}\n`);

  for (const { filePath, actions } of results) {
    const rel = path.relative(process.cwd(), filePath);
    console.log(`  ✔ ${rel}`);
    for (const action of actions) {
      console.log(`      ${action}`);
    }
  }

  if (results.length === 0) {
    console.log('  Nothing to do — all version fields are already normalized.');
  }
}

run();
