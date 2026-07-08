// scripts/audit-containment.mjs
import fs from 'fs';
import path from 'path';

const dirs = [
    './src/content/docs/lorelog',
    './src/content/docs/mascots'
];

const BIN_8C_KEYWORDS = ['bin 8c', 'bin-8c', 'ma8c'];
const BIN_8C_REQUIRED_TAGS = ['self-indexing', 'custody-drift', 'hazardous-misfiling', 'cluster-presence'];

const BREEDING_KEYWORDS = ['breeding program', 'breeding governance', 'breeding eligibility'];
const BREEDING_REQUIRED_TAGS = ['refuge-classification', 'labor-refusal', 'gratitude-alignment', 'consent-loop', 'rot protocol', 'rot-protocol']; // rot protocol is a legacy breeding tag

async function auditContainment() {
    const dateStr = new Date().toISOString().split('T')[0];
    let report = `---
title: Cluster Containment Audit
description: Audit identifying jurisdictional violations of Bin 8C and the Breeding Program.
date: ${dateStr}
tags:
  - reference
  - audit
  - containment
---

# Cluster Containment Audit

This audit identifies records referencing highly restricted clusters (Bin 8C, Breeding Governance) without the required jurisdictional tags.

`;
    report += `| File | Violating Reference | Missing Tags |\n`;
    report += `|---|---|---|\n`;

    let violations = 0;

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
        
        for (const file of files) {
            const content = fs.readFileSync(path.join(dir, file), 'utf8');
            const contentLower = content.toLowerCase();
            let frontmatterText = '';
            const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (fmMatch) {
                frontmatterText = fmMatch[1].toLowerCase();
            }

            // Check Bin 8C
            const hasBin8cRef = BIN_8C_KEYWORDS.some(kw => contentLower.includes(kw));
            if (hasBin8cRef) {
                const hasRequiredTag = BIN_8C_REQUIRED_TAGS.some(tag => frontmatterText.includes(tag.toLowerCase()));
                if (!hasRequiredTag) {
                    report += `| \`${file}\` | Bin 8C | Needs: \`${BIN_8C_REQUIRED_TAGS.join(', ')}\` |\n`;
                    violations++;
                }
            }

            // Check Breeding
            const hasBreedingRef = BREEDING_KEYWORDS.some(kw => contentLower.includes(kw));
            if (hasBreedingRef) {
                const hasRequiredTag = BREEDING_REQUIRED_TAGS.some(tag => frontmatterText.includes(tag.toLowerCase()));
                if (!hasRequiredTag) {
                    report += `| \`${file}\` | Breeding Program | Needs: \`${BREEDING_REQUIRED_TAGS.join(', ')}\` |\n`;
                    violations++;
                }
            }
        }
    }

    report += `\n**Total Containment Violations:** ${violations}\n`;
    fs.mkdirSync('./exports', { recursive: true });
    fs.writeFileSync('./exports/containment-audit.md', report);
    console.log(`Containment audit generated. Found ${violations} violations.`);
}

auditContainment();
