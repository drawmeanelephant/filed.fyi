import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.resolve(__dirname, '../src/content/docs');
const contentDir = path.resolve(__dirname, '../src/content');
const scratchpadDir = path.resolve(__dirname, '../.jules/scratchpad');

// Ensure scratchpad directory exists and is clean
if (!fs.existsSync(scratchpadDir)) {
  fs.mkdirSync(scratchpadDir, { recursive: true });
}

function getMdxFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getMdxFiles(filePath, fileList);
    } else if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function countVerses(filePath, tag) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(new RegExp(tag, 'gi'));
  return matches ? matches.length : 0;
}

const poetryCollections = [
  { id: 'haikus', name: 'Haikus', tag: '<Limerick', cromulentCount: 5, tones: { top: 'INSTITUTIONAL_LEAK', cromulent: 'PROCEDURAL_SILENCE', bottom1: 'FATIGUE_GOLD_BRICK', bottom2: 'TRIVIALITY_ELEVATION' } },
  { id: 'limericks', name: 'Limericks', tag: '<Limerick', cromulentCount: 10, tones: { top: 'MISFILED_CONFIDENCE', cromulent: 'MALICIOUS_COMPLIANCE', bottom1: 'BUREAUCRATIC_DESPAIR', bottom2: 'REDACTION_FUGUE' } },
  { id: 'aphorisms', name: 'Aphorisms', tag: '<Broside', cromulentCount: 8, tones: { top: 'CYNICAL_TELEMETRY', cromulent: 'STANDARD_OPERATING_APATHY', bottom1: 'SYSTEM_LAG_LAMENT', bottom2: 'AUDIT_PANIC' } }
];

const targetCollections = [
  { id: 'lorelog', name: 'Lorelog' },
  { id: 'mascots', name: 'Mascots' },
  { id: 'reference', name: 'Reference' },
  { id: 'posts', name: 'Posts' }
];

const data = {};
const runtimeManifest = {}; // The out-of-bounds agent data store

poetryCollections.forEach(p => {
  const pDir = path.join(contentDir, p.id);
  const files = getMdxFiles(pDir);
  let totalVerses = 0;
  const fileStats = [];
  files.forEach(f => {
    const count = countVerses(f, p.tag);
    totalVerses += count;
    fileStats.push({ file: path.basename(f), path: f, count });
  });
  fileStats.sort((a, b) => b.count - a.count); // desc
  
  data[p.id] = {
    files: fileStats,
    totalFiles: files.length,
    totalVerses,
    cromulentCount: p.cromulentCount,
    tones: p.tones
  };
});

// Gather coverage matrix
const coverage = {};
targetCollections.forEach(t => {
  const tDir = path.join(docsDir, t.id);
  const files = getMdxFiles(tDir);
  let cov = { haikus: 0, limericks: 0, aphorisms: 0, total: files.length };
  
  const clean = str => str.replace(/[-_.]/g, '').toLowerCase();
  
  files.forEach(f => {
    const base = clean(path.basename(f, path.extname(f)));
    if (data.haikus.files.some(hf => clean(hf.file).includes(base))) cov.haikus++;
    if (data.limericks.files.some(lf => clean(lf.file).includes(base))) cov.limericks++;
    if (data.aphorisms.files.some(af => clean(af.file).includes(base))) cov.aphorisms++;
  });
  
  coverage[t.id] = cov;
});

// Generate Markdown Report
let md = `---
title: "Poetry Audit Report"
slug: reference/fref-0900-poet
description: "Automatically generated dashboard detailing coverage and scratchpad agent routing."
date: ${new Date().toISOString().split('T')[0]}
versionLabel: shelf-note
status: archived
classification: internal
caseNumber: FREF-0900-POET
tags:
  - reference
  - audit
  - poetry
  - scratchpad
tableOfContents: true
updatedAt: ${new Date().toISOString().split('T')[0]}
---

# Poetry Collection Audit & Agent Scratchpad Manifest

This report details the coverage, verse counts, and dynamically calculated subagent staging routes. The active coordination directives are stored out-of-bounds to prevent repository contamination.

## 🚀 Active Subagent Flight Manifest (Stored Out-Of-Bounds)

| Agent ID | Vector | Target Files | Injected Tone | Execution State |
|----------|--------|--------------|---------------|-----------------|
`;

