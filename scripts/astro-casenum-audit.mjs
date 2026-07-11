// scripts/astro-casenum-audit.mjs
import fs from 'node:fs';
import path from 'node:path';
import parseFrontmatter from './lib/parse-frontmatter.mjs';

const EXPORT_DIR = path.resolve('./exports');

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
      if (['node_modules', 'public', 'dist', '.git', '.astro', '.cache', 'exports', '.rag', 'reference/empathegy', '.turbo', '.vercel'].includes(file)) continue;
      results.push(...getFiles(filePath));
    } else if (/\.(md|mdx)$/.test(file)) {
      results.push(filePath);
    }
  }
  return results;
}

function getCollectionType(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized.startsWith('docs/lorelog/')) return 'lorelog';
  if (normalized.startsWith('docs/mascots/')) return 'mascots';
  if (normalized.startsWith('docs/posts/')) return 'posts';
  if (normalized.startsWith('docs/releases/')) return 'releases';
  if (normalized.startsWith('docs/changelog/')) return 'changelog';
  if (normalized.startsWith('docs/guides/')) return 'guides';
  if (normalized.startsWith('docs/reference/')) return 'reference';
  if (normalized.startsWith('haikus/')) return 'haikus';
  if (normalized.startsWith('limericks/')) return 'limericks';
  if (normalized.startsWith('aphorisms/')) return 'aphorisms';
  if (normalized.startsWith('docs/')) return 'docs';
  return 'other';
}

const REGEX_PATTERNS = {
  lorelog: /^(LLG|OCV)-[A-Z0-9xX]+(-[A-Z0-9xX]+)*$/,
  mascots: /^MASCOT-[A-Z0-9xX]+(-[A-Z0-9xX]+)*$/,
  posts: /^FFP-[A-Z0-9xX]+(-[A-Z0-9xX]+)*$/,
  releases: /^REL-[a-zA-Z0-9xX.-]+$/,
  changelog: /^(LLG|OCV|FREF|REL|FFP|MASCOT)-[A-Z0-9xX.-]+$/,
  guides: /^(LLG|OCV|FREF|REL|FFP|MASCOT)-[A-Z0-9xX.-]+$/,
  reference: /^(LLG|OCV|FREF|REL|FFP|MASCOT)-[A-Z0-9xX.-]+$/,
  haikus: /^(LLG|OCV|FREF|REL|FFP|MASCOT|HAI)-[A-Z0-9xX.-]+$/,
  limericks: /^(LLG|OCV|FREF|REL|FFP|MASCOT|LIM)-[A-Z0-9xX.-]+$/,
  aphorisms: /^(LLG|OCV|FREF|REL|FFP|MASCOT|APH)-[A-Z0-9xX.-]+$/,
  docs: /^(LLG|OCV|FREF|REL|FFP|MASCOT)-[A-Z0-9xX.-]+$/,
};

function isMalformed(caseNumber, type) {
  const pattern = REGEX_PATTERNS[type];
  if (!pattern) return false;
  return !pattern.test(caseNumber);
}

