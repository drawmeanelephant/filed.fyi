// scripts/audit-form-numbers.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const EXPORT_DIR = path.resolve('./exports');

const DEFAULT_EXCLUDES = [
  'node_modules', 'public', 'dist', '.git', '.astro',
  '.cache', 'exports', '.rag', 'reference/empathegy', '.turbo', '.vercel'
];

function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

function getFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (DEFAULT_EXCLUDES.includes(file)) continue;
      results.push(...getFiles(filePath));
    } else {
      if (/\.(md|mdx)$/.test(file)) results.push(filePath);
    }
  }
  return results;
}

function getCollectionType(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/src/content/docs/lorelog/') || normalized.includes('/content/docs/lorelog/')) return 'lorelog';
  if (normalized.includes('/src/content/docs/mascots/') || normalized.includes('/content/docs/mascots/')) return 'mascots';
  if (normalized.includes('/src/content/limericks/') || normalized.includes('/content/limericks/')) return 'limericks';
  if (normalized.includes('/src/content/haikus/') || normalized.includes('/content/haikus/')) return 'haikus';
  if (normalized.includes('/src/content/aphorisms/') || normalized.includes('/content/aphorisms/')) return 'aphorisms';
  if (normalized.includes('/src/content/docs/reference/') || normalized.includes('/content/docs/reference/')) return 'reference';
  if (normalized.includes('/src/content/docs/posts/') || normalized.includes('/content/docs/posts/')) return 'posts';
  if (normalized.includes('/src/content/docs/releases/') || normalized.includes('/content/docs/releases/')) return 'releases';
  if (normalized.includes('/src/content/docs/changelog/') || normalized.includes('/content/docs/changelog/')) return 'changelog';
  if (normalized.includes('/src/content/docs/guides/') || normalized.includes('/content/docs/guides/')) return 'guides';
  return 'other';
}

function extractFormOrCaseNumber(filePath, frontmatter) {
  // 1. Frontmatter check
  if (frontmatter.caseNumber) {
    return String(frontmatter.caseNumber).trim().toUpperCase();
  }
  if (frontmatter.mascotId) {
    const cleanId = String(frontmatter.mascotId).trim();
    if (cleanId && cleanId !== '???') {
      return cleanId.padStart(3, '0');
    }
  }

  // 2. Filename check
  const basename = path.basename(filePath, path.extname(filePath));
  
  // Try matching standard form patterns: FREF-XXXX-XXXX, LLG-XXXX, FFP-XXXX, etc.
  const formPatternMatch = basename.match(/(?:hai|lim|aph|fref|llg|ocv|ffp|rel|mascot)?-?([a-zA-Z]{3,4}-\d{3,4}(?:-[a-zA-Z0-9]+)*)/i);
  if (formPatternMatch) {
    return formPatternMatch[1].toUpperCase();
  }

  // Try matching numeric patterns (3 digit mascot IDs)
  const numMatch = basename.match(/(?:hai|lim|aph|fref|llg|ocv|ffp|rel|mascot)?-?(\d{3})\b/i);
  if (numMatch) {
    return numMatch[1];
  }

  return null;
}

