import fs from 'fs';
import path from 'path';

const anchors = {
  'core-doctrines': [
    'reference-tome.md',
    'fref-0840-rwrr.mdx',
    'LLG-0324-MAP.mdx',
    'LLG-0364-RAGE-BAIT-TAXONOMY.mdx',
    'fref-0500-egyx.mdx',
    'LLG-0007-COMA.mdx',
    'fref-0170-lgef.mdx',
    'trust-surface-index-note.mdx',
    'LLG-TDCIP-OVERCOH.mdx',
    'replacement-without-release.md'
  ],
  'operational-engines': [
    'LLG-0350-DOGE-CHARTER.mdx',
    'LLG-0360-RAGE-CHARTER.mdx',
    'LLG-0362-RAGE-EXTRACTION.mdx',
    'fref-0580-cmps.mdx',
    'LLG-0409-PRE.mdx',
    'LLG-0406-FSD.mdx',
    'trust-surface-boundary-audit.md',
    'containment-audit.md',
    'LLG-0351-DOGE-INTAKE.mdx',
    'LLG-0400-SCAS.mdx'
  ],
  'assurance-lexicon': [
    'reference-tome.md',
    'LLG-0020-COMA19-PBC.mdx',
    'fref-0560-adjc.mdx',
    '286.favorable-beige.mdx',
    'LLG-0352-DOGE-RUBRIC.mdx',
    '289.recital-of-sufficiency.mdx',
    '324.complimentary-ghostline.mdx',
    'LLG-0072-SOMA.mdx'
  ],
  'cultural-staples': [
    '005.bricky-goldbricksworth.mdx',
    '019.kindy-mcexistentialcrisis.mdx',
    '053.tabby-fields.mdx',
    '938.vantage-hollow.mdx',
    'LLG-0400-CMA-TSP.mdx',
    'LLG-0382-BPD.mdx',
    'mascot-anchoring-audit.md',
    '084.lc-04-soft-green-seal.mdx',
    '240.badgevine.mdx',
    '023.modrewrite-gremblin.mdx'
  ],
  'classifications': [
    'fref-0150-mapa.mdx',
    'fref-0160-maii.mdx',
    'LLG-0326-DXS.mdx',
    'LLG-0365-BAIT-B2A.mdx',
    '082.ma-lcgu-porter.mdx',
    'LLG-0414-WAD.mdx',
    '435.driftlocked-policy-box.mdx',
    'fref-0560-adjc.mdx',
    'LLG-0441-TSR.mdx',
    '433.sidecar-conflict-porter.mdx'
  ]
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const fileMap = {};
walkDir('src/content/docs', (filePath) => {
  const base = path.basename(filePath);
  // Store lowercased versions to handle any case mismatches
  const lowerBase = base.toLowerCase();
  if (!fileMap[lowerBase]) fileMap[lowerBase] = [];
  fileMap[lowerBase].push(filePath);
});

for (const [concept, files] of Object.entries(anchors)) {
  for (const file of files) {
    const paths = fileMap[file.toLowerCase()];
    if (paths) {
      for (const p of paths) {
        let content = fs.readFileSync(p, 'utf8');
        let lines = content.split('\n');
        let inFrontmatter = false;
        let conceptsLineIndex = -1;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i] === '---') {
            if (!inFrontmatter) {
              inFrontmatter = true;
            } else {
              // end of frontmatter
              if (conceptsLineIndex === -1) {
                 lines.splice(i, 0, 'concepts:', `  - ${concept}`);
              } else {
                 let hasConcept = false;
                 // check if concept exists under concepts:
                 for (let j = conceptsLineIndex + 1; j < lines.length; j++) {
                   if (lines[j].trim() === `- ${concept}`) {
                     hasConcept = true;
                     break;
                   }
                   if (lines[j] === '---' || (lines[j].trim() !== '' && !lines[j].startsWith(' ') && !lines[j].startsWith('-'))) break; 
                 }
                 if (!hasConcept) {
                   lines.splice(conceptsLineIndex + 1, 0, `  - ${concept}`);
                 }
              }
              break;
            }
          } else if (inFrontmatter && lines[i].startsWith('concepts:')) {
            conceptsLineIndex = i;
          }
        }
        
        fs.writeFileSync(p, lines.join('\n'), 'utf8');
        console.log(`Tagged ${p} with ${concept}`);
      }
    } else {
      console.log(`⚠️ Could not find ${file}`);
    }
  }
}
