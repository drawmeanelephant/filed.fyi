// scripts/astro-grave-audit.mjs
import fs from 'node:fs';
import path from 'node:path';
import parseFrontmatter from './lib/parse-frontmatter.mjs';

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, 'src/content');
const EXPORT_FILE = path.join(ROOT_DIR, 'exports/grave-audit.md');

// Helper to recursively get files matching extensions
function getFilesRecursive(dir, extensions = ['.md', '.mdx']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // Avoid scanning standard excluded directories
      if (['node_modules', '.git', '.astro', '.cache', 'exports', '.rag', 'dist'].includes(file)) continue;
      results.push(...getFilesRecursive(filePath, extensions));
    } else {
      if (extensions.includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

function main() {
  console.log('▶ Starting Rotkeeper Grave Audit (Tombstone & Keyspace Integrity)...');

  const report = {
    mutedEpitaphs: [],
    indexCollisions: [],
    filenamingDecay: [],
    asymmetricalTombs: [],
    orphanPoems: []
  };

  // 1. Keyspace Desecration (Mascot Index Collisions)
  const mascotsDir = path.join(CONTENT_DIR, 'docs/mascots');
  const mascotFiles = getFilesRecursive(mascotsDir);
  const mascotIndexes = new Map();

  for (const file of mascotFiles) {
    const base = path.basename(file);
    const match = base.match(/^(\d{3})\./);
    if (match) {
      const idx = match[1];
      if (mascotIndexes.has(idx)) {
        mascotIndexes.get(idx).push(file);
      } else {
        mascotIndexes.set(idx, [file]);
      }
    }
  }

  for (const [idx, files] of mascotIndexes.entries()) {
    if (files.length > 1) {
      report.indexCollisions.push({
        index: idx,
        files: files.map(f => path.relative(ROOT_DIR, f))
      });
    }
  }

  // 2. Epitaph Decay & Naming Convention Deviations
  const allContentFiles = getFilesRecursive(CONTENT_DIR);
  for (const file of allContentFiles) {
    const relPath = path.relative(ROOT_DIR, file);
    const base = path.basename(file);

    // Check double extension md.mdx
    if (base.endsWith('.md.mdx')) {
      report.filenamingDecay.push({
        file: relPath,
        issue: "Double extension 'md.mdx' detected in filename."
      });
    }

    // Check frontmatter
    let parsed;
    try {
      parsed = parseFrontmatter(file);
      const title = parsed.frontmatter.title;

      // Check folded block scalar (e.g. title: >-)
      const rawContent = fs.readFileSync(file, 'utf8');
      const hasFoldedScalar = /^title:\s*>-/m.test(rawContent);

      if (hasFoldedScalar) {
        report.mutedEpitaphs.push({
          file: relPath,
          issue: "Title field resolved as folded scalar placeholder '>-'."
        });
      } else if (title === undefined || title === null) {
        report.mutedEpitaphs.push({
          file: relPath,
          issue: "Title field is missing entirely."
        });
      } else if (typeof title === 'string' && title.trim() === '') {
        report.mutedEpitaphs.push({
          file: relPath,
          issue: "Title field exists but contains no value."
        });
      }
    } catch (err) {
      report.mutedEpitaphs.push({
        file: relPath,
        issue: `Failed to parse YAML frontmatter: ${err.message}`
      });
    }
  }

  // 3. Asymmetrical Tombs (Missing Poetry Partners)
  const coreDocsDir = path.join(CONTENT_DIR, 'docs');
  const coreDocs = getFilesRecursive(coreDocsDir).filter(file => {
    const rel = path.relative(coreDocsDir, file);
    // Exclude releases, changelogs, indices, and automated reports
    return !/(releases|changelog|index\.mdx|reference\/audits)/.test(rel);
  });

  const aphorismsDir = path.join(CONTENT_DIR, 'aphorisms');
  const haikusDir = path.join(CONTENT_DIR, 'haikus');
  const limericksDir = path.join(CONTENT_DIR, 'limericks');

  const aphorismFilesLower = new Set(getFilesRecursive(aphorismsDir).map(f => path.basename(f).toLowerCase()));
  const haikuFilesLower = new Set(getFilesRecursive(haikusDir).map(f => path.basename(f).toLowerCase()));
  const limerickFilesLower = new Set(getFilesRecursive(limericksDir).map(f => path.basename(f).toLowerCase()));

  for (const file of coreDocs) {
    const relPath = path.relative(ROOT_DIR, file);
    const base = path.basename(file);
    const ext = path.extname(file);
    const cleanName = base.slice(0, -ext.length);

    let targetAph = '';
    let targetHai = '';
    let targetLim = '';

    const mascotMatch = cleanName.match(/^(\d{3})\.(.*)$/);
    if (mascotMatch) {
      const num = mascotMatch[1];
      const name = mascotMatch[2];
      targetAph = `APH-${num}.${name}.mdx`;
      targetHai = `hai-${num}-${name}.mdx`;
      targetLim = `lim-${name}.mdx`;
    } else {
      targetAph = `APH-${cleanName}.mdx`;
      targetHai = `hai-${cleanName.toLowerCase()}.mdx`;
      targetLim = `LIM-${cleanName}.mdx`;
    }

    const hasAph = aphorismFilesLower.has(targetAph.toLowerCase());
    const hasHai = haikuFilesLower.has(targetHai.toLowerCase());
    const hasLim = limerickFilesLower.has(targetLim.toLowerCase());

    if (!hasAph || !hasHai || !hasLim) {
      const missing = [];
      if (!hasAph) missing.push(`Aphorism [${targetAph}]`);
      if (!hasHai) missing.push(`Haiku [${targetHai}]`);
      if (!hasLim) missing.push(`Limerick [${targetLim}]`);

      report.asymmetricalTombs.push({
        file: relPath,
        issue: `Core tomb is unrepresented in: ${missing.join(', ')}`
      });
    }
  }

  // 4. Dangling Appendages (Orphaned Poetry)
  const poetryDirs = [
    { dir: aphorismsDir, name: 'aphorisms' },
    { dir: haikusDir, name: 'haikus' },
    { dir: limericksDir, name: 'limericks' }
  ];

  const docsFiles = getFilesRecursive(coreDocsDir);

  for (const { dir, name: dirName } of poetryDirs) {
    const files = getFilesRecursive(dir);
    for (const file of files) {
      const relPath = path.relative(ROOT_DIR, file);
      const base = path.basename(file);

      // Strip prefix codes to reveal true entity slug
      let term = '';
      const prefixMatch = base.match(/^(APH-|hai-|lim-|LIM-)([0-9]{3}-|[0-9]{3}\.)?/i);
      if (prefixMatch) {
        term = base.slice(prefixMatch[0].length).replace(/\.mdx?$/, '');
      } else {
        term = base.replace(/\.mdx?$/, '');
      }

      // Check if any file in docs/ has a filename containing the term
      const hasCounterpart = docsFiles.some(df => {
        const dfBase = path.basename(df).toLowerCase();
        return dfBase.includes(term.toLowerCase());
      });

      if (!hasCounterpart) {
        report.orphanPoems.push({
          file: relPath,
          issue: `Poetry file has no structural Core counterpart matching term [${term}].`
        });
      }
    }
  }

  // Write Markdown Report
  let md = `---
title: "Rotkeeper Grave Audit — Tombstone & Keyspace Integrity"
date: ${new Date().toISOString().split('T')[0]}
updatedAt: ${new Date().toISOString().split('T')[0]}
title_decay_count: ${report.mutedEpitaphs.length}
keyspace_collisions_count: ${report.indexCollisions.length}
naming_leakage_count: ${report.filenamingDecay.length}
missing_poetry_partners_count: ${report.asymmetricalTombs.length}
orphaned_poetry_count: ${report.orphanPoems.length}
---

# Rotkeeper Tombstone & Keyspace Integrity Audit Report

This report is automatically generated by \`scripts/astro-grave-audit.mjs\`. It checks for keyspace collisions, title syntax decay, naming leaks, and missing relationships between Core records and their poetry layers.

## Summary

| Diagnostic | Failures | Status |
|---|---|---|
| 💀 **Epitaph Decay** (Broken Title Metadata) | ${report.mutedEpitaphs.length} | ${report.mutedEpitaphs.length === 0 ? '✅ PASS' : '🔴 FAIL'} |
| 🔑 **Keyspace Collisions** (Duplicate Mascot Indexes) | ${report.indexCollisions.length} | ${report.indexCollisions.length === 0 ? '✅ PASS' : '🔴 FAIL'} |
| 🏷️ **Naming Conventions** (Extension Leakage) | ${report.filenamingDecay.length} | ${report.filenamingDecay.length === 0 ? '✅ PASS' : '🔴 FAIL'} |
| 🪦 **Asymmetrical Tombs** (Missing Poetry Partners) | ${report.asymmetricalTombs.length} | ${report.asymmetricalTombs.length === 0 ? '✅ PASS' : '🔴 FAIL'} |
| 🍂 **Dangling Appendages** (Orphaned Poetry Files) | ${report.orphanPoems.length} | ${report.orphanPoems.length === 0 ? '✅ PASS' : '🔴 FAIL'} |

---

## 🔑 Keyspace Collisions (Duplicate Mascot Indexes)

`;

  if (report.indexCollisions.length === 0) {
    md += `No index collisions found.\n\n`;
  } else {
    md += `| Index | Duplicated Files |\n|---|---|\n`;
    for (const c of report.indexCollisions) {
      md += `| \`${c.index}\` | ${c.files.map(f => `\`${f}\``).join('<br>')} |\n`;
    }
    md += `\n`;
  }

  md += `## 💀 Epitaph Decay (Broken Title Metadata)\n\n`;
  if (report.mutedEpitaphs.length === 0) {
    md += `No frontmatter title errors found.\n\n`;
  } else {
    md += `| File | Issue |\n|---|---|\n`;
    for (const e of report.mutedEpitaphs) {
      md += `| \`${e.file}\` | ${e.issue} |\n`;
    }
    md += `\n`;
  }

  md += `## 🏷️ Naming Conventions (Extension Leakage)\n\n`;
  if (report.filenamingDecay.length === 0) {
    md += `No filename extension leakage detected.\n\n`;
  } else {
    md += `| File | Issue |\n|---|---|\n`;
    for (const f of report.filenamingDecay) {
      md += `| \`${f.file}\` | ${f.issue} |\n`;
    }
    md += `\n`;
  }

  md += `## 🪦 Asymmetrical Tombs (Missing Poetry Partners)\n\n`;
  if (report.asymmetricalTombs.length === 0) {
    md += `No missing poetry partners.\n\n`;
  } else {
    md += `<details><summary>Click to expand (${report.asymmetricalTombs.length} files)</summary>\n\n`;
    md += `| File | Issue |\n|---|---|\n`;
    for (const t of report.asymmetricalTombs) {
      md += `| \`${t.file}\` | ${t.issue} |\n`;
    }
    md += `\n</details>\n\n`;
  }

  md += `## 🍂 Dangling Appendages (Orphaned Poetry Files)\n\n`;
  if (report.orphanPoems.length === 0) {
    md += `No orphaned poetry files.\n\n`;
  } else {
    md += `<details><summary>Click to expand (${report.orphanPoems.length} files)</summary>\n\n`;
    md += `| File | Issue |\n|---|---|\n`;
    for (const o of report.orphanPoems) {
      md += `| \`${o.file}\` | ${o.issue} |\n`;
    }
    md += `\n</details>\n`;
  }

  fs.mkdirSync(path.dirname(EXPORT_FILE), { recursive: true });
  fs.writeFileSync(EXPORT_FILE, md, 'utf8');
  console.log(`✓ Audit report successfully written to: ${EXPORT_FILE}`);

  console.log('\n============================================================');
  const hasFailures = 
    report.mutedEpitaphs.length > 0 || 
    report.indexCollisions.length > 0 || 
    report.filenamingDecay.length > 0 || 
    report.asymmetricalTombs.length > 0 || 
    report.orphanPoems.length > 0;
  console.log(`Rotkeeper Grave Audit: ${hasFailures ? '🔴 FAIL' : '✅ PASS'}`);
  console.log(`  Epitaph Decay: ${report.mutedEpitaphs.length}`);
  console.log(`  Keyspace Collisions: ${report.indexCollisions.length}`);
  console.log(`  Naming Extensions: ${report.filenamingDecay.length}`);
  console.log(`  Asymmetrical Tombs: ${report.asymmetricalTombs.length}`);
  console.log(`  Orphan Poems: ${report.orphanPoems.length}`);
  console.log('============================================================\n');
}

main();
