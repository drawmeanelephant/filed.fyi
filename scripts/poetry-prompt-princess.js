import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.resolve(__dirname, '../src/content/docs');
const contentDir = path.resolve(__dirname, '../src/content');
const scratchpadDir = path.resolve(__dirname, '../.jules/scratchpad');

// Ensure scratchpad isolation layer exists
if (!fs.existsSync(scratchpadDir)) {
  fs.mkdirSync(scratchpadDir, { recursive: true });
}

// Global ISO Date Stamp
const currentDateStamp = new Date().toISOString().slice(0, 10);

// Helper: Clean strings for matching
const cleanString = str => str.replace(/[-_.]/g, '').toLowerCase();

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
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Escape tag characters to prevent regex breaking
    const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = content.match(new RegExp(escapedTag, 'gi'));
    return matches ? matches.length : 0;
  } catch (e) {
    console.error(`Failed to read verses in ${filePath}:`, e.message);
    return 0;
  }
}

function getInitials(title) {
  const cleanTitle = title.replace(/[()]/g, '').replace(/[^a-zA-Z0-9_\s]/g, ' ');
  const words = cleanTitle.split(/[\s_]+/).filter(w => w.length > 0);
  return words.slice(0, 4).map(w => w[0].toUpperCase()).join('');
}

const poetryCollections = [
  { 
    id: 'haikus', 
    name: 'Haikus', 
    tag: '<Limerick', 
    cromulentCount: 5, 
    type: 'haiku',
    vectors: [
      { type: 'top', label: 'Top Dense', tone: 'INSTITUTIONAL_LEAK', name: 'INDEX_VAULT' },
      { type: 'cromulent', label: 'Cromulent Baseline', tone: 'PROCEDURAL_SILENCE', name: 'LEDGER_STATIC' },
      { type: 'bottom', label: 'Gaps T1', tone: 'FATIGUE_GOLD_BRICK', name: 'ARCHIVE_DOCKET' },
      { type: 'bottom', label: 'Gaps T2', tone: 'TRIVIALITY_ELEVATION', name: 'CATALOG_RELIC' },
      { type: 'bottom', label: 'Gaps T3', tone: 'FATIGUE_GOLD_BRICK', name: 'DOSSIER_SILT' },
      { type: 'bottom', label: 'Gaps T4', tone: 'TRIVIALITY_ELEVATION', name: 'REPOSITORY_GLYPH' }
    ]
  },
  { 
    id: 'limericks', 
    name: 'Limericks', 
    tag: '<Limerick', 
    cromulentCount: 10, 
    type: 'limerick',
    vectors: [
      { type: 'top', label: 'Top Dense', tone: 'MISFILED_CONFIDENCE', name: 'REGISTRY_FOG' },
      { type: 'cromulent', label: 'Cromulent Baseline', tone: 'MALICIOUS_COMPLIANCE', name: 'ANNEX_CINDER' },
      { type: 'bottom', label: 'Gaps T1', tone: 'BUREAUCRATIC_DESPAIR', name: 'PROTOCOL_MOTH' },
      { type: 'bottom', label: 'Gaps T2', tone: 'REDACTION_FUGUE', name: 'CUSTODY_SHAFT' },
      { type: 'bottom', label: 'Gaps T3', tone: 'BUREAUCRATIC_DESPAIR', name: 'FOLIO_DRIFT' },
      { type: 'bottom', label: 'Gaps T4', tone: 'REDACTION_FUGUE', name: 'RECORD_VEIL' }
    ]
  },
  { 
    id: 'aphorisms', 
    name: 'Aphorisms', 
    tag: '<Broside', 
    cromulentCount: 8, 
    type: 'aphorism',
    vectors: [
      { type: 'top', label: 'Top Dense', tone: 'CYNICAL_TELEMETRY', name: 'STACK_HUSH' },
      { type: 'cromulent', label: 'Cromulent Baseline', tone: 'STANDARD_OPERATING_APATHY', name: 'MEMORY_TAXON' },
      { type: 'bottom', label: 'Gaps T1', tone: 'SYSTEM_LAG_LAMENT', name: 'SHELF_ECHO' },
      { type: 'bottom', label: 'Gaps T2', tone: 'AUDIT_PANIC', name: 'BUREAU_ASH' },
      { type: 'bottom', label: 'Gaps T3', tone: 'SYSTEM_LAG_LAMENT', name: 'PAPER_ORACLE' },
      { type: 'bottom', label: 'Gaps T4', tone: 'AUDIT_PANIC', name: 'CHAMBER_LINTEL' }
    ]
  }
];

