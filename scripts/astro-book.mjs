// scripts/astro-book.mjs
import fs from 'node:fs';
import path from 'node:path';

// ── Configuration ─────────────────────────────────────────────
const EXPORT_DIR = path.resolve('./exports');

// Target chunk size for splitting (approx 500KB - safe for LLM context segments)
const CHUNK_SIZE_LIMIT = 500 * 1024; 

// Rigid exclusions to keep the context clean
const DEFAULT_EXCLUDES = [
  'node_modules', 'public', 'dist', '.git', '.astro', 
  '.cache', 'exports', '.rag', 'reference/empathegy', '.turbo', '.vercel'
];

// ── Helper Functions ──────────────────────────────────────────
function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

function getFiles(dir, isRoot = false) {
  const results = [];
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (DEFAULT_EXCLUDES.includes(file)) continue;
      // Recurse cleanly through valid directories
      results.push(...getFiles(filePath, false));
    } else {
      // Catch all code, config, and markdown extensions
      if (/\.(ts|tsx|js|jsx|mjs|cjs|astro|md|mdx|html|htm|json|css|scss|sass|yaml|yml|toml|sh|env)$/.test(file) || 
          ['package.json', 'tsconfig.json', 'package-lock.json', 'README.md', 'rules.md', 'GEMINI.md'].includes(file)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

function fence_lang(f) {
  switch (path.extname(f)) {
    case '.ts': case '.tsx': return 'typescript';
    case '.js': case '.jsx': case '.mjs': case '.cjs': return 'javascript';
    case '.astro': return 'astro';
    case '.md': case '.mdx': return 'markdown';
    case '.json': return 'json';
    case '.css': return 'css';
    case '.yaml': case '.yml': return 'yaml';
    case '.toml': return 'toml';
    case '.sh': return 'bash';
    default: return '';
  }
}

function writeSegmentedFiles(title, filePaths, baseFilename) {
  const activePaths = filePaths.filter(f => {
    const rel = path.relative(process.cwd(), f);
    // Split into segments to ensure we only exclude matching folder/file names,
    // preventing file extensions like '.astro' from killing your page routes.
    const segments = rel.split(path.sep);
    return !DEFAULT_EXCLUDES.some(ex => segments.includes(ex));
  });

  if (activePaths.length === 0) return;

  let part = 1;
  let currentBytes = 0;
  let buffer = '';

  const flushBuffer = (p) => {
    if (!buffer) return;
    const outPath = path.join(EXPORT_DIR, `${baseFilename}${p > 1 || currentBytes > CHUNK_SIZE_LIMIT ? `-part${p}` : ''}.md`);
    const header = `--- \n` +
                   `title: "${title}${p > 1 ? ` (Part ${p})` : ''}"\n` +
                   `description: "Consolidated export of ${title}."\n` +
                   `date: ${new Date().toISOString().split('T')[0]}\n` +
                   `---\n\n`;
    fs.writeFileSync(outPath, header + buffer);
    console.log(`✓ Created exports/${path.basename(outPath)} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
    buffer = '';
    currentBytes = 0;
  };

  for (const filePath of activePaths) {
    const relPath = path.relative(process.cwd(), filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const bytes = fs.statSync(filePath).size;
    const lang = fence_lang(filePath);

    const block = `## ${path.basename(filePath)}\n\n` +
                  `_path: ${relPath}\n\n` +
                  `\n` +
                  `path: ${relPath}\n` +
                  `bytes: ${bytes}\n` +
                  `\`\`\`${lang}\n` +
                  `${content}\n` +
                  `\`\`\`\n` +
                  `\n\n`;

    const blockSize = Buffer.byteLength(block, 'utf8');

    if (currentBytes > 0 && currentBytes + blockSize > CHUNK_SIZE_LIMIT) {
      flushBuffer(part);
      part++;
    }

    buffer += block;
    currentBytes += blockSize;
  }

  if (buffer) {
    const outPath = path.join(EXPORT_DIR, `${baseFilename}${part > 1 ? `-part${part}` : ''}.md`);
    const header = `--- \n` +
                   `title: "${title}${part > 1 ? ` (Part ${part})` : ''}"\n` +
                   `description: "Consolidated export of ${title}."\n` +
                   `date: ${new Date().toISOString().split('T')[0]}\n` +
                   `---\n\n`;
    fs.writeFileSync(outPath, header + buffer);
    console.log(`✓ Created exports/${path.basename(outPath)} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
  }
}

// ── Orchestration ─────────────────────────────────────────────
function main() {
  ensureDirs();
  console.log('▶ Initiating Condensation Archival Pipeline...');
  
  const allFiles = getFiles(process.cwd(), true);

  // 1. Core Content Bucket (Documentation minus poetry and magic)
  const coreContent = allFiles.filter(f => 
    (f.includes('content/docs/') || f.includes('src/content/docs/')) && 
    !/(limericks|aphorisms|haikus)/.test(f) &&
    !/(magic)/i.test(f) // CRITICAL: Stop magic from polluting the core book
  );

  // 2. Poetry Bucket
  const poetryContent = allFiles.filter(f => 
    /(limericks|aphorisms|haikus)/.test(f) && !/(magic)/i.test(f)
  );

  // 3. NEW: Dedicated Magic Bucket (Isolating the 150KB domain and scripts)
  const magicContent = allFiles.filter(f => 
    f.includes(`${path.sep}scripts${path.sep}`) || /(magic)/i.test(f)
  );

  // 4. Bones Bucket (App infrastructure)
  const bonesContent = allFiles.filter(f => 
    (f.includes('src/components/') || f.includes('src/layouts/') || f.includes('src/styles/') || f.includes('src/pages/') || f.includes('src/lib/')) &&
    !/(magic)/i.test(f)
  );

  // 5. Blueprint Bucket (Configs, Root Rules)
  const blueprintContent = allFiles.filter(f => {
    const base = path.basename(f);
    const isRootConfig = /(tsconfig.*|package.*|astro.config.*|content.config.ts|\.config\.)/.test(base) && !f.includes('node_modules');
    const isRootDoc = ['README.md', 'rules.md', 'GEMINI.md'].includes(base);
    return (isRootConfig || isRootDoc) && !/(magic)/i.test(f);
  });

  // 2. Export consolidated books (including the new standalone target)
  writeSegmentedFiles("Project Core Book", coreContent, "book-core");
  writeSegmentedFiles("Project Poetry Book", poetryContent, "book-poetry");
  writeSegmentedFiles("Project Architecture Bones", bonesContent, "book-bones");
  writeSegmentedFiles("Project Blueprint & Configs", blueprintContent, "book-blueprint");
  writeSegmentedFiles("Project Magic Codex", magicContent, "book-magic"); // Separate volume compiled!

  console.log('\n"Everything condensed, neatly packed." Pipeline complete.');
}

main();