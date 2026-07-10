// scripts/astro-diagnostic.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const EXPORT_DIR = path.resolve('./exports');
const CHUNK_SIZE_LIMIT = 500 * 1024;

const DEFAULT_EXCLUDES = [
  'node_modules', 'public', 'dist', '.git', '.astro',
  '.cache', 'exports', '.rag', 'reference/empathegy', '.turbo', '.vercel'
];

const MODE = (process.argv.find(a => a.startsWith('--mode=')) || '--mode=story').split('=')[1];

function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

function getFiles(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (DEFAULT_EXCLUDES.includes(file)) continue;
      results.push(...getFiles(filePath));
    } else {
      if (/\.(md|mdx)$/.test(file)) results.push(filePath);
    }
  }
  return results;
}

function stringifyYAML(obj) {
  let yaml = '';
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) {
        yaml += `${key}: []\n`;
      } else {
        yaml += `${key}:\n`;
        for (const item of value) {
          if (typeof item === 'object') {
            yaml += `  - collection: "${item.collection}"\n    id: "${item.id}"\n`;
          } else {
            yaml += `  - "${item}"\n`;
          }
        }
      }
    } else if (typeof value === 'object') {
      yaml += `${key}:\n`;
      for (const [subKey, subVal] of Object.entries(value)) {
        if (Array.isArray(subVal)) {
          if (subVal.length === 0) {
            yaml += `  ${subKey}: []\n`;
          } else {
            yaml += `  ${subKey}:\n`;
            for (const item of subVal) {
              if (typeof item === 'object') {
                yaml += `    - collection: "${item.collection}"\n      id: "${item.id}"\n`;
              } else {
                yaml += `    - "${item}"\n`;
              }
            }
          }
        } else {
          yaml += `  ${subKey}: "${subVal}"\n`;
        }
      }
    } else {
      const strVal = String(value);
      if (strVal.includes('\n')) {
        yaml += `${key}: |\n` + strVal.split('\n').map(line => `  ${line}`).join('\n') + '\n';
      } else {
        yaml += `${key}: "${strVal.replace(/"/g, '\\"')}"\n`;
      }
    }
  }
  return yaml.trim();
}

function buildBlock_story(filePath, relPath, collection) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);

  // Filter frontmatter to keep non-relation fields
  const headerData = {};
  const keepNonRelation = {
    lorelog: ['title', 'slug', 'caseNumber', 'description', 'summary'],
    mascots: ['title', 'slug', 'mascotId', 'description'],
    limericks: ['title', 'slug'],
    haikus: ['title', 'slug'],
    aphorisms: ['title', 'slug', 'caseNumber'],
    reference: ['title', 'slug', 'caseNumber', 'description']
  }[collection] || [];

  for (const key of keepNonRelation) {
    if (frontmatter[key] !== undefined && frontmatter[key] !== null) {
      headerData[key] = frontmatter[key];
    }
  }

  // Normalize relation fields
  const relations = {
    relatedEntries: [],
    relatedLorelog: [],
    relatedMascots: []
  };

  // Populate relatedEntries
  if (Array.isArray(frontmatter.relatedEntries)) {
    for (const entry of frontmatter.relatedEntries) {
      if (entry && typeof entry === 'object' && entry.collection && entry.id) {
        relations.relatedEntries.push({ collection: entry.collection, id: entry.id });
      }
    }
  }

  // Populate relatedLorelog
  if (frontmatter.relatedLorelog) {
    if (Array.isArray(frontmatter.relatedLorelog)) {
      relations.relatedLorelog.push(...frontmatter.relatedLorelog.filter(Boolean).map(String));
    } else {
      relations.relatedLorelog.push(String(frontmatter.relatedLorelog));
    }
  }

  // Populate relatedMascots / relatedMascot / mascotRef
  const mascotRefs = [];
  if (frontmatter.relatedMascots) {
    if (Array.isArray(frontmatter.relatedMascots)) {
      mascotRefs.push(...frontmatter.relatedMascots.filter(Boolean).map(String));
    } else {
      mascotRefs.push(String(frontmatter.relatedMascots));
    }
  }
  if (frontmatter.relatedMascot) {
    if (Array.isArray(frontmatter.relatedMascot)) {
      mascotRefs.push(...frontmatter.relatedMascot.filter(Boolean).map(String));
    } else {
      mascotRefs.push(String(frontmatter.relatedMascot));
    }
  }
  if (frontmatter.mascotRef) {
    mascotRefs.push(String(frontmatter.mascotRef));
  }

  relations.relatedMascots = [...new Set(mascotRefs)];
  relations.relatedLorelog = [...new Set(relations.relatedLorelog)];

  // Deduplicate relatedEntries
  const entryKeys = new Set();
  const uniqueEntries = [];
  for (const entry of relations.relatedEntries) {
    const key = `${entry.collection}:${entry.id}`;
    if (!entryKeys.has(key)) {
      entryKeys.add(key);
      uniqueEntries.push(entry);
    }
  }
  relations.relatedEntries = uniqueEntries;

  const headerYAML = stringifyYAML(headerData);
  const relationsYAML = stringifyYAML({ relations });

  const blockTitle = headerData.title || path.basename(filePath);

  return `## ${blockTitle}\n\n` +
    `path: ${relPath}\n\n` +
    `\`\`\`yaml\n` +
    `---\n` +
    `${headerYAML}\n` +
    `---` +
    `\n\`\`\`\n\n` +
    `\`\`\`yaml\n` +
    `${relationsYAML}\n` +
    `\`\`\`\n\n` +
    `### Body\n\n` +
    `${body.trim()}\n\n\n`;
}