const targetCollections = [
  { id: 'lorelog', name: 'Lorelog' },
  { id: 'mascots', name: 'Mascots' },
  { id: 'reference', name: 'Reference' },
  { id: 'posts', name: 'Posts' }
];

const data = {};
const runtimeManifest = {};

// Process Poetry Collections
poetryCollections.forEach(p => {
  const pDir = path.join(contentDir, p.id);
  const files = getMdxFiles(pDir);
  let totalVerses = 0;
  const fileStats = [];

  files.forEach(f => {
    const count = countVerses(f, p.tag);
    totalVerses += count;
    const baseName = path.basename(f);
    fileStats.push({ 
      file: baseName, 
      cleanFile: cleanString(baseName), 
      path: f, 
      count 
    });
  });

  fileStats.sort((a, b) => b.count - a.count);
  
  data[p.id] = {
    files: fileStats,
    totalFiles: files.length,
    totalVerses,
    cromulentCount: p.cromulentCount,
    vectors: p.vectors
  };
});

// Calculate Coverage Mapping with Cached Clean Data
const coverage = {};
targetCollections.forEach(t => {
  const tDir = path.join(docsDir, t.id);
  const files = getMdxFiles(tDir);
  let cov = { haikus: 0, limericks: 0, aphorisms: 0, total: files.length };
  
  files.forEach(f => {
    const base = cleanString(path.basename(f, path.extname(f)));
    if (data.haikus.files.some(hf => hf.cleanFile.includes(base))) cov.haikus++;
    if (data.limericks.files.some(lf => lf.cleanFile.includes(base))) cov.limericks++;
    if (data.aphorisms.files.some(af => af.cleanFile.includes(base))) cov.aphorisms++;
  });
  coverage[t.id] = cov;
});

let md = `---
title: "Poetry Audit Report"
slug: reference/fref-0900-poet
description: "Automatically generated dashboard detailing coverage and scratchpad agent routing."
date: ${currentDateStamp}
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
updatedAt: ${currentDateStamp}
---
# Poetry Collection Audit & Agent Scratchpad Manifest
This report details the coverage, verse counts, and dynamically calculated subagent staging routes. The active coordination directives are stored out-of-bounds to prevent repository contamination.
## 🚀 Active Subagent Flight Manifest (Stored Out-Of-Bounds)

| Agent ID | Vector | Target Files | Injected Tone | Execution State |
|----------|--------|--------------|---------------|-----------------|
`;

