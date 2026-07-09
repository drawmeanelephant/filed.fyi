// scripts/check-box-telemetry.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const EXPORTS_DIR = path.resolve('./exports');
const LITTER_FILE = path.join(EXPORTS_DIR, 'litter-telemetry.json');
const UNIFIED_REPORT_FILE = path.join(EXPORTS_DIR, 'unified-cleanup-report.md');

const args = process.argv.slice(2);

// Optionally re-run the entire execution suite before harvesting
if (args.includes('--run-all')) {
  console.log('▶ [TELEMETRY] Orchestrating full diagnostic pre-run sweep...');
  const scripts = [
    'astro-grave-audit.mjs',
    'astro-casenum-audit.mjs',
    'audit-poetry-alignment.mjs',
    'audit-frontmatter-integrity.mjs',
    'audit-mascot-assurance.mjs'
  ];
  for (const script of scripts) {
    try {
      console.log(`  → Running scripts/${script}...`);
      execSync(`node scripts/${script}`, { stdio: 'ignore' });
    } catch (err) {
      console.error(`  ❌ Failed execution on scripts/${script}: ${err.message}`);
    }
  }
}

// 1. Extract manual sand-box state
let manualWaste = { unScoopedTurds: 0, lastCleared: new Date().toISOString().split('T')[0] };
if (fs.existsSync(LITTER_FILE)) {
  try { manualWaste = JSON.parse(fs.readFileSync(LITTER_FILE, 'utf8')); } catch {}
}

// 2. Frontmatter regex parser helper
function fetchMetric(filename, yamlKey) {
  const fullPath = path.join(EXPORTS_DIR, filename);
  if (!fs.existsSync(fullPath)) return 0;
  const content = fs.readFileSync(fullPath, 'utf8');
  const match = content.match(new RegExp(`^${yamlKey}:\\s*(\\d+)`, 'm'));
  return match ? parseInt(match[1], 10) : 0;
}

// Harvest all available metrics from the frontmatter logs
const grave_title_decay       = fetchMetric('grave-audit.md', 'title_decay_count');
const grave_collisions        = fetchMetric('grave-audit.md', 'keyspace_collisions_count');
const grave_naming_leaks      = fetchMetric('grave-audit.md', 'naming_leakage_count');
const grave_missing_poetry    = fetchMetric('grave-audit.md', 'missing_poetry_partners_count');
const grave_orphans           = fetchMetric('grave-audit.md', 'orphaned_poetry_count');

const case_missing            = fetchMetric('casenum-audit-full.md', 'missing_files');
const case_dead_refs          = fetchMetric('casenum-audit-full.md', 'dead_refs');
const case_unclaimed          = fetchMetric('casenum-audit-full.md', 'unclaimed_refs');
const case_malformed          = fetchMetric('casenum-audit-full.md', 'malformed_files');
const case_duplicates         = fetchMetric('casenum-audit-full.md', 'duplicate_files');

const align_orphan_poems      = fetchMetric('poetry-alignment-audit.md', 'orphan_poems');
const align_dead_refs         = fetchMetric('poetry-alignment-audit.md', 'dead_ref_poems');
const align_unclaimed         = fetchMetric('poetry-alignment-audit.md', 'unclaimed_poems');
const align_ambiguous         = fetchMetric('poetry-alignment-audit.md', 'ambiguous_poems');

const integrity_anomalies     = fetchMetric('frontmatter-integrity-audit.md', 'anomalies_count');

const mascot_ghosts           = fetchMetric('mascot-assurance-audit.md', 'ghosts_count');
const mascot_thins            = fetchMetric('mascot-assurance-audit.md', 'thins_count');
const mascot_desc_gaps        = fetchMetric('mascot-assurance-audit.md', 'description_gaps_count');
const mascot_origin_gaps      = fetchMetric('mascot-assurance-audit.md', 'origin_gaps_count');
const mascot_affil_gaps       = fetchMetric('mascot-assurance-audit.md', 'affiliation_gaps_count');
const mascot_tags_gaps        = fetchMetric('mascot-assurance-audit.md', 'tags_gaps_count');
const mascot_rel_gaps         = fetchMetric('mascot-assurance-audit.md', 'relationship_gaps_count');
const mascot_depth_gaps       = fetchMetric('mascot-assurance-audit.md', 'structural_depth_gaps_count');
const mascot_self_anomalies   = fetchMetric('mascot-assurance-audit.md', 'self_audit_anomalies_count');