export function runCaseNumberAudit(writeFiles = true) {
  if (writeFiles) {
    ensureDirs();
    console.log('▶ Auditing caseNumbers across the entire archive...');
  }

  const contentDir = path.resolve('./src/content');
  const allFiles = getFiles(contentDir);
  const records = [];

  for (const file of allFiles) {
    const relPath = path.relative(contentDir, file);
    const type = getCollectionType(relPath);
    
    let parsed;
    try {
      parsed = parseFrontmatter(file);
    } catch (err) {
      console.error(`Error parsing ${file}:`, err);
      continue;
    }
    
    const frontmatter = parsed.frontmatter || {};
    const caseNumber = frontmatter.caseNumber || ''; // Standard field name
    const title = frontmatter.title || '';
    
    records.push({
      filePath: file,
      relPath: relPath.replace(/\\/g, '/'),
      collection: type,
      caseNumber,
      title,
      frontmatter,
      status: 'PASS',
      issues: []
    });
  }

  // 1. Build lookup maps
  const caseNumberMap = new Map();
  for (const r of records) {
    if (r.caseNumber) {
      const key = r.caseNumber.toUpperCase();
      if (!caseNumberMap.has(key)) {
        caseNumberMap.set(key, []);
      }
      caseNumberMap.get(key).push(r);
    }
  }

  // Helper to find record by slug or name in a collection
  function findRecord(ref, type) {
    if (!ref) return null;
    let refStr = '';
    if (typeof ref === 'object') {
      refStr = ref.slug || ref.id || '';
    } else {
      refStr = String(ref);
    }
    if (!refStr) return null;

    const cleanRef = refStr.toLowerCase().replace(/\.mdx?$/, '').split('/').pop();
    return records.find(r => {
      if (r.collection !== type) return false;
      const cleanSlug = r.frontmatter.slug ? r.frontmatter.slug.toLowerCase().split('/').pop() : '';
      const cleanBase = path.basename(r.filePath, path.extname(r.filePath)).toLowerCase();
      
      if (type === 'mascots') {
        const mascotId = String(r.frontmatter.mascotId || '');
        if (mascotId && cleanRef === mascotId) return true;
        if (cleanRef.startsWith(mascotId + '.')) return true;
        const refText = cleanRef.replace(/^\d+\./, '').replace(/[^a-z0-9]/g, '');
        const slugText = cleanSlug.replace(/^\d+\./, '').replace(/[^a-z0-9]/g, '');
        const baseText = cleanBase.replace(/^\d+\./, '').replace(/[^a-z0-9]/g, '');
        if (refText === slugText || refText === baseText) return true;
      }
      return cleanRef === cleanSlug || cleanRef === cleanBase;
    });
  }

  // 2. Perform validations (MISSING, MALFORMED, DUPLICATE)
  for (const r of records) {
    if (!r.caseNumber) {
      const requiresCaseNumber = ['lorelog', 'releases', 'changelog', 'posts', 'guides', 'reference', 'docs'].includes(r.collection);
      if (requiresCaseNumber) {
        r.status = 'MISSING';
        r.issues.push('Missing caseNumber field');
      } else {
        r.status = 'PASS';
      }
      continue;
    }
    
    if (isMalformed(r.caseNumber, r.collection)) {
      r.status = 'MALFORMED';
      r.issues.push(`caseNumber "${r.caseNumber}" is malformed for collection "${r.collection}"`);
      continue;
    }

    const key = r.caseNumber.toUpperCase();
    const matches = caseNumberMap.get(key) || [];
    
    const sameCollMatches = matches.filter(m => m.collection === r.collection && m.filePath !== r.filePath);
    const lorelogMatches = (r.collection === 'lorelog') ? matches.filter(m => m.collection === 'lorelog' && m.filePath !== r.filePath) : [];
    
    if (sameCollMatches.length > 0 || lorelogMatches.length > 0) {
      r.status = 'DUPLICATE';
      const dupePaths = [...sameCollMatches, ...lorelogMatches].map(m => m.relPath);
      r.issues.push(`Duplicate caseNumber shared with: ${dupePaths.join(', ')}`);
    }
  }

  // 3. Perform cross-reference & reciprocity checks
  for (const r of records) {
    if (r.status === 'MISSING' || r.status === 'MALFORMED' || r.status === 'DUPLICATE') continue;

    // A. Poem/Mascot -> Parent (or other expected source) exist check
    if (['haikus', 'limericks', 'aphorisms', 'mascots'].includes(r.collection)) {
      const key = r.caseNumber.toUpperCase();
      const isLlgOrOcv = key.startsWith('LLG-') || key.startsWith('OCV-') || key.startsWith('FREF-') || key.startsWith('MASCOT-');
      
      if (isLlgOrOcv) {
        const lorelogsWithCaseNum = (caseNumberMap.get(key) || []).filter(m => ['lorelog', 'reference', 'mascots'].includes(m.collection));
        if (lorelogsWithCaseNum.length === 0) {
          r.status = 'DEAD_REF';
          r.issues.push(`caseNumber "${r.caseNumber}" specifies a parent record, but no matching lorelog/reference page/mascot exists`);
        }
      }

      const parentRef = r.frontmatter.parentEntry ?? r.frontmatter.relatedLorelog;
      if (parentRef) {
        const declared = [parentRef].flat().filter(Boolean);
        for (const d of declared) {
          const dKey = d.toUpperCase();
          const exists = records.some(m => ['lorelog', 'reference', 'mascots'].includes(m.collection) && m.caseNumber.toUpperCase() === dKey);
          if (!exists) {
            r.status = 'DEAD_REF';
            r.issues.push(`declared parentEntry/relatedLorelog "${d}" does not exist in lorelogs or references or mascots`);
          }
        }
      }
    }

    // B. Lorelog -> declared related entries reciprocity check
    if (r.collection === 'lorelog') {
      const llgCaseNum = r.caseNumber.toUpperCase();

      // relatedHaiku reciprocity
      if (r.frontmatter.relatedHaiku) {
        const haikus = [r.frontmatter.relatedHaiku].flat().filter(Boolean);
        for (const hEntry of haikus) {
          const slug = typeof hEntry === 'string' ? hEntry : hEntry.slug;
          if (!slug) continue;
          
          const haikuRec = findRecord(slug, 'haikus');
          if (!haikuRec) {
            r.status = 'DEAD_REF';
            r.issues.push(`relatedHaiku "${slug}" could not be resolved`);
          } else {
            const parentRef = haikuRec.frontmatter.parentEntry ?? haikuRec.frontmatter.relatedLorelog;
            const backRefs = [haikuRec.caseNumber, parentRef].flat().filter(Boolean).map(x => x.toUpperCase());
            if (!backRefs.includes(llgCaseNum)) {
              r.status = 'UNCLAIMED';
              r.issues.push(`relatedHaiku "${slug}" does not reciprocate caseNumber "${r.caseNumber}"`);
              if (haikuRec.status === 'PASS') {
                haikuRec.status = 'UNCLAIMED';
                haikuRec.issues.push(`Referenced by lorelog "${r.relPath}" but does not reciprocate back`);
              }
            }
          }
        }
      }

      // relatedLimerick reciprocity
      if (r.frontmatter.relatedLimerick) {
        const limericks = [r.frontmatter.relatedLimerick].flat().filter(Boolean);
        for (const lEntry of limericks) {
          const slug = typeof lEntry === 'string' ? lEntry : lEntry.slug;
          if (!slug) continue;
          
          const limerickRec = findRecord(slug, 'limericks');
          if (!limerickRec) {
            r.status = 'DEAD_REF';
            r.issues.push(`relatedLimerick "${slug}" could not be resolved`);
          } else {
            const parentRef = limerickRec.frontmatter.parentEntry ?? limerickRec.frontmatter.relatedLorelog;
            const backRefs = [limerickRec.caseNumber, parentRef].flat().filter(Boolean).map(x => x.toUpperCase());
            if (!backRefs.includes(llgCaseNum)) {
              r.status = 'UNCLAIMED';
              r.issues.push(`relatedLimerick "${slug}" does not reciprocate caseNumber "${r.caseNumber}"`);
              if (limerickRec.status === 'PASS') {
                limerickRec.status = 'UNCLAIMED';
                limerickRec.issues.push(`Referenced by lorelog "${r.relPath}" but does not reciprocate back`);
              }
            }
          }
        }
      }

      // mascotRef and relatedMascots reciprocity
      const mascots = [
        r.frontmatter.mascotRef,
        ...(r.frontmatter.relatedMascots || [])
      ].filter(Boolean);
      
      for (const mRef of mascots) {
        const mascotRec = findRecord(mRef, 'mascots');
        if (!mascotRec) {
          r.status = 'DEAD_REF';
          r.issues.push(`mascot reference "${mRef}" could not be resolved`);
        } else {
          const parentRef = mascotRec.frontmatter.parentEntry ?? mascotRec.frontmatter.relatedLorelog;
          const backRefs = [mascotRec.caseNumber, parentRef].flat().filter(Boolean).map(x => x.toUpperCase());
          if (!backRefs.includes(llgCaseNum)) {
            r.status = 'UNCLAIMED';
            r.issues.push(`Referenced mascot "${mRef}" does not reciprocate caseNumber "${r.caseNumber}"`);
            if (mascotRec.status === 'PASS') {
              mascotRec.status = 'UNCLAIMED';
              mascotRec.issues.push(`Referenced by lorelog "${r.relPath}" but does not reciprocate back`);
            }
          }
        }
      }
    }
  }

  // 4. Reverse reciprocity checks: Poem/Mascot -> Parent claim
  for (const r of records) {
    if (r.status !== 'PASS') continue;

    if (['haikus', 'limericks', 'aphorisms', 'mascots'].includes(r.collection)) {
      const parentRef = r.frontmatter.parentEntry ?? r.frontmatter.relatedLorelog;
      const parentRefs = [r.caseNumber, parentRef]
        .flat()
        .filter(Boolean)
        .filter(x => x.toUpperCase().startsWith('LLG-') || x.toUpperCase().startsWith('OCV-') || x.toUpperCase().startsWith('FREF-') || x.toUpperCase().startsWith('MASCOT-'));
        
      for (const pRef of parentRefs) {
        const pKey = pRef.toUpperCase();
        const parentRec = records.find(m => ['lorelog', 'reference', 'mascots'].includes(m.collection) && m.caseNumber && m.caseNumber.toUpperCase() === pKey);
        
        if (parentRec) {
          let claimed = false;
          
          if (r.collection === 'haikus' && parentRec.frontmatter.relatedHaiku) {
            const haikus = [parentRec.frontmatter.relatedHaiku].flat().filter(Boolean);
            claimed = haikus.some(h => {
              const slug = typeof h === 'string' ? h : h.slug;
              return slug && findRecord(slug, 'haikus')?.filePath === r.filePath;
            });
          } else if (r.collection === 'limericks' && parentRec.frontmatter.relatedLimerick) {
            const limericks = [parentRec.frontmatter.relatedLimerick].flat().filter(Boolean);
            claimed = limericks.some(l => {
              const slug = typeof l === 'string' ? l : l.slug;
              return slug && findRecord(slug, 'limericks')?.filePath === r.filePath;
            });
          } else if (r.collection === 'mascots') {
            const mascots = [parentRec.frontmatter.mascotRef, ...(parentRec.frontmatter.relatedMascots || [])].filter(Boolean);
            claimed = mascots.some(m => findRecord(m, 'mascots')?.filePath === r.filePath);
          }
          
          if (parentRec.collection === 'reference' || parentRec.collection === 'mascots') {
            claimed = true; // Reference and Mascot pages don't list explicit poem claims in arrays
          }
          
          if (!claimed && parentRec.frontmatter.relatedEntries) {
            claimed = parentRec.frontmatter.relatedEntries.some(re => {
              if (!re || !re.id) return false;
              const cleanId = re.id.toLowerCase().replace(/\.mdx?$/, '').split('/').pop();
              const cleanSlug = r.frontmatter.slug ? r.frontmatter.slug.toLowerCase().split('/').pop() : '';
              const cleanBase = path.basename(r.filePath, path.extname(r.filePath)).toLowerCase();
              return cleanId === cleanSlug || cleanId === cleanBase || re.id.toUpperCase() === r.caseNumber.toUpperCase();
            });
          }
          
          if (!claimed) {
            r.status = 'UNCLAIMED';
            r.issues.push(`Declares connection to parent "${parentRec.relPath}" (${pRef}) but parent does not claim it back`);
            if (parentRec.status === 'PASS') {
              parentRec.status = 'UNCLAIMED';
              parentRec.issues.push(`Referenced by "${r.relPath}" but does not claim it back`);
            }
          }
        }
      }
    }
  }

  // 5. Gather statistics
  const stats = {
    total: records.length,
    pass: records.filter(r => r.status === 'PASS').length,
    missing: records.filter(r => r.status === 'MISSING').length,
    deadRef: records.filter(r => r.status === 'DEAD_REF').length,
    unclaimed: records.filter(r => r.status === 'UNCLAIMED').length,
    malformed: records.filter(r => r.status === 'MALFORMED').length,
    duplicate: records.filter(r => r.status === 'DUPLICATE').length,
  };

  const collectionsList = [...new Set(records.map(r => r.collection))].sort();
  const byCollection = {};
  for (const coll of collectionsList) {
    const collRecs = records.filter(r => r.collection === coll);
    byCollection[coll] = {
      total: collRecs.length,
      pass: collRecs.filter(r => r.status === 'PASS').length,
      missing: collRecs.filter(r => r.status === 'MISSING').length,
      deadRef: collRecs.filter(r => r.status === 'DEAD_REF').length,
      unclaimed: collRecs.filter(r => r.status === 'UNCLAIMED').length,
      malformed: collRecs.filter(r => r.status === 'MALFORMED').length,
      duplicate: collRecs.filter(r => r.status === 'DUPLICATE').length,
    };
  }

  if (writeFiles) {
    // Print summary to console
    console.log('\n============================================================');
    console.log(`Case Number Audit: ${stats.pass} PASS / ${stats.total - stats.pass} NON-PASS out of ${stats.total} files`);
    if (stats.missing) console.log(`  🔴 ${stats.missing} missing caseNumber`);
    if (stats.deadRef) console.log(`  💀 ${stats.deadRef} dead references (unresolved connection)`);
    if (stats.unclaimed) console.log(`  ⚠️  ${stats.unclaimed} unclaimed (reciprocity failure)`);
    if (stats.malformed) console.log(`  🟡 ${stats.malformed} malformed caseNumber format`);
    if (stats.duplicate) console.log(`  🔶 ${stats.duplicate} duplicate caseNumber collisions`);
    console.log('============================================================\n');

    // 6. Write exports/casenum-audit-full.md
    let fullReport = `---
title: "Case Number Audit — Full Report"
date: ${new Date().toISOString().split('T')[0]}
updatedAt: ${new Date().toISOString().split('T')[0]}
total_files: ${stats.total}
pass_files: ${stats.pass}
missing_files: ${stats.missing}
dead_refs: ${stats.deadRef}
unclaimed_refs: ${stats.unclaimed}
malformed_files: ${stats.malformed}
duplicate_files: ${stats.duplicate}
---

# Case Number Audit Report

This report is automatically generated by \`scripts/astro-casenum-audit.mjs\`. It details the validation, format conformity, and cross-reference reciprocity of caseNumber fields across all content collections.

## Summary

| Metric | Count |
|--------|-------|
| Total files audited | ${stats.total} |
| ✅ PASS (valid & reciprocated) | ${stats.pass} |
| 🔴 MISSING (no caseNumber) | ${stats.missing} |
| 💀 DEAD_REF (unresolved link) | ${stats.deadRef} |
| ⚠️ UNCLAIMED (unreciprocated link) | ${stats.unclaimed} |
| 🟡 MALFORMED (invalid format) | ${stats.malformed} |
| 🔶 DUPLICATE (duplicate case number) | ${stats.duplicate} |

## Per-Collection Breakdown

| Collection | Total | PASS | MISSING | DEAD_REF | UNCLAIMED | MALFORMED | DUPLICATE |
|------------|-------|------|---------|----------|-----------|-----------|-----------|
`;

    for (const coll of collectionsList) {
      const s = byCollection[coll];
      fullReport += `| **${coll}** | ${s.total} | ${s.pass} | ${s.missing} | ${s.deadRef} | ${s.unclaimed} | ${s.malformed} | ${s.duplicate} |\n`;
    }

    fullReport += `\n## Non-Passing Records\n\n`;
    const failures = records.filter(r => r.status !== 'PASS');
    if (failures.length === 0) {
      fullReport += `No failures found. All records are valid and fully reciprocated.\n`;
    } else {
      fullReport += `| File | Collection | Status | Case Number | Issues |\n|---|---|---|---|---|\n`;
      for (const f of failures) {
        fullReport += `| \`${path.basename(f.filePath)}\` | ${f.collection} | ${f.status} | ${f.caseNumber || '—'} | ${f.issues.join('; ')} |\n`;
      }
    }

    fullReport += `\n## Passing Records\n\n`;
    const passing = records.filter(r => r.status === 'PASS');
    fullReport += `<details><summary>Click to expand (${passing.length} files)</summary>\n\n`;
    fullReport += `| File | Collection | Case Number |\n|---|---|---|\n`;
    for (const p of passing) {
      fullReport += `| \`${path.basename(p.filePath)}\` | ${p.collection} | ${p.caseNumber || '—'} |\n`;
    }
    fullReport += `\n</details>\n`;

    fs.writeFileSync(path.join(EXPORT_DIR, 'casenum-audit-full.md'), fullReport, 'utf8');
    console.log(`✓ Created exports/casenum-audit-full.md`);

    // 7. Write exports/casenum-audit-duplicates.md (failures / duplicates details)
    let dupeReport = `---
title: "Case Number Audit — Failures & Collisions"
date: ${new Date().toISOString().split('T')[0]}
updatedAt: ${new Date().toISOString().split('T')[0]}
---

# Case Number Audit — Failures & Collisions

This report highlights files that did not pass the validation and reciprocity audits.

`;

    const duplicateRecs = records.filter(r => r.status === 'DUPLICATE');
    if (duplicateRecs.length > 0) {
      dupeReport += `## Duplicate Case Numbers\n\n`;
      dupeReport += `| Case Number | File | Collection | Collides With |\n|---|---|---|---|\n`;
      for (const r of duplicateRecs) {
        const key = r.caseNumber.toUpperCase();
        const matches = caseNumberMap.get(key).filter(m => m.filePath !== r.filePath).map(m => m.relPath);
        dupeReport += `| ${r.caseNumber} | \`${path.basename(r.filePath)}\` | ${r.collection} | ${matches.join(', ')} |\n`;
      }
    } else {
      dupeReport += `No duplicate case numbers found.\n\n`;
    }

    const malformedRecs = records.filter(r => r.status === 'MALFORMED');
    if (malformedRecs.length > 0) {
      dupeReport += `\n## Malformed Case Numbers\n\n`;
      dupeReport += `| File | Collection | Case Number | Pattern Expected |\n|---|---|---|---|\n`;
      for (const r of malformedRecs) {
        let expected = 'Standard format';
        if (r.collection === 'lorelog') expected = 'LLG-XXXX or OCV-XXXX';
        else if (r.collection === 'mascots') expected = 'MASCOT-XXX-XXX';
        else if (r.collection === 'posts') expected = 'FFP-XXXX';
        else if (r.collection === 'releases') expected = 'REL-vX.Y.Z-XXX';
        dupeReport += `| \`${path.basename(r.filePath)}\` | ${r.collection} | ${r.caseNumber} | ${expected} |\n`;
      }
    }

    const unresolvedRecs = records.filter(r => r.status === 'DEAD_REF' || r.status === 'UNCLAIMED');
    if (unresolvedRecs.length > 0) {
      dupeReport += `\n## Cross-Reference & Reciprocity Failures\n\n`;
      dupeReport += `| File | Collection | Status | Case Number | Issues |\n|---|---|---|---|---|\n`;
      for (const r of unresolvedRecs) {
        dupeReport += `| \`${path.basename(r.filePath)}\` | ${r.collection} | ${r.status} | ${r.caseNumber || '—'} | ${r.issues.join('; ')} |\n`;
      }
    }

    fs.writeFileSync(path.join(EXPORT_DIR, 'casenum-audit-duplicates.md'), dupeReport, 'utf8');
    console.log(`✓ Created exports/casenum-audit-duplicates.md`);

    console.log('\n"Filed, cross-checked, and accounted for." Audit complete.');
  }

  return { records, stats, caseNumberMap };
}

import { fileURLToPath } from 'url';
const isMain = process.argv[1] && (fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url)));

if (isMain) {
  runCaseNumberAudit(true);
}