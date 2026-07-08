// scripts/scaffold-poetry.mjs
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const DOCS_DIR = path.join(CONTENT_DIR, 'docs');

const prefixMap = { haikus: 'hai', limericks: 'lim', aphorisms: 'aph' };

async function getFiles(parentDir, dirPath, basePath = '') {
    try {
        const fullPath = path.join(parentDir, dirPath, basePath);
        const entries = await fs.readdir(fullPath, { withFileTypes: true });
        let files = [];
        for (const e of entries) {
            const relPath = path.join(basePath, e.name);
            if (e.isDirectory()) {
                files = files.concat(await getFiles(parentDir, dirPath, relPath));
            } else if (e.name.endsWith('.md') || e.name.endsWith('.mdx')) {
                files.push(relPath);
            }
        }
        return files;
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

async function parsePoetryFile(dir, filename) {
    const filePath = path.join(CONTENT_DIR, dir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(content);
    return {
        file: filename,
        frontmatter: parsed.data || {}
    };
}

async function parseSourceFile(dir, filename) {
    const filePath = path.join(DOCS_DIR, dir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(content);
    return {
        file: filename,
        title: parsed.data.title || filename.replace(/\.mdx?$/, ''),
        frontmatter: parsed.data || {}
    };
}

async function parseCollection(dir) {
    const files = await getFiles(CONTENT_DIR, dir);
    let parsed = [];
    for (const file of files) {
        parsed.push(await parsePoetryFile(dir, file));
    }
    return parsed;
}

const stubs = {
    haikus: `<Limerick type="caution" title="Procedural Stub" icon="file">
Awaiting context  
The record is totally bare  
Pending binding soon  
</Limerick>`,
    limericks: `<Limerick type="caution" title="Procedural Stub" icon="file">
The record is utterly bare,  
With nothing but digital air.  
We printed the form,  
To weather the storm,  
And left it to quietly tear.  
</Limerick>`,
    aphorisms: `<Broside type="caution" title="Pending binding" icon="file">
Awaiting procedural interpretation. The system kept the ritual and misplaced the function.
</Broside>`
};

async function generateStub(poetryType, sourceDir, sourceFile, sourceData, targetFilename) {
    const baseFile = path.basename(sourceFile.file);
    const ext = path.extname(sourceFile.file);
    const cleanName = baseFile.slice(0, -ext.length);

    const newPath = path.join(CONTENT_DIR, poetryType, targetFilename);

    let mascotRef = 'null';
    let relatedMascots = '[]';
    let relatedLorelog = 'null';

    const mascotMatch = cleanName.match(/^(\d{3})\.(.*)$/);

    if (sourceDir === 'mascots') {
        if (mascotMatch) {
            mascotRef = `'${mascotMatch[2]}'`;
        } else {
            mascotRef = `'${cleanName}'`;
        }
        relatedMascots = `['${cleanName}']`;
    } else if (sourceDir === 'lorelog') {
        relatedLorelog = `'${cleanName}'`;
    }

    const mdxContent = `---
title: "Stub: ${sourceData.title.replace(/"/g, '\\"')}"
slug: ${poetryType}/${targetFilename.replace(/\.mdx?$/, '')}
description: "Procedural stub awaiting contextual binding for ${sourceData.title.replace(/"/g, '\\"')}"
date: ${new Date().toISOString()}
author: System
status: partial
relatedLorelog: ${relatedLorelog}
relatedMascots: ${relatedMascots}
mascotRef: ${mascotRef}
concepts:
  - stub
updatedAt: ${new Date().toISOString().split('T')[0]}
---

## Procedural Entry

${stubs[poetryType]}
`;

    await fs.mkdir(path.dirname(newPath), { recursive: true });
    await fs.writeFile(newPath, mdxContent, 'utf-8');
    console.log(`Created: ${poetryType}/${targetFilename}`);
}

async function main() {
    console.log(`Starting Poetry Scaffolding...`);

    const sourceDirs = ['lorelog', 'mascots', 'reference', 'posts', 'guides'];
    const poetryDirs = ['haikus', 'limericks', 'aphorisms'];

    const poetry = {};
    for (const dir of poetryDirs) {
        poetry[dir] = await parseCollection(dir);
    }

    let createdCount = 0;

    for (const sourceName of sourceDirs) {
        const files = await getFiles(DOCS_DIR, sourceName);

        for (const filename of files) {
            const baseFile = path.basename(filename);
            const ext = path.extname(filename);
            const cleanName = baseFile.slice(0, -ext.length);
            const sourceData = await parseSourceFile(sourceName, filename);

            for (const pType of poetryDirs) {
                // Compute target filename exactly according to audit expectations
                let targetFilename = '';
                const mascotMatch = cleanName.match(/^(\d{3})\.(.*)$/);
                if (mascotMatch) {
                    const num = mascotMatch[1];
                    const name = mascotMatch[2];
                    if (pType === 'aphorisms') targetFilename = `APH-${num}.${name}.mdx`;
                    else if (pType === 'haikus') targetFilename = `hai-${num}-${name}.mdx`;
                    else if (pType === 'limericks') targetFilename = `lim-${name}.mdx`;
                } else {
                    if (pType === 'aphorisms') targetFilename = `APH-${cleanName}.mdx`;
                    else if (pType === 'haikus') targetFilename = `hai-${cleanName.toLowerCase()}.mdx`;
                    else if (pType === 'limericks') targetFilename = `LIM-${cleanName}.mdx`;
                }

                // Check if targetFilename exists in the collection (case-insensitive check)
                const exists = poetry[pType].some(p => {
                    const base = path.basename(p.file);
                    return base.toLowerCase() === targetFilename.toLowerCase();
                });

                if (!exists) {
                    await generateStub(pType, sourceName, { file: filename }, sourceData, targetFilename);
                    createdCount++;

                    // Add to cache so we don't duplicate
                    poetry[pType].push({
                        file: targetFilename,
                        frontmatter: {}
                    });
                }
            }
        }
    }

    console.log(`Scaffolding complete. Created ${createdCount} missing poetry stubs.`);
}

main().catch(console.error);
