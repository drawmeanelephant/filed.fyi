// scripts/boundary-audit.mjs
import fs from 'fs';
import path from 'path';

const mascotsDir = './src/content/docs/mascots';

const CLUSTERS = {
    "Access / Polite Refusal": ["access", "refusal", "deny", "forbid", "gate", "door", "entry", "permission", "authorization"],
    "Care-delay / Side-channel Relief": ["delay", "care", "relief", "side-channel", "comfort", "soothe", "wait", "hold", "queue", "escrow"],
    "Adequacy / Exoneration / Summary Laundering": ["adequacy", "exoneration", "summary", "launder", "absolution", "forgive", "excuse", "justify", "seal"],
    "Annex / Appendix / Rear-section Truth": ["annex", "appendix", "rear", "margin", "footnote", "sidebar", "silence", "hush", "dust", "archive"]
};

async function auditBoundaries() {
    const files = fs.readdirSync(mascotsDir).filter(f => f.endsWith('.mdx'));
    const dateStr = new Date().toISOString().split('T')[0];
    let report = `---
title: Mascot Boundary Audit
description: Audit identifying overlap clusters that may require boundary clarification.
date: ${dateStr}
tags:
  - reference
  - audit
  - boundaries
---

# Mascot Boundary Audit

This audit identifies overlap clusters that may require boundary clarification (not necessarily mergers).

`;

    const grouped = {
        "Access / Polite Refusal": [],
        "Care-delay / Side-channel Relief": [],
        "Adequacy / Exoneration / Summary Laundering": [],
        "Annex / Appendix / Rear-section Truth": [],
        "Unclustered": []
    };

    for (const file of files) {
        const content = fs.readFileSync(path.join(mascotsDir, file), 'utf8');
        const contentLower = content.toLowerCase();
        
        let assigned = false;
        for (const [clusterName, keywords] of Object.entries(CLUSTERS)) {
            let hits = 0;
            for (const kw of keywords) {
                if (contentLower.includes(kw)) hits++;
            }
            if (hits >= 2) {
                grouped[clusterName].push(file);
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            grouped["Unclustered"].push(file);
        }
    }

    for (const [clusterName, filesList] of Object.entries(grouped)) {
        if (clusterName === "Unclustered") continue;
        report += `## ${clusterName} (${filesList.length} mascots)\n`;
        for (const f of filesList) {
            report += `- \`${f}\`\n`;
        }
        report += `\n`;
    }

    fs.mkdirSync('./exports', { recursive: true });
    fs.writeFileSync('./exports/boundary-audit.md', report);
    console.log('Boundary audit generated.');
}

auditBoundaries();