const totalDigitalDebt = 
  grave_title_decay + grave_collisions + grave_naming_leaks + grave_missing_poetry + grave_orphans +
  case_missing + case_dead_refs + case_unclaimed + case_malformed + case_duplicates +
  align_orphan_poems + align_dead_refs + align_unclaimed + align_ambiguous +
  integrity_anomalies + mascot_desc_gaps + mascot_origin_gaps + mascot_affil_gaps +
  mascot_tags_gaps + mascot_rel_gaps + mascot_depth_gaps + mascot_self_anomalies;

// 3. Compile Unified Cleanup Report Markdown
const today = new Date().toISOString().split('T')[0];
const reportContent = `---
title: "Unified Archival Cleanup Telemetry Matrix"
date: ${today}
total_digital_debt: ${totalDigitalDebt}
physical_unscooped_units: ${manualWaste.unScoopedTurds}
---

# Unified Archival Cleanup Telemetry Matrix

This master ledger consolidates metrics harvested from the frontmatter headers of all local diagnostic audits alongside real-world sandbox telemetry.

## 🐈 Physical Sand-Box Telemetry
*   **Un-Scooped Units Tracked:** \`${manualWaste.unScoopedTurds}\`
*   **Last Baseline Clear Date:** \`${manualWaste.lastCleared}\`

## 🪟 Digital Integrity & Architecture Metrics

### 🪦 Rotkeeper Grave Diagnostics
*   Title Field Metadata Decay: \`${grave_title_decay}\`
*   Keyspace Collisions (Duplicate Mascot IDs): \`${grave_collisions}\`
*   Filename Extension Leakage: \`${grave_naming_leaks}\`
*   Asymmetrical Tombs (Missing Poetry Folders): \`${grave_missing_poetry}\`
*   Dangling Appendages (Orphaned Core Stubs): \`${grave_orphans}\`

### 📂 Case Reference Reciprocity
*   Missing Case Numbers: \`${case_missing}\`
*   Dead Connections (Unresolved Links): \`${case_dead_refs}\`
*   Unreciprocated Links (Unclaimed Fields): \`${case_unclaimed}\`
*   Malformed Formats: \`${case_malformed}\`
*   Duplicate Case Collisions: \`${case_duplicates}\`

### 📜 Poetry Layout Alignment
*   Orphan Poems (Falling Back to Self-Anchor): \`${align_orphan_poems}\`
*   Dead References: \`${align_dead_refs}\`
*   Unclaimed Poetry Targets: \`${align_unclaimed}\`
*   Ambiguous (Multiple Matches): \`${align_ambiguous}\`

### 📄 Structural Data Anomalies
*   Frontmatter Schema Collapse Anomalies: \`${integrity_anomalies}\`

### 🦾 Mascot Assurance Desk Diagnostics
*   Mascot Weight Category Triage: \`${mascot_ghosts} Ghosts\` | \`${mascot_thins} Thins\`
*   Description Gaps: \`${mascot_desc_gaps}\`
*   Origin Gaps: \`${mascot_origin_gaps}\`
*   Affiliation Field Gaps: \`${mascot_affil_gaps}\`
*   Tags Array Gaps: \`${mascot_tags_gaps}\`
*   Relationship Structure Gaps: \`${mascot_rel_gaps}\`
*   Structural Depth Gaps (h2/h3 count missing): \`${mascot_depth_gaps}\`
*   Self-Audit Rendering Abnormalities: \`${mascot_self_anomalies}\`

---
*Report harvested and serialized automatically on build.*
`;

fs.mkdirSync(EXPORTS_DIR, { recursive: true });
fs.writeFileSync(UNIFIED_REPORT_FILE, reportContent, 'utf8');

// 4. High-Visibility Terminal Summary Output
console.log('\n============================================================');
console.log('▶ [TELEMETRY HARVESTER] Compiling System Backlog Metrics...');
console.log(`  📂 Digital Backlog Gaps  : ${totalDigitalDebt} architectural tasks pending.`);
console.log(`  🐈 Physical Waste Status : ${manualWaste.unScoopedTurds} tracked sandbox units.`);
console.log('------------------------------------------------------------');
if (manualWaste.unScoopedTurds === 0 && totalDigitalDebt === 0) {
  console.log('  ✅ STATUS: System baseline perfectly flat. Total environmental parity.');
} else {
  console.log('  ⚠️  STATUS: Retained debt registered. Compilation allowed to complete.');
  console.log(`  📊 Master Manifest written: exports/unified-cleanup-report.md`);
}
console.log('============================================================\n');

process.exit(0);
