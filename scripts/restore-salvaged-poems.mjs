#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const quarantineDir = path.join(projectRoot, 'exports/bad-poetry-oh-noetry');

const salvageList = {
  "src/content/haikus/hai-248-attestation-mole.mdx": ["Blind Signature"],
  "src/content/haikus/hai-265-provisional-mint.mdx": ["PROCEDURAL_CLEAN: Deferral"],
  "src/content/haikus/hai-412-red-pencil-mercy.mdx": ["Margin Audit"],
  "src/content/haikus/hai-938-vantage-hollow.mdx": ["Assurance Optics"],
  "src/content/haikus/hai-fref-0560-asar.mdx": ["Myth Drift"],
  "src/content/haikus/hai-fref-0730-lcob.mdx": ["Optical Compliance"],
  "src/content/haikus/hai-fref-0825-vhcn.mdx": ["Continuity Seal"],
  "src/content/haikus/hai-fref-0870-wtsl.mdx": ["Legitimacy Drift"],
  "src/content/haikus/hai-fref-0901-apiv.mdx": ["Archive Drift"],
  "src/content/haikus/hai-fref-0902-clls.mdx": ["Ledger Count"],
  "src/content/haikus/hai-fref-0910-rdcs.mdx": ["Validation Lag"],
  "src/content/haikus/hai-llg-0052-mfx.mdx": ["No Action Taken"],
  "src/content/haikus/hai-llg-0115-tns.mdx": ["A Silent Ledger"],

  "src/content/limericks/LIM-FREF-0570-CELC.mdx": ["Breach of Margin Protocol"],
  "src/content/limericks/LIM-LLG-0007-COMA.mdx": ["Uptime Baseline Maintained", "Infinite Scale"],
  "src/content/limericks/LIM-LLG-0072-SOMA.mdx": ["Audit Margin"],
  "src/content/limericks/LIM-LLG-0103-COMA.mdx": ["Total Audit"],
  "src/content/limericks/LIM-LLG-0220-UIS.mdx": ["Perfect Ledger", "Flawless Execution"],
  "src/content/limericks/LIM-LLG-0230-HYG.mdx": ["Sanitized Ledger", "Liability Shielded"],
  "src/content/limericks/LIM-LLG-0323-LC04.mdx": ["Removing Is Not Defined"],
  "src/content/limericks/LIM-LLG-0383-RAW.mdx": ["The Flawed Witness"],
  "src/content/limericks/LIM-LLG-0385-SED.mdx": ["Minutes of the Third Witness Coffee"],
  "src/content/limericks/LIM-LLG-0391-LAA.mdx": ["Reception Summary Drift"],
  "src/content/limericks/LIM-LLG-0418-RSK.mdx": ["Redacted Queue"],
  "src/content/limericks/LIM-LLG-0446-OQF.mdx": ["Endless Wait"],
  "src/content/limericks/LIM-fref-0850-mard.mdx": ["Corridor Ledger"],
  "src/content/limericks/lim-ffp-0385-progress-without-work.mdx": ["The Vacancy"],
  "src/content/limericks/lim-fref-0230-cmal.mdx": ["PROCEDURAL_CLEAN: Auditory Validation"],
  "src/content/limericks/lim-fref-0825-vhcn.mdx": ["Status: Verified"],

  "src/content/aphorisms/APH-FREF-0330-TSAC.mdx": ["Narrative drift is our primary ledger."],
  "src/content/aphorisms/APH-FREF-0420-ANCL.mdx": ["Epistemological Threat Neutralized. Stamp Deployed.", "Inaction Certified. Protocol Satisfied."],
  "src/content/aphorisms/APH-FREF-0430-EASP.mdx": ["Translation drift isolated. Panic optimized."],
  "src/content/aphorisms/APH-FREF-0850-VARD.mdx": ["Baseline purity. Protocol secured."],
  "src/content/aphorisms/APH-LLG-0072-SOMA.mdx": ["Dual vector status. Record sealed."],
  "src/content/aphorisms/APH-LLG-0300-SC-X.mdx": ["Simultaneous Compliance."],
  "src/content/aphorisms/APH-LLG-0318-SRO.mdx": ["Audit compliance."],
  "src/content/aphorisms/APH-LLG-0323-LC04.mdx": ["Unwithheld seal. Jurisdiction shifted."],
  "src/content/aphorisms/APH-LLG-0418-RSK.mdx": ["Containment Protocol Alpha.", "Audit Mitigation Strategy."],
  "src/content/aphorisms/APH-LLG-0447-SLA.mdx": ["AUDIT FINALITY."]
};

const cleanTitle = (t) => t.toLowerCase().replace(/\.$/, '').trim();
const currentDateStamp = new Date().toISOString().slice(0, 10);

let restoredCount = 0;

Object.entries(salvageList).forEach(([relPath, titles]) => {
  const fullPath = path.join(projectRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Target file does not exist: ${relPath}`);
    return;
  }
  
  // Find quarantined companion
  const subDir = path.dirname(relPath).replace(/^src\/content\//, '');
  const baseName = path.basename(relPath).replace(/\.mdx?$/, '.md');
  const qFilePath = path.join(quarantineDir, subDir, baseName);
  
  if (!fs.existsSync(qFilePath)) {
    console.error(`Quarantined source file not found: ${qFilePath}`);
    return;
  }
  
  const qContent = fs.readFileSync(qFilePath, 'utf8');
  let targetFileContent = fs.readFileSync(fullPath, 'utf8');
  
  // Parse quarantined XML blocks
  const componentRegex = /```xml\s*([\s\S]*?)```/g;
  let match;
  const blocksToRestore = [];
  
  while ((match = componentRegex.exec(qContent)) !== null) {
    const xmlBlock = match[1].trim();
    // Parse title from attributes
    const titleMatch = xmlBlock.match(/title="([^"]+)"/i);
    if (titleMatch) {
      const blockTitle = titleMatch[1];
      if (titles.some(t => cleanTitle(t) === cleanTitle(blockTitle))) {
        blocksToRestore.push({ blockTitle, xmlBlock });
      }
    }
  }
  
  if (blocksToRestore.length > 0) {
    console.log(`[RESTORE] ${relPath}: restoring ${blocksToRestore.length} poem(s)`);
    
    blocksToRestore.forEach(b => {
      console.log(`  + "${b.blockTitle}"`);
      // Append to the end of the file, keeping double blank lines
      if (!targetFileContent.endsWith('\n')) {
        targetFileContent += '\n';
      }
      targetFileContent += `\n${b.xmlBlock}\n`;
      restoredCount++;
    });
    
    // Clean up consecutive blank lines
    targetFileContent = targetFileContent.replace(/\n{3,}/g, '\n\n');
    
    // Update frontmatter updatedAt date to current date
    const updatedDateRegex = /updatedAt:\s*['"]?\d{4}-\d{2}-\d{2}['"]?/g;
    if (updatedDateRegex.test(targetFileContent)) {
      targetFileContent = targetFileContent.replace(updatedDateRegex, `updatedAt: ${currentDateStamp}`);
    }
    
    fs.writeFileSync(fullPath, targetFileContent, 'utf8');
  } else {
    console.warn(`[WARNING] No matching quarantined blocks found in ${qFilePath} for: ${titles.join(', ')}`);
  }
});

console.log(`\nSuccessfully restored ${restoredCount} salvaged poems back to their original files!`);