let agentCounter = 1;
poetryCollections.forEach(p => {
  const allFiles = data[p.id].files;
  if (allFiles.length === 0) return;

  const processVector = (sliceStart, sliceEnd, tone, vectorLabel) => {
    const targets = allFiles.slice(sliceStart, sliceEnd);
    if (targets.length === 0) return;
    
    const agentId = `JULES-POET-${String(agentCounter++).padStart(2, '0')}`;
    const fileNames = targets.map(f => `\`${f.file}\``).join(', ');
    
    // Store data in our git-ignored runtime object instead of writing to file
    runtimeManifest[agentId] = {
      agentId,
      vector: `${p.name} (${vectorLabel})`,
      tone,
      targets: targets.map(f => ({ fileName: f.file, absolutePath: f.path })),
      directive: `Read target entry, append exactly 5 matching verses using tone ${tone}.`,
      CRITICAL_SAFETY_BOUNDS: "You are strictly sandboxed. You are COMPLETELY FORBIDDEN from editing, reading, or committing to 'src/content/docs/reference/fref-0900-poet.mdx' or any other files in that directory. Append your verses to your assigned target files and exit immediately."
    };
    
    md += `| **${agentId}** | ${p.name} (${vectorLabel}) | ${fileNames} | \`${tone}\` | Staged 📂 |\n`;
  };

  // 1. Top Vector (1 Agent / 2 Files)
  processVector(0, 2, p.tones.top, 'Top Dense');

  // 2. Cromulent Vector (1 Agent / 2 Files)
  const cromulentIndices = [];
  allFiles.forEach((f, idx) => { if (f.count === p.cromulentCount) cromulentIndices.push(idx); });
  const startIdx = cromulentIndices.length >= 2 ? cromulentIndices[0] : 2;
  processVector(startIdx, startIdx + 2, p.tones.cromulent, 'Cromulent Baseline');

  // 3. Bottom Vector Tone 1 (1 Agent / 2 Files from the absolute back)
  processVector(Math.max(0, allFiles.length - 2), allFiles.length, p.tones.bottom1, 'Gaps T1');

  // 4. Bottom Vector Tone 2 (1 Agent / 2 Files shifted from the back)
  processVector(Math.max(0, allFiles.length - 4), Math.max(0, allFiles.length - 2), p.tones.bottom2, 'Gaps T2');
});

md += `
---

## Archive Totals

| Collection | Total Files | Total Verses |
|------------|-------------|--------------|
`;

poetryCollections.forEach(p => {
  md += `| **${p.name}** | ${data[p.id].totalFiles} | ${data[p.id].totalVerses} |\n`;
});

md += `\n## Coverage Matrix\n\n`;

targetCollections.forEach(t => {
  const c = coverage[t.id];
  md += `### ${t.name} (${c.total} total records)\n\n`;
  md += `| Poetry | Coverage | Missing Files |\n`;
  md += `|--------|----------|---------------|\n`;
  poetryCollections.forEach(p => {
    const covered = c[p.id];
    const missing = c.total - covered;
    const pct = c.total === 0 ? 100 : Math.round((covered / c.total) * 100);
    const bars = '▓'.repeat(Math.round(pct / 10));
    md += `| ${p.name} | ${bars} ${pct}% | ${missing} |\n`;
  });
  md += `\n`;
});

md += `## Density Extremes

This section highlights the most and least densely populated poetry files across the archive. This allows us to identify records with an over-abundance of verses, and those struggling to maintain archival weight.
`;

poetryCollections.forEach(p => {
  md += `\n### ${p.name} Density\n\n`;
  md += `**Top 10 Most Verses**\n\n| File | Verses |\n|------|--------|\n`;
  const top10 = data[p.id].files.slice(0, 10);
  top10.forEach(f => {
    md += `| \`${f.file}\` | ${f.count} |\n`;
  });
  
  md += `\n**The Cromulent Seven**\n\n| File | Verses |\n|------|--------|\n`;
  const cromulent = data[p.id].files.filter(f => f.count === data[p.id].cromulentCount).slice(0, 7);
  cromulent.forEach(f => {
    md += `| \`${f.file}\` | ${f.count} |\n`;
  });
  
  md += `\n**Bottom 10 Least Verses**\n\n| File | Verses |\n|------|--------|\n`;
  const bottom10 = data[p.id].files.slice(-10).reverse();
  bottom10.forEach(f => {
    md += `| \`${f.file}\` | ${f.count} |\n`;
  });
});

const reportPath = path.join(docsDir, 'reference/fref-0900-poet.mdx');
fs.writeFileSync(reportPath, md, 'utf8');
console.log(`Generated FREF report at ${reportPath}`);

// Write the dynamic, git-ignored orchestration manifest
const manifestPath = path.join(scratchpadDir, 'flight-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(runtimeManifest, null, 2), 'utf8');
console.log(`Staged 12 Agent vectors cleanly out-of-bounds at ${manifestPath}`);

// We also need to keep the original sidecar missing files check since it existed
const sidecarDir = path.resolve(__dirname, '../src/data/sidecar');
const allMdxFilesFullPaths = getMdxFiles(docsDir);
const allMdxFiles = allMdxFilesFullPaths.map(f => path.relative(path.resolve(__dirname, '..'), f).replace(/\\/g, '/'));

function getJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => path.join(dir, f));
}

let processedMdxFiles = new Set();
getJsonFiles(sidecarDir).forEach(sidecarFile => {
  try {
    const data = JSON.parse(fs.readFileSync(sidecarFile, 'utf-8'));
    if (data.records) data.records.forEach(r => { if (r.file_path) processedMdxFiles.add(r.file_path); });
  } catch(e){}
});

const unmappedFiles = allMdxFiles.filter(file => !processedMdxFiles.has(file));
if (unmappedFiles.length > 0) {
  console.log(`Found ${unmappedFiles.length} unmapped .mdx files that need poetry...`);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const newBatchFile = path.join(sidecarDir, `batch_${timestamp}.json`);
  const batchData = {
    batch_timestamp: new Date().toISOString(),
    total_files_processed: unmappedFiles.length,
    records: unmappedFiles.map(f => ({ file_path: f, verses: [] }))
  };
  fs.writeFileSync(newBatchFile, JSON.stringify(batchData, null, 2));
  console.log(`Auto-scaffolded placeholders in ${newBatchFile}`);
} else {
  console.log("All .mdx files are mapped. No unmapped files found.");
}