function main() {
  ensureDirs();
  console.log('▶ Initiating Form/Case Number Audit across the entire archive...');

  const contentDir = path.resolve('./src/content');
  const allFiles = getFiles(contentDir);
  const records = [];

  for (const file of allFiles) {
    const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
    const collection = getCollectionType(file);
    
    let content = '';
    try {
      content = fs.readFileSync(file, 'utf-8');
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
      continue;
    }

    let parsed;
    try {
      parsed = matter(content);
    } catch (err) {
      console.error(`Error parsing frontmatter for ${file}:`, err);
      continue;
    }

    const frontmatter = parsed.data || {};
    const extractedId = extractFormOrCaseNumber(file, frontmatter);

    records.push({
      filePath: file,
      relPath,
      collection,
      title: frontmatter.title || path.basename(file),
      extractedId,
      status: 'PASS',
      issues: []
    });
  }

  // Map to detect duplicates within each collection
  const collectionIdMap = {};

  for (const r of records) {
    if (!r.extractedId) {
      r.status = 'MISSING';
      r.issues.push('Could not extract any form/case number or mascot ID from frontmatter or filename');
      continue;
    }

    const col = r.collection;
    if (!collectionIdMap[col]) {
      collectionIdMap[col] = {};
    }

    const idKey = r.extractedId.toUpperCase();
    if (!collectionIdMap[col][idKey]) {
      collectionIdMap[col][idKey] = [];
    }
    collectionIdMap[col][idKey].push(r);
  }

  // Check for duplicates
  for (const r of records) {
    if (r.status === 'MISSING') continue;

    const col = r.collection;
    const idKey = r.extractedId.toUpperCase();
    const sameCollMatches = collectionIdMap[col][idKey].filter(m => m.filePath !== r.filePath);

    if (sameCollMatches.length > 0) {
      r.status = 'DUPLICATE';
      const dupePaths = sameCollMatches.map(m => m.relPath);
      r.issues.push(`Duplicate ID/CaseNumber shared within '${col}' with: ${dupePaths.join(', ')}`);
    }
  }

  // Compile statistics
  const stats = {
    total: records.length,
    pass: 0,
    missing: 0,
    duplicate: 0
  };

  const collectionStats = {};

  for (const r of records) {
    const col = r.collection;
    if (!collectionStats[col]) {
      collectionStats[col] = { total: 0, pass: 0, missing: 0, duplicate: 0 };
    }

    collectionStats[col].total++;
    if (r.status === 'PASS') {
      stats.pass++;
      collectionStats[col].pass++;
    } else if (r.status === 'MISSING') {
      stats.missing++;
      collectionStats[col].missing++;
    } else if (r.status === 'DUPLICATE') {
      stats.duplicate++;
      collectionStats[col].duplicate++;
    }
  }

  // Write Markdown Report
  const outPath = path.join(EXPORT_DIR, 'form-number-audit.md');
  let report = `---\ntitle: "Form/Case Number Audit Report"\ndate: ${new Date().toISOString().split('T')[0]}\n---\n\n`;

  report += `# Form/Case Number Audit Report\n\n`;
  report += `This report lists files that are missing a case or form number, and any duplicate case/form numbers within each collection.\n\n`;

  report += `## Summary\n\n`;
  report += `| Metric | Count |\n`;
  report += `|---|---|\n`;
  report += `| **Total files audited** | ${stats.total} |\n`;
  report += `| ✅ **PASS** | ${stats.pass} |\n`;
  report += `| 🔴 **MISSING** | ${stats.missing} |\n`;
  report += `| 🔶 **DUPLICATE** | ${stats.duplicate} |\n\n`;

  report += `## Per-Collection Summary\n\n`;
  report += `| Collection | Total | PASS | MISSING | DUPLICATE |\n`;
  report += `|---|---|---|---|---|\n`;
  for (const [col, cStat] of Object.entries(collectionStats)) {
    report += `| **${col}** | ${cStat.total} | ${cStat.pass} | ${cStat.missing} | ${cStat.duplicate} |\n`;
  }
  report += `\n`;

  const missingRecords = records.filter(r => r.status === 'MISSING');
  if (missingRecords.length > 0) {
    report += `## 🔴 Missing Form/Case Numbers (${missingRecords.length})\n\n`;
    report += `| File | Collection | Path | Issues |\n`;
    report += `|---|---|---|---|\n`;
    for (const r of missingRecords) {
      report += `| \`${path.basename(r.filePath)}\` | ${r.collection} | \`${r.relPath}\` | ${r.issues.join('; ')} |\n`;
    }
    report += `\n`;
  } else {
    report += `## 🔴 Missing Form/Case Numbers\n\nNo files are missing form or case numbers.\n\n`;
  }

  const duplicateRecords = records.filter(r => r.status === 'DUPLICATE');
  if (duplicateRecords.length > 0) {
    report += `## 🔶 Duplicate Form/Case Numbers (${duplicateRecords.length})\n\n`;
    report += `| File | Collection | Resolved ID | Issues |\n`;
    report += `|---|---|---|---|\n`;
    for (const r of duplicateRecords) {
      report += `| \`${path.basename(r.filePath)}\` | ${r.collection} | \`${r.extractedId}\` | ${r.issues.join('; ')} |\n`;
    }
    report += `\n`;
  } else {
    report += `## 🔶 Duplicate Form/Case Numbers\n\nNo duplicate collisions were found within any collection.\n\n`;
  }

  fs.writeFileSync(outPath, report);

  // Print Summary to Console
  console.log(`\n============================================================`);
  console.log(`Form/Case Number Audit Complete:`);
  console.log(`  Total Files Audited: ${stats.total}`);
  console.log(`  ✅ PASS      : ${stats.pass}`);
  console.log(`  🔴 MISSING   : ${stats.missing}`);
  console.log(`  🔶 DUPLICATE : ${stats.duplicate}`);
  console.log(`============================================================`);
  console.log(`✓ Generated report: exports/${path.basename(outPath)}\n`);
}

main();