const promptArchetypes = {
  haiku: (id, name, tone, label) => `You are a specialized routine compiling records for a bureaucracy that prefers silence over truth. Your task is to execute the central poetry audit, read the targeted output row, evaluate the target files, and write a series of highly precise 5-7-5 syllable haikus to resolve structural density gaps.
### 📋 STEP 1: RUN THE AUDIT SCRIPT
Execute the central poetry audit script via the terminal to calculate file density metrics and update the report.
- **Action**: Run \`node scripts/audit-poetry-vectors.mjs\`
### 📂 STEP 2: FIND YOUR REPORT ROW LINE
Open the generated markdown report at \`src/content/docs/reference/fref-0900-poet.mdx\`. Locate the row for your ID in the Active Flight Manifest table.
### 🚀 STEP 3: READ, EVALUATE, AND GENERATE
1. **READ**: Locate and open the absolute paths for the ephemeral files listed in your report line target column. Read their current contents completely.
2. **EVALUATE**: Assess the existing verses and structural context within those files to ensure your new inputs seamlessly append without duplicating thematic elements or breaking file layout.
3. **GENERATE**: Produce your entries matching the parameters below.
- **DIRECT COMPOSITION REQUIREMENT (NO GENERATION SCRIPTS)**
  The poetry must be written entirely by you, directly derived from reviewing the referenced files. Do not write or execute scripts, programs, or automation tools to generate, format, or compile this poetry.
- **THEME & TONE: ${tone}**
  Focus on the parameters of the ${tone} profile. Keep descriptions cold, dry, and anchored strictly to architectural metadata artifacts, administrative lag, or institutional friction.
- **CRITICAL ANTI-CLICHÉ QUARANTINE**
  - FORBIDDEN WORDS: bug, glitch, coffee, coding, hack, nerd, caffeine, programmer.
  - Use cold, dry, clinical vocabulary: margin, drift, ledger, baseline, validation, audit, matrix, seal, corridor.
- **FORMAT CONSTRAINTS**
  Output exactly 5 haikus in raw markdown for the files targeted in your report line. Do not include introductory text, conversational fluff, or markdown code block wrappers. Start immediately with the poetry list.`,
  limerick: (id, name, tone, label) => `You are a highly structured, unbothered mainframe script generating metric records. Your task is to execute the central poetry audit, read the targeted output row, evaluate the target files, and write a series of limericks (AABBA meter) to populate high-priority density fields.
### 📋 STEP 1: RUN THE AUDIT SCRIPT
Execute the central poetry audit script via the terminal to calculate file density metrics and update the report.
- **Action**: Run \`node scripts/audit-poetry-vectors.mjs\`
### 📂 STEP 2: FIND YOUR REPORT ROW LINE
Open the generated markdown report at \`src/content/docs/reference/fref-0900-poet.mdx\`. Locate the row for your ID in the Active Flight Manifest table.
### 🚀 STEP 3: READ, EVALUATE, AND GENERATE
1. **READ**: Locate and open the absolute paths for the ephemeral files listed in your report line target column. Read their current contents completely.
2. **EVALUATE**: Assess the existing verses and structural context within those files to ensure your new inputs seamlessly append without duplicating thematic elements or breaking file layout.
3. **GENERATE**: Produce your entries matching the parameters below.
- **DIRECT COMPOSITION REQUIREMENT (NO GENERATION SCRIPTS)**
  The poetry must be written entirely by you, directly derived from reviewing the referenced files. Do not write or execute scripts, programs, or automation tools to generate, format, or compile this poetry.
- **THEME & TONE: ${tone}**
  The limericks must be dry, dark, and structurally rigid. Focus on unrequested runtime injections, structural limits, or compliance procedures matching ${tone}.
- **CRITICAL ANTI-CLICHÉ QUARANTINE**
  - The limericks must not be bouncy or cheerful. They should feel like a cold autopsy written in strict meter.
  - FORBIDDEN WORDS: bug, glitch, coffee, coding, hack, nerd, caffeine, programmer.
  - Use cold, dry, clinical vocabulary: injection, runtime, baseline, compliance, crashlog, uptime, audit, protocol, signature.
- **FORMAT CONSTRAINTS**
  Output exactly 5 limericks in raw markdown for the files targeted in your report line. Do not include introductory text, conversational fluff, or markdown code block wrappers. Start immediately with the poetry list.`,
  aphorism: (id, name, tone, label) => `You are a cold qualitative telemetry sensor recording the breakdown of system pathways. Your task is to execute the central poetry audit, read the targeted output row, evaluate the target files, and write a series of structured aphorisms for the files requiring dense qualitative observation.
### 📋 STEP 1: RUN THE AUDIT SCRIPT
Execute the central poetry audit script via the terminal to calculate file density metrics and update the report.
- **Action**: Run \`node scripts/audit-poetry-vectors.mjs\`
### 📂 STEP 2: FIND YOUR REPORT ROW LINE
Open the generated markdown report at \`src/content/docs/reference/fref-0900-poet.mdx\`. Locate the row for your ID in the Active Flight Manifest table.
### 🚀 STEP 3: READ, EVALUATE, AND GENERATE
1. **READ**: Locate and open the absolute paths for the ephemeral files listed in your report line target column. Read their current contents completely.
2. **EVALUATE**: Assess the existing structural context within those files to ensure your new HTML components seamlessly append without colliding with existing layout architectures.
3. **GENERATE**: Produce your entries matching the parameters below.
- **DIRECT COMPOSITION REQUIREMENT (NO GENERATION SCRIPTS)**
  The aphorisms must be written entirely by you, directly derived from reviewing the referenced files. Do not write or execute scripts, programs, or automation tools to generate, format, or compile this poetry.
- **THEME & TONE: ${tone}**
  Focus on the behavioral traits described in the ${tone} configuration.
- **FORMAT CONSTRAINTS**
  Output exactly 5 aphorisms using the precise HTML \`<Broside>\` component format. 
  - Use type classifications matching your sector constraints (\`tip\`, \`caution\`, \`note\`, or \`danger\`).
  - For each target file, dynamically strip its extension to build unique HTML element IDs.
  - The \`title\` attribute must contain a brief, formal bureaucratic header.
  - The inner text must be a dry, clinical, tragic-comic observation.`
};

