// scripts/astro-diagnostic.mjs
import fs from 'node:fs';
import path from 'node:path';

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

// Splits raw file text into { frontmatter, body }
function splitFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: '', body: raw };
  return { frontmatter: match[1], body: raw.slice(match[0].length) };
}

function parseField(frontmatter, key) {
  const re = new RegExp(`^${key}:\\s*["']?(.*?)["']?\\s*$`, 'm');
  const m = frontmatter.match(re);
  return m ? m[1] : '';
}

function firstNonEmptyLine(body) {
  const lines = body.split('\n');
  for (const line of lines) {
    if (line.trim().length > 0) return line.trim();
  }
  return '';
}

function buildBlock_story(filePath, relPath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const firstLine = firstNonEmptyLine(body);
  return `## ${path.basename(filePath)}\n\n` +
    `path: ${relPath}\n\n` +
    `\`\`\`yaml\n${frontmatter}\n\`\`\`\n\n` +
    `First line: ${firstLine}\n\n\n`;
}

function buildBlock_classify(filePath, relPath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter } = splitFrontmatter(raw);
  const title = parseField(frontmatter, 'title');
  const casenum = parseField(frontmatter, 'casenum');
  return `- ${title || '(no title)'} | casenum: ${casenum || 'n/a'} | path: ${relPath}\n`;
}

function writeSegmented(title, filePaths, baseFilename, buildBlock) {
  const activePaths = filePaths.filter(f => {
    const rel = path.relative(process.cwd(), f);
    const segments = rel.split(path.sep);
    return !DEFAULT_EXCLUDES.some(ex => segments.includes(ex));
  });
  if (activePaths.length === 0) return;

  let part = 1, currentBytes = 0, buffer = '';

  const flush = (p) => {
    if (!buffer) return;
    const outPath = path.join(EXPORT_DIR, `${baseFilename}${p > 1 ? `-part${p}` : ''}.md`);
    const header = `---\ntitle: "${title}${p > 1 ? ` (Part ${p})` : ''}"\nmode: ${MODE}\ndate: ${new Date().toISOString().split('T')[0]}\n---\n\n`;
    fs.writeFileSync(outPath, header + buffer);
    console.log(`✓ Created exports/${path.basename(outPath)} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
    buffer = ''; currentBytes = 0;
  };

  for (const filePath of activePaths) {
    const relPath = path.relative(process.cwd(), filePath);
    const block = buildBlock(filePath, relPath);
    const blockSize = Buffer.byteLength(block, 'utf8');
    if (currentBytes > 0 && currentBytes + blockSize > CHUNK_SIZE_LIMIT) {
      flush(part);
      part++;
    }
    buffer += block;
    currentBytes += blockSize;
  }
  flush(part);
}

function main() {
  ensureDirs();
  console.log(`▶ Running diagnostic pipeline in "${MODE}" mode...`);

  const allDocs = getFiles(process.cwd()).filter(f =>
    (f.includes('content/docs/') || f.includes('src/content/docs/'))
  );

  const coreContent = allDocs.filter(f => !/(limericks|aphorisms|haikus)/.test(f));
  const poetryContent = allDocs.filter(f => /(limericks|aphorisms|haikus)/.test(f));

  if (MODE === 'story') {
    writeSegmented('Storytelling Diagnostic — Core', coreContent, 'diag-story-core', buildBlock_story);
    writeSegmented('Storytelling Diagnostic — Poetry', poetryContent, 'diag-story-poetry', buildBlock_story);
  } else if (MODE === 'classify') {
    writeSegmented('Classification Diagnostic — Core', coreContent, 'diag-classify-core', buildBlock_classify);
    writeSegmented('Classification Diagnostic — Poetry', poetryContent, 'diag-classify-poetry', buildBlock_classify);
  } else {
    console.error(`Unknown mode: ${MODE}. Use --mode=story or --mode=classify.`);
    process.exit(1);
  }

  console.log('\n"Filed accordingly." Diagnostic pass complete.');
}

main();