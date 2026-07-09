// scripts/audit-frontmatter-integrity.mjs
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dirs = [
    './src/content/docs/mascots',
    './src/content/docs/lorelog'
];

export function runFrontmatterAudit() {
    let nullVectors = [];
    let fragmentedTags = [];

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;
        
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
        
        for (const file of files) {
            const content = fs.readFileSync(path.join(dir, file), 'utf8');
            let parsed;
            try {
                parsed = matter(content);
            } catch (e) {
                continue;
            }

            const data = parsed.data;

            // Check for nulls in known arrays
            const arraysToCheck = ['knownFailures', 'ceremonialTasks', 'tags'];
            arraysToCheck.forEach(field => {
                if (Array.isArray(data[field])) {
                    if (data[field].some(val => val === null || val === 'null')) {
                        nullVectors.push({ file, field });
                    }
                }
            });

            // Check for tag fragmentation
            if (Array.isArray(data.tags)) {
                data.tags.forEach(tag => {
                    if (tag === null) return;
                    const tagStr = String(tag);
                    // Check if tag contains stray quotes at the end, or starts with lower case conjunctions
                    if (tagStr.endsWith('"') || tagStr.endsWith('."') || tagStr.startsWith('and ') || tagStr.startsWith('which ') || tagStr.startsWith('but ')) {
                        fragmentedTags.push({ file, fragment: tagStr.substring(0, 100) });
                    }
                });
            }
        }
    }

    return {
        nullVectors,
        fragmentedTags,
        count: nullVectors.length + fragmentedTags.length
    };
}

import { fileURLToPath } from 'url';
const isMain = process.argv[1] && (fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url)));

if (isMain) {
    const dateStr = new Date().toISOString().split('T')[0];
    const { nullVectors, fragmentedTags, count } = runFrontmatterAudit();
    
    let report = `---
title: Frontmatter Integrity Audit
description: Observational dashboard tracking schema rot, metadata collapse, and tag fragmentation across the archive.
date: ${dateStr}
tags:
  - reference
  - audit
  - integrity
  - schema-rot
---

# Frontmatter Integrity Audit

This report tracks the physical degradation of the archive's metadata. As automated maintenance scripts process the archive, they occasionally leave behind schema rot—empty arrays collapsing into null vectors, or multiline strings fracturing into orphaned tag fragments.

We do not correct these. We observe them as geological formations of institutional decay.

## Null Vectors

Arrays that have collapsed and now explicitly contain \`null\`.

| File | Field | Status |
|---|---|---|
`;

    if (nullVectors.length === 0) {
        report += `| *No null vectors detected.* | - | - |\n`;
    } else {
        nullVectors.forEach(nv => {
            report += `| \`${nv.file}\` | \`${nv.field}\` | Collapsed |\n`;
        });
    }

    report += `

## Tag Fragmentation

Orphaned string fragments and misquoted scalars found trapped in the \`tags\` array.

| File | Fragment |
|---|---|
`;

    if (fragmentedTags.length === 0) {
        report += `| *No fragmented tags detected.* | - |\n`;
    } else {
        fragmentedTags.forEach(ft => {
            // Escape pipe characters for markdown table
            const safeFragment = ft.fragment.replace(/\|/g, '\\|').replace(/\n/g, ' ');
            report += `| \`${ft.file}\` | \`${safeFragment}\` |\n`;
        });
    }

    report += `\n**Total Structural Anomalies:** ${count}\n`;

    fs.mkdirSync('./exports', { recursive: true });
    fs.writeFileSync('./exports/frontmatter-integrity-audit.md', report);
    console.log(`Frontmatter Integrity Audit generated. Found ${count} anomalies.`);
}