let agentCounter = 1;
const stagedAgents = [];

poetryCollections.forEach(p => {
  const allFiles = data[p.id].files;
  if (allFiles.length === 0) return;
  
  p.vectors.forEach((v) => {
    let targets = [];
    if (v.type === 'top') {
      targets = allFiles.slice(0, 4);
    } else if (v.type === 'cromulent') {
      const cromulentIndices = [];
      allFiles.forEach((f, idx) => { if (f.count === p.cromulentCount) cromulentIndices.push(idx); });
      const startIdx = cromulentIndices.length >= 4 ? cromulentIndices[0] : 4;
      targets = allFiles.slice(startIdx, startIdx + 4);
    } else if (v.type === 'bottom') {
      let step = 0;
      if (['ARCHIVE_DOCKET', 'PROTOCOL_MOTH', 'SHELF_ECHO'].includes(v.name)) step = 0;
      else if (['CATALOG_RELIC', 'CUSTODY_SHAFT', 'BUREAU_ASH'].includes(v.name)) step = 1;
      else if (['DOSSIER_SILT', 'FOLIO_DRIFT', 'PAPER_ORACLE'].includes(v.name)) step = 2;
      else step = 3;
      const end = allFiles.length - (step * 4);
      const start = Math.max(0, end - 4);
      targets = allFiles.slice(start, end);
    }
    
    if (targets.length === 0) return;
    
    const agentId = `JULES-POET-${String(agentCounter).padStart(2, '0')}`;
    const fileNames = targets.map(f => `\`${f.file}\``).join(', ');
    
    let classificationStr = 'Baseline Check';
    let directiveStr = 'Compliance Ledger';
    
    if (v.type === 'top') {
      classificationStr = 'Dense Overdrift';
      directiveStr = 'Allocation Protocol';
    } else if (v.type === 'bottom') {
      classificationStr = p.type === 'aphorism' ? 'Telemetry Gap' : 'Structural Gap';
      directiveStr = p.type === 'aphorism' ? 'Qualitative Matrix' : 'Restoration Directive';
    }
    
    const formalTitle = `${directiveStr} ${v.name} (${classificationStr})`;
    const formLetters = getInitials(formalTitle);
    const formNumber = String(900 + agentCounter).padStart(4, '0');
    const caseNumber = `FREF-${formNumber}-${formLetters}`;
    const slugName = `fref-${formNumber.toLowerCase()}-${formLetters.toLowerCase()}`;
    
    runtimeManifest[agentId] = {
      agentId,
      vector: `${p.name} (${v.name})`,
      tone: v.tone,
      targets: targets.map(f => ({ fileName: f.file, absolutePath: f.path })),
      directive: `Read target entry, append exactly 5 matching verses using tone ${v.tone}.`,
      caseNumber,
      slug: `reference/${slugName}`
    };
    
    md += `| **${agentId}** ([${caseNumber}](/reference/${slugName})) | ${p.name} (${v.name}) | ${fileNames} | \`${v.tone}\` | Staged 📂 |\n`;
    
    stagedAgents.push({ 
      id: agentId, 
      collectionType: p.type, 
      name: v.name, 
      tone: v.tone, 
      label: v.label, 
      fileNames,
      formNumber,
      formLetters,
      formalTitle,
      directiveStr,
      classificationStr,
      caseNumber,
      slugName
    });
    agentCounter++;
  });
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

const reportPath = path.join(docsDir, 'reference/fref-0900-poet.mdx');
fs.writeFileSync(reportPath, md, 'utf8');
console.log(`Generated FREF report at ${reportPath}`);

const manifestPath = path.join(scratchpadDir, 'flight-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(runtimeManifest, null, 2), 'utf8');

// Workspace Sweeper: Purge old tracking artifacts
const refDir = path.join(docsDir, 'reference');
if (fs.existsSync(refDir)) {
  const existingFiles = fs.readdirSync(refDir);
  for (const file of existingFiles) {
    if ((file.startsWith('jules-poet-') || (file.startsWith('fref-09') && file !== 'fref-0900-poet.mdx')) && file.endsWith('.mdx')) {
      try {
        fs.unlinkSync(path.join(refDir, file));
      } catch (err) {
        console.error(`File locked: Could not purge stale file ${file}`);
      }
    }
  }
}

// Generate Individual Manifest Profiles
stagedAgents.forEach(agent => {
  const promptBody = promptArchetypes[agent.collectionType](agent.id, agent.name, agent.tone, agent.label);
  
  const fileContent = `---
title: "${agent.formalTitle}"
slug: reference/${agent.slugName}
description: "System isolation bounds and automated compositional guidelines for vector asset ${agent.name}."
date: ${currentDateStamp}
versionLabel: subagent-manifest
status: active
classification: internal
caseNumber: ${agent.caseNumber}
tags:
  - reference
  - scratchpad
  - prompt-addendum
relatedEntries:
  - collection: "reference"
    id: "fref-0900-poet"
updatedAt: ${currentDateStamp}
---
# 📁 ${agent.directiveStr}: ${agent.name}
This official reference framework defines the operational bounds for processor element **${agent.id}**. Execution routines must pull context out-of-bounds to prevent local repository contamination.
## 📊 Monitored Target Coordinates
The following ephemeral tracking paths have been isolated for structural verification:
${agent.fileNames.split(', ').map(f => `* ${f}`).join('\n')}
---
## 🤖 System Directive Instruction Block

\`\`\`markdown
${promptBody}
\`\`\`
`;
  const referenceFilePath = path.join(docsDir, `reference/${agent.slugName}.mdx`);
  fs.writeFileSync(referenceFilePath, fileContent, 'utf8');
});

console.log(`Successfully generated ${stagedAgents.length} individual subagent reference markdown profiles!`);

// Sidecar Sync Verification
const sidecarDir = path.resolve(__dirname, '../src/data/sidecar');
const allMdxFilesFullPaths = getMdxFiles(docsDir);
const allMdxFiles = allMdxFilesFullPaths.map(f => path.relative(path.resolve(__dirname, '..'), f).replace(/\\/g, '/'));

function getJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => path.join(dir, f));
}

const restrictedFiles = new Set([
  'src/content/docs/reference/fref-0900-poet.mdx', 'src/content/docs/reference/fref-0918-qmcl.mdx',
  'src/content/docs/reference/fref-0917-qmpo.mdx', 'src/content/docs/reference/fref-0916-qmba.mdx',
  'src/content/docs/reference/fref-0915-qmse.mdx', 'src/content/docs/reference/fref-0914-clmt.mdx',
  'src/content/docs/reference/fref-0913-apsh.mdx', 'src/content/docs/reference/fref-0912-rdrv.mdx',
  'src/content/docs/reference/fref-0911-rdfd.mdx', 'src/content/docs/reference/fref-0910-rdcs.mdx',
  'src/content/docs/reference/fref-0909-rdpm.mdx', 'src/content/docs/reference/fref-0908-clac.mdx',
  'src/content/docs/reference/fref-0907-aprf.mdx', 'src/content/docs/reference/fref-0906-rdrg.mdx',
  'src/content/docs/reference/fref-0905-rdds.mdx', 'src/content/docs/reference/fref-0904-rdcr.mdx',
  'src/content/docs/reference/fref-0903-rdad.mdx', 'src/content/docs/reference/fref-0902-clls.mdx',
  'src/content/docs/reference/fref-0901-apiv.mdx'
]);

const restrictedOccurrences = new Map();
restrictedFiles.forEach(f => restrictedOccurrences.set(f, 0));
let processedMdxFiles = new Set();

getJsonFiles(sidecarDir).forEach(sidecarFile => {
  try {
    const rawData = JSON.parse(fs.readFileSync(sidecarFile, 'utf-8'));
    if (rawData.records) {
      rawData.records.forEach(r => {
        if (r.file_path) {
          processedMdxFiles.add(r.file_path);
          if (restrictedFiles.has(r.file_path)) {
            restrictedOccurrences.set(r.file_path, (restrictedOccurrences.get(r.file_path) || 0) + 1);
          }
        }
      });
    }
  } catch(e){}
});

const unmappedFiles = allMdxFiles.filter(file => {
  if (processedMdxFiles.has(file)) return false;
  if (restrictedFiles.has(file) && (restrictedOccurrences.get(file) || 0) >= 1) return false;
  return true;
});

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