function buildBlock_classify(filePath, relPath, collection) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter } = matter(content);
  const title = frontmatter.title || path.basename(filePath);

  let identity = '';
  if (frontmatter.caseNumber) {
    identity = `caseNumber: ${frontmatter.caseNumber}`;
  } else if (frontmatter.mascotId) {
    identity = `mascotId: ${frontmatter.mascotId}`;
  } else if (frontmatter.slug) {
    identity = `slug: ${frontmatter.slug}`;
  } else {
    identity = `id: n/a`;
  }

  return `- ${title} | ${identity} | path: ${relPath}\n`;
}

function writeSegmented(title, filePaths, baseFilename, collection, buildBlock) {
  const activePaths = filePaths.filter(f => {
    const rel = path.relative(process.cwd(), f);
    const segments = rel.split(path.sep);
    return !DEFAULT_EXCLUDES.some(ex => segments.includes(ex));
  });
  if (activePaths.length === 0) return;

  let buffer = '';

  for (const filePath of activePaths) {
    const relPath = path.relative(process.cwd(), filePath);
    const block = buildBlock(filePath, relPath, collection);
    buffer += block;
  }

  const outPath = path.join(EXPORT_DIR, `${baseFilename}.md`);
  const header = `---\ntitle: "${title}"\nmode: ${MODE}\ndate: ${new Date().toISOString().split('T')[0]}\n---\n\n`;
  fs.writeFileSync(outPath, header + buffer);
  console.log(`✓ Created exports/${path.basename(outPath)} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}


function main() {
  ensureDirs();
  console.log(`▶ Running diagnostic pipeline in "${MODE}" mode...`);

  const allDocs = getFiles(process.cwd()).filter(f => {
    const normalized = f.replace(/\\/g, '/');
    return normalized.includes('/src/content/') || normalized.includes('/content/');
  });

  const collections = {
    lorelog: [],
    mascots: [],
    limericks: [],
    haikus: [],
    aphorisms: [],
    reference: []
  };

  for (const f of allDocs) {
    const normalized = f.replace(/\\/g, '/');
    if (normalized.includes('/src/content/docs/lorelog/') || normalized.includes('/content/docs/lorelog/')) {
      collections.lorelog.push(f);
    } else if (normalized.includes('/src/content/docs/mascots/') || normalized.includes('/content/docs/mascots/')) {
      collections.mascots.push(f);
    } else if (normalized.includes('/src/content/limericks/') || normalized.includes('/content/limericks/')) {
      collections.limericks.push(f);
    } else if (normalized.includes('/src/content/haikus/') || normalized.includes('/content/haikus/')) {
      collections.haikus.push(f);
    } else if (normalized.includes('/src/content/aphorisms/') || normalized.includes('/content/aphorisms/')) {
      collections.aphorisms.push(f);
    } else if (normalized.includes('/src/content/docs/reference/') || normalized.includes('/content/docs/reference/')) {
      collections.reference.push(f);
    }
  }

  const buildBlock = MODE === 'story' ? buildBlock_story : buildBlock_classify;

  const suiteNames = {
    lorelog: 'Lorelog Tome',
    mascots: 'Mascot Tome',
    limericks: 'Limerick Tome',
    haikus: 'Haiku Tome',
    aphorisms: 'Aphorism Tome',
    reference: 'Reference/Doctrine Tome'
  };

  for (const [collection, filePaths] of Object.entries(collections)) {
    const title = suiteNames[collection];
    const baseFilename = MODE === 'story' ? `lore-tome-${collection}` : `lore-tome-${collection}-classify`;
    writeSegmented(title, filePaths, baseFilename, collection, buildBlock);
  }

  console.log('\n"Filed accordingly." Diagnostic pass complete.');
}

main();