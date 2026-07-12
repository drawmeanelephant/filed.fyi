#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const contentDir = path.join(projectRoot, 'src/content');
const quarantineDir = path.join(projectRoot, 'exports/bad-poetry-oh-noetry');

// Command line flags: --write
const args = process.argv.slice(2);
const isWriteMode = args.includes('--write');

// Word Lists
const hardYeets = [
  'bug', 'glitch', 'coffee', 'coding', 'hack', 'nerd', 'caffeine', 'programmer', 'crashlog'
];

const softSuspicion = [
  'runtime', 'uptime', 'injection', 'compliance', 'signature',
  'margin', 'drift', 'ledger', 'baseline', 'validation', 'audit', 'matrix', 'seal', 'corridor', 'protocol'
];

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

// Global ISO Date Stamp
const currentDateStamp = new Date().toISOString().slice(0, 10);

const collections = ['haikus', 'limericks', 'aphorisms'];
let totalYeeted = 0;
let totalScanned = 0;
const quarantineRecords = {};

collections.forEach(col => {
  const dir = path.join(contentDir, col);
  const files = getMdxFiles(dir);

  files.forEach(filePath => {
    const relativePath = path.relative(projectRoot, filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Deconstruct by components
    // Non-greedy capture of Limerick/Broside components
    const componentRegex = /<(Limerick|Broside)([^>]*)>([\s\S]*?)<\/\1>/g;
    
    let match;
    let newContent = content;
    const yeetedInThisFile = [];
    
    while ((match = componentRegex.exec(content)) !== null) {
      totalScanned++;
      const fullBlock = match[0];
      const tag = match[1];
      const attrs = match[2];
      const innerText = match[3];
      
      const titleMatch = attrs.match(/title="([^"]+)"/i);
      const title = titleMatch ? titleMatch[1] : 'Untitled';
      
      const textToCheck = (title + '\n' + innerText).toLowerCase();
      
      let matchedHard = [];
      let matchedSoft = [];
      
      hardYeets.forEach(w => {
        const r = new RegExp('\\b' + w + '\\b', 'i');
        if (r.test(textToCheck)) matchedHard.push(w);
      });
      
      softSuspicion.forEach(w => {
        const r = new RegExp('\\b' + w + '\\b', 'i');
        if (r.test(textToCheck)) matchedSoft.push(w);
      });
      
      // Threshold rules:
      // 1. Any hard yeet word -> Yeet!
      // 2. Or two or more soft/suspicious words -> Yeet!
      const shouldYeet = (matchedHard.length > 0) || (matchedSoft.length >= 2);
      
      if (shouldYeet) {
        totalYeeted++;
        const reason = matchedHard.length > 0 
          ? `Hard Yeet (${matchedHard.join(', ')})` 
          : `Soft Threshold met (${matchedSoft.join(', ')})`;
          
        yeetedInThisFile.push({
          fullBlock,
          title,
          tag,
          reason,
          text: innerText.trim()
        });
        
        // Replace full block in content.
        // Also capture any leading/trailing newlines to avoid whitespace gaps.
        newContent = newContent.replace(fullBlock, '');
      }
    }
    
    if (yeetedInThisFile.length > 0) {
      console.log(`[YEET] ${relativePath}: yeeted ${yeetedInThisFile.length} poem(s)`);
      yeetedInThisFile.forEach(p => {
        console.log(`  - "${p.title}" [${p.tag}]: ${p.reason}`);
      });
      
      // Clean up consecutive blank lines (more than 2 consecutive newlines)
      newContent = newContent.replace(/\n{3,}/g, '\n\n');
      // Ensure file ends with a single newline
      if (!newContent.endsWith('\n')) {
        newContent += '\n';
      }
      
      // Update frontmatter updatedAt
      const updatedDateRegex = /updatedAt:\s*['"]?\d{4}-\d{2}-\d{2}['"]?/g;
      if (updatedDateRegex.test(newContent)) {
        newContent = newContent.replace(updatedDateRegex, `updatedAt: ${currentDateStamp}`);
      } else {
        // Fallback: insert it right before the closing --- if it somehow didn't have it
        newContent = newContent.replace(/---([\s\S]*?)---/, (match, body) => {
          if (!body.includes('updatedAt')) {
            return `---${body}updatedAt: ${currentDateStamp}\n---`;
          }
          return match;
        });
      }
      
      quarantineRecords[relativePath] = yeetedInThisFile;
      
      if (isWriteMode) {
        fs.writeFileSync(filePath, newContent, 'utf8');
      }
    }
  });
});

console.log('\n=========================================');
console.log(`Scan complete. Scanned ${totalScanned} poems.`);
console.log(`Identified ${totalYeeted} poems for yeeting/quarantine.`);
console.log(`Write Mode: ${isWriteMode ? 'ENABLED (Files updated)' : 'DISABLED (Dry run only)'}`);
console.log('=========================================\n');

// Write quarantine logs to exports/bad-poetry-oh-noetry
if (totalYeeted > 0) {
  if (!fs.existsSync(quarantineDir)) {
    fs.mkdirSync(quarantineDir, { recursive: true });
  }
  
  let qMarkdown = `# Bad Poetry Quarantine Vault\n\nGenerated on ${currentDateStamp}\n\n`;
  
  Object.entries(quarantineRecords).forEach(([relPath, poems]) => {
    qMarkdown += `## [${relPath}](file:///${path.join(projectRoot, relPath)})\n\n`;
    poems.forEach(p => {
      qMarkdown += `### "${p.title}" (${p.reason})\n`;
      qMarkdown += `Type: \`${p.tag}\`\n\n`;
      qMarkdown += `\`\`\`\n${p.text}\n\`\`\`\n\n`;
      
      // Also write out separate copy in the quarantine folder matching original location
      const subDir = path.dirname(relPath).replace(/^src\/content\//, '');
      const fullSubDir = path.join(quarantineDir, subDir);
      if (!fs.existsSync(fullSubDir)) {
        fs.mkdirSync(fullSubDir, { recursive: true });
      }
      const qFilePath = path.join(fullSubDir, path.basename(relPath).replace(/\.mdx?$/, '.md'));
      
      let qFileContent = '';
      if (fs.existsSync(qFilePath)) {
        qFileContent = fs.readFileSync(qFilePath, 'utf8');
      } else {
        qFileContent = `# Quarantined from ${path.basename(relPath)}\n\n`;
      }
      qFileContent += `## "${p.title}" (${p.reason})\n`;
      qFileContent += `\`\`\`xml\n${p.fullBlock}\n\`\`\`\n\n`;
      
      if (isWriteMode) {
        fs.writeFileSync(qFilePath, qFileContent, 'utf8');
      }
    });
  });
  
  const qReportPath = path.join(quarantineDir, 'quarantine-report.md');
  if (isWriteMode) {
    fs.writeFileSync(qReportPath, qMarkdown, 'utf8');
    console.log(`Wrote quarantine report to ${qReportPath}`);
  } else {
    console.log(`[DRY RUN] Would write quarantine report to ${qReportPath}`);
  }
}
