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

function writeSegmentedFiles(title, filePaths, baseFilename, disableSegmentation = false) {
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

  const getLimit = (p) => {
    if (disableSegmentation) return Infinity;
    return p === 1 ? 100 * 1024 : 500 * 1024;
  };

  const flushBuffer = (p) => {
    if (!buffer) return;
    const limit = disableSegmentation ? Infinity : 500 * 1024;
    const outPath = path.join(EXPORT_DIR, `${baseFilename}${p > 1 || currentBytes > limit ? `-part${p}` : ''}.md`);
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

    if (currentBytes > 0 && currentBytes + blockSize > getLimit(part)) {
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

  // 2. Poetry Buckets (Split into Aphorisms, Limericks, and Haikus)
  const aphorismsContent = allFiles.filter(f => 
    /aphorisms/.test(f) && !/(magic)/i.test(f)
  );
  const limericksContent = allFiles.filter(f => 
    /limericks/.test(f) && !/(magic)/i.test(f)
  );
  const haikusContent = allFiles.filter(f => 
    /haikus/.test(f) && !/(magic)/i.test(f)
  );

  // 3. NEW: Dedicated Magic Bucket (Isolating the 150KB domain and scripts)
  const magicContent = allFiles.filter(f => 
    f.includes(`${path.sep}scripts${path.sep}`) || /(magic)/i.test(f)
  );

  // 4. Bones Bucket (App infrastructure - ensuring no scripts)
  const bonesContent = allFiles.filter(f => 
    (f.includes('src/components/') || f.includes('src/layouts/') || f.includes('src/styles/') || f.includes('src/pages/') || f.includes('src/lib/')) &&
    !/(magic)/i.test(f) &&
    !f.includes(`${path.sep}scripts${path.sep}`)
  );

  // 5. Blueprint Bucket (Configs, Root Rules - restricted to root directory only to prevent matching scripts)
  const blueprintContent = allFiles.filter(f => {
    const base = path.basename(f);
    const dir = path.dirname(f);
    const isRoot = (dir === process.cwd());
    const isRootConfig = /(tsconfig.*|package.*|astro.config.*|content.config.ts|\.config\.)/.test(base) && !f.includes('node_modules');
    const isRootDoc = ['README.md', 'rules.md', 'GEMINI.md'].includes(base);
    return isRoot && (isRootConfig || isRootDoc) && !/(magic)/i.test(f);
  });

  // 2. Export consolidated books (including the new standalone targets)
  writeSegmentedFiles("Project Core Book", coreContent, "book-core");
  writeSegmentedFiles("Project Aphorisms Book", aphorismsContent, "book-poetry-aphorisms");
  writeSegmentedFiles("Project Limericks Book", limericksContent, "book-poetry-limericks");
  writeSegmentedFiles("Project Haikus Book", haikusContent, "book-poetry-haikus");
  writeSegmentedFiles("Project Architecture Bones", bonesContent, "book-bones", true);
  writeSegmentedFiles("Project Blueprint & Configs", blueprintContent, "book-blueprint", true);
  writeSegmentedFiles("Project Magic Codex", magicContent, "book-magic"); // Separate volume compiled!

  // 3. Generate directory tree report
  writeDirectoryTreeReport();

  console.log('\n"Everything condensed, neatly packed." Pipeline complete.');
}

function generateDirectoryTree(dir, prefix = '') {
  let tree = '';
  let list;
  try {
    list = fs.readdirSync(dir);
  } catch (err) {
    return '';
  }
  
  // Filter out excludes
  const activeList = list.filter(file => !DEFAULT_EXCLUDES.includes(file));
  
  // Sort directories first, then files
  activeList.sort((a, b) => {
    let aIsDir = false;
    let bIsDir = false;
    try {
      aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
    } catch (_) {}
    try {
      bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
    } catch (_) {}
    
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.localeCompare(b);
  });

  for (let i = 0; i < activeList.length; i++) {
    const file = activeList[i];
    const filePath = path.join(dir, file);
    let isDir = false;
    try {
      isDir = fs.statSync(filePath).isDirectory();
    } catch (_) {}
    
    const isLast = (i === activeList.length - 1);
    const marker = isLast ? '└── ' : '├── ';
    
    if (isDir) {
      tree += `${prefix}${marker}${file}/\n`;
      tree += generateDirectoryTree(filePath, `${prefix}${isLast ? '    ' : '│   '}`);
    } else {
      tree += `${prefix}${marker}${file}\n`;
    }
  }
  return tree;
}

function writeDirectoryTreeReport() {
  console.log('▶ Generating Directory Tree Report...');
  const treeContent = generateDirectoryTree(process.cwd());
  const outPath = path.join(EXPORT_DIR, 'project-tree.md');
  const header = `--- \n` +
                 `title: "Project Directory Tree"\n` +
                 `description: "Visual directory tree representation of the active workspace."\n` +
                 `date: ${new Date().toISOString().split('T')[0]}\n` +
                 `---\n\n` +
                 `# Directory Tree\n\n` +
                 `\`\`\`\n` +
                 `. (filed.fyi project root)\n` +
                 treeContent +
                 `\`\`\`\n`;
  fs.writeFileSync(outPath, header);
  console.log(`✓ Created exports/${path.basename(outPath)} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

main();