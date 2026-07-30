#!/usr/bin/env node
/**
 * Relationship Audit Report Script for Filed & Forgotten
 * scripts/audit-relationships.mjs
 *
 * Scans all archival content files, extracts declared relationships,
 * and audits them against the canonical identity module (src/lib/archive-identity.ts).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import parseFrontmatter from './lib/parse-frontmatter.mjs';
import {
  resolveExactAlias,
  suggestFuzzyMatches,
  entryAliases,
  canonicalKey
} from '../src/lib/archive-identity.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const contentDir = path.join(projectRoot, 'src/content');
const exportsDir = path.join(projectRoot, 'exports');

const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');

function getMdxFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getMdxFiles(full));
    } else if (/\.mdx?$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function deriveCollectionAndId(filePath) {
  const rel = path.relative(contentDir, filePath).replace(/\\/g, '/');
  const parts = rel.split('/');

  if (parts[0] === 'docs') {
    if (parts[1] === 'mascots') {
      const id = parts.slice(2).join('/');
      return { collection: 'mascots', id, relPath: rel };
    }
    if (parts[1] === 'lorelog') {
      const id = parts.slice(2).join('/');
      return { collection: 'lorelog', id, relPath: rel };
    }
    const id = parts.slice(1).join('/');
    return { collection: 'docs', id, relPath: rel };
  }

  const collection = parts[0];
  const id = parts.slice(1).join('/');
  return { collection, id, relPath: rel };
}

// 1. Load all content entries
const allFiles = getMdxFiles(contentDir);
const allEntries = [];

for (const filePath of allFiles) {
  const { collection, id, relPath } = deriveCollectionAndId(filePath);
  const { frontmatter } = parseFrontmatter(filePath);
  allEntries.push({
    filePath: relPath,
    collection,
    id,
    data: frontmatter
  });
}

// 2. Audit declared relationships across all entries
const auditResults = {
  timestamp: new Date().toISOString(),
  totalEntries: allEntries.length,
  totalRelationships: 0,
  resolvedCount: 0,
  ambiguousCount: 0,
  unresolvedCount: 0,
  details: []
};

for (const entry of allEntries) {
  const fm = entry.data || {};
  const relsToAudit = [];

  // relatedEntries
  if (Array.isArray(fm.relatedEntries)) {
    for (const re of fm.relatedEntries) {
      if (typeof re === 'string') {
        relsToAudit.push({ field: 'relatedEntries', ref: re });
      } else if (re && typeof re === 'object' && re.id) {
        relsToAudit.push({ field: 'relatedEntries', ref: re });
      }
    }
  }

  // mascotRef
  if (fm.mascotRef) {
    relsToAudit.push({ field: 'mascotRef', ref: { collection: 'mascots', id: String(fm.mascotRef) } });
  }

  // relatedMascots
  if (Array.isArray(fm.relatedMascots)) {
    for (const m of fm.relatedMascots) {
      if (m) relsToAudit.push({ field: 'relatedMascots', ref: { collection: 'mascots', id: String(m) } });
    }
  }

  // parentEntry / relatedLorelog
  if (fm.parentEntry) {
    relsToAudit.push({ field: 'parentEntry', ref: String(fm.parentEntry) });
  }
  if (fm.relatedLorelog) {
    relsToAudit.push({ field: 'relatedLorelog', ref: { collection: 'lorelog', id: String(fm.relatedLorelog) } });
  }

  // relatedHaiku / relatedLimerick
  if (Array.isArray(fm.relatedHaiku)) {
    for (const h of fm.relatedHaiku) {
      if (h?.slug) relsToAudit.push({ field: 'relatedHaiku', ref: { collection: 'haikus', id: h.slug } });
    }
  }
  if (Array.isArray(fm.relatedLimerick)) {
    for (const l of fm.relatedLimerick) {
      if (l?.slug) relsToAudit.push({ field: 'relatedLimerick', ref: { collection: 'limericks', id: l.slug } });
    }
  }

  for (const item of relsToAudit) {
    auditResults.totalRelationships++;
    const res = resolveExactAlias(item.ref, allEntries);

    let status = 'UNRESOLVED';
    let candidates = [];

    if (res.resolved) {
      if (res.ambiguousMatches && res.ambiguousMatches.length > 1) {
        status = 'AMBIGUOUS';
        auditResults.ambiguousCount++;
      } else {
        status = 'RESOLVED';
        auditResults.resolvedCount++;
      }
    } else {
      auditResults.unresolvedCount++;
      candidates = suggestFuzzyMatches(item.ref, allEntries).map((c) => ({
        collection: c.collection,
        id: c.id,
        caseNumber: c.data?.caseNumber,
        title: c.data?.title || c.data?.displayName
      }));
    }

    auditResults.details.push({
      sourceFile: entry.filePath,
      declaredCollection: entry.collection,
      declaredId: entry.id,
      field: item.field,
      attemptedRef: item.ref,
      status,
      matchType: res.matchType || null,
      matchedEntry: res.entry ? { collection: res.entry.collection, id: res.entry.id } : null,
      candidates
    });
  }
}

// 3. Write markdown report
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

const markdownReportPath = path.join(exportsDir, 'relationship-audit.md');
const jsonReportPath = path.join(exportsDir, 'relationship-audit.json');

const unresolvedList = auditResults.details.filter((d) => d.status === 'UNRESOLVED');
const ambiguousList = auditResults.details.filter((d) => d.status === 'AMBIGUOUS');

const mdLines = [
  '# Archive Relationship Audit Report',
  '',
  `* **Generated At:** ${auditResults.timestamp}`,
  `* **Total Entries Scanned:** ${auditResults.totalEntries}`,
  `* **Total Relationships Audited:** ${auditResults.totalRelationships}`,
  `* **Resolved:** ${auditResults.resolvedCount}`,
  `* **Ambiguous:** ${auditResults.ambiguousCount}`,
  `* **Unresolved:** ${auditResults.unresolvedCount}`,
  '',
  '---',
  '',
  '## Summary Statistics',
  '',
  `* **Resolution Rate:** ${((auditResults.resolvedCount / (auditResults.totalRelationships || 1)) * 100).toFixed(1)}%`,
  `* **Unresolved Count:** ${auditResults.unresolvedCount}`,
  `* **Ambiguous Count:** ${auditResults.ambiguousCount}`,
  '',
  '---',
  '',
  '## Unresolved Relationships',
  ''
];

if (unresolvedList.length === 0) {
  mdLines.push('✅ No unresolved relationships found.');
} else {
  for (const item of unresolvedList) {
    const refStr = typeof item.attemptedRef === 'string' ? item.attemptedRef : JSON.stringify(item.attemptedRef);
    mdLines.push(`### \`${item.sourceFile}\``);
    mdLines.push(`* **Field:** \`${item.field}\``);
    mdLines.push(`* **Attempted Ref:** \`${refStr}\``);
    if (item.candidates.length > 0) {
      mdLines.push('* **Candidate Matches (Fuzzy Suggestions):**');
      for (const cand of item.candidates) {
        mdLines.push(`  - \`${cand.collection}:${cand.id}\` ${cand.caseNumber ? `(${cand.caseNumber})` : ''} - "${cand.title || 'Untitled'}"`);
      }
    } else {
      mdLines.push('* **Candidate Matches:** None found');
    }
    mdLines.push('');
  }
}

if (ambiguousList.length > 0) {
  mdLines.push('---');
  mdLines.push('');
  mdLines.push('## Ambiguous Relationships');
  mdLines.push('');
  for (const item of ambiguousList) {
    const refStr = typeof item.attemptedRef === 'string' ? item.attemptedRef : JSON.stringify(item.attemptedRef);
    mdLines.push(`* \`${item.sourceFile}\` → \`${refStr}\` matches multiple entries at same tier.`);
  }
}

fs.writeFileSync(markdownReportPath, mdLines.join('\n'), 'utf8');
fs.writeFileSync(jsonReportPath, JSON.stringify(auditResults, null, 2), 'utf8');

if (jsonOutput) {
  console.log(JSON.stringify(auditResults, null, 2));
} else {
  console.log(`▶ [AUDIT:RELATIONSHIPS] Audit complete.`);
  console.log(`  Total Relationships: ${auditResults.totalRelationships}`);
  console.log(`  Resolved: ${auditResults.resolvedCount}`);
  console.log(`  Ambiguous: ${auditResults.ambiguousCount}`);
  console.log(`  Unresolved: ${auditResults.unresolvedCount}`);
  console.log(`  Report written to: ${path.relative(projectRoot, markdownReportPath)}`);
}
