import fs from 'node:fs';
import path from 'node:path';

// ── Configuration ─────────────────────────────────────────────
const MAX_BYTES = Number(process.env.ASTRO_BOOK_MAX_BYTES) || 102400;
const PREVIEW_LINES = Number(process.env.ASTRO_BOOK_PREVIEW_LINES) || 160;
const EXPORT_DIR = path.resolve('./exports');
const CLUSTER_DIR = path.join(EXPORT_DIR, 'clusters');

// ── Types ─────────────────────────────────────────────────────
interface FileEntry {
  path: string;
  type: string;
  slug: string;
  bytes: number;
  tags: string[];
  relationships: string[];
}

// ── Utility Functions ─────────────────────────────────────────
function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  fs.mkdirSync(CLUSTER_DIR, { recursive: true });
}

function getFiles(dir: string): string[] {
  const results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (['node_modules', 'public', 'dist', '.git', '.astro', '.cache', 'exports'].includes(file)) continue;
      results.push(...getFiles(filePath));
    } else {
      if (/\.(ts|tsx|js|jsx|mjs|cjs|astro|md|mdx|html|htm|json|css|scss|sass|less|yaml|yml|toml|sh|env)$/.test(file)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

function classifyType(relPath: string): string {
  if (relPath.includes('content/docs/mascots/')) return 'mascot';
  if (relPath.includes('content/docs/lorelog/')) return 'lorelog';
  if (relPath.includes('content/docs/limericks/')) return 'limerick';
  if (relPath.includes('content/docs/haikus/')) return 'haiku';
  if (relPath.includes('content/docs/posts/')) return 'post';
  if (relPath.includes('content/docs/changelog/')) return 'changelog';
  if (relPath.includes('content/docs/releases/')) return 'release';
  if (relPath.startsWith('src/content/')) return 'content';
  if (relPath.startsWith('src/layouts/')) return 'layout';
  if (relPath.startsWith('src/components/')) return 'component';
  if (relPath.startsWith('src/styles/')) return 'style';
  if (relPath.startsWith('src/pages/')) return 'route';
  if (relPath.startsWith('src/lib/')) return 'lib';
  if (/(tsconfig.*|package.json|\.config\.)/.test(relPath)) return 'config';
  return 'other';
}

// Lightweight dependency-free frontmatter parser
function parseFrontmatter(content: string): { tags: string[]; relationships: string[] } {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(fmRegex);
  if (!match) return { tags: [], relationships: [] };

  const fmText = match[1];
  const tags: string[] = [];
  const relationships: string[] = [];

  // Parse tags: [tag1, tag2]
  const tagsMatch = fmText.match(/^tags\s*:\s*\[([^\]]*)\]/m);
  if (tagsMatch) {
    tagsMatch[1].split(',').forEach(t => {
      const trimmed = t.trim().replace(/^["']|["']$/g, '');
      if (trimmed) tags.push(trimmed);
    });
  }

  // Parse relationships from fields like mascotRef, relatedEntries, relatedLorelog
  const relFields = ['mascotRef', 'relatedMascots', 'relatedEntries', 'relatedLorelog', 'related'];
  for (const field of relFields) {
    const arrayMatch = fmText.match(new RegExp(`^${field}\\s*:\\s*\\[([^\\]]*)\\]`, 'm'));
    if (arrayMatch) {
      arrayMatch[1].split(',').forEach(r => {
        // Handle nested Astro reference syntax like { collection: 'x', id: 'y' }
        const idMatch = r.match(/id\s*:\s*["']([^"']+)["']/);
        const trimmed = idMatch ? idMatch[1] : r.trim().replace(/^["']|["']$/g, '');
        if (trimmed && trimmed !== '{' && trimmed !== '}') relationships.push(trimmed);
      });
    }
    // Scalar fallback
    const scalarMatch = fmText.match(new RegExp(`^${field}\\s*:\\s*(?!\\s*\\[)(.+)$`, 'm'));
    if (scalarMatch) {
      const val = scalarMatch[1].trim().replace(/^["']|["']$/g, '');
      if (val) relationships.push(val);
    }
  }

  return { tags, relationships: Array.from(new Set(relationships)) };
}

// ── Pipeline Stages ───────────────────────────────────────────

// STAGE 1: Build the lightweight index (index.json)
function stageIndex(files: string[]): FileEntry[] {
  console.log('▶ STAGE 1 — Building Index...');
  const entries: FileEntry[] = [];

  for (const filePath of files) {
    const relPath = path.relative(process.cwd(), filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const bytes = fs.statSync(filePath).size;
    const slug = path.basename(filePath, path.extname(filePath));
    const { tags, relationships } = parseFrontmatter(content);

    entries.push({
      path: relPath,
      type: classifyType(relPath),
      slug,
      bytes,
      tags,
      relationships
    });
  }

  fs.writeFileSync(path.join(EXPORT_DIR, 'index.json'), JSON.stringify(entries, null, 2));
  console.log(`✓ Index complete. ${entries.length} entries written to exports/index.json`);
  return entries;
}

// STAGE 2: Build a targeted cluster by ID
function stageCluster(entries: FileEntry[], targetSlug: string) {
  console.log(`▶ STAGE 2 — Building Cluster for ${targetSlug}...`);
  const root = entries.find(e => e.type === 'lorelog' && e.slug === targetSlug);
  if (!root) {
    console.warn(`⚠ Lorelog entry with slug "${targetSlug}" not found in index.`);
    return;
  }

  const clusterFiles = [root];
  for (const relSlug of root.relationships) {
    const linked = entries.find(e => (e.type === 'mascot' || e.type === 'limerick' || e.type === 'poetry') && e.slug === relSlug);
    if (linked) clusterFiles.push(linked);
  }

  let output = `# Cluster: ${targetSlug}\n\n`;
  output += `Generated: ${new Date().toISOString()}\n\n`;
  output += `---\n\n`;

  for (const file of clusterFiles) {
    const fullPath = path.resolve(file.path);
    if (!fs.existsSync(fullPath)) continue;

    output += `### ${file.type}: ${file.slug} (${file.path})\n\n`;
    output += `<!-- START FILE: ${file.path} -->\n`;
    const body = fs.readFileSync(fullPath, 'utf-8');
    output += `\`\`\`${path.extname(file.path).slice(1)}\n${body}\n\`\`\`\n`;
    output += `<!-- STOP FILE: ${file.path} -->\n\n`;
  }

  fs.writeFileSync(path.join(CLUSTER_DIR, `${targetSlug}.md`), output);
  console.log(`✓ Cluster written to exports/clusters/${targetSlug}.md`);
}

// STAGE 3: Build Mega-Bundle (XML format with CDATA)
function stageMega(entries: FileEntry[]) {
  console.log('▶ STAGE 3 — Generating Mega Bundle...');
  let output = `<!-- FILED & FORGOTTEN MEGA BUNDLE -->\n`;
  output += `<!-- Generated: ${new Date().toISOString()} -->\n\n`;

  // 1. Upfront Manifest (Mental Map for LLM)
  output += `<repository_manifest>\n`;
  for (const e of entries) {
    output += `  <item path="${e.path}" type="${e.type}" bytes="${e.bytes}" />\n`;
  }
  output += `</repository_manifest>\n\n`;

  // 2. Upfront Seams Registry (Hard Links Map)
  output += `<seams_registry>\n`;
  for (const e of entries) {
    if (e.relationships.length > 0) {
      output += `  <seam source="${e.path}">\n`;
      for (const rel of e.relationships) {
        output += `    <link target="${rel}" />\n`;
      }
      output += `  </seam>\n`;
    }
  }
  output += `</seams_registry>\n\n`;

  // 3. File Corpus with CDATA protection
  output += `<repository_files>\n`;
  for (const e of entries) {
    const fullPath = path.resolve(e.path);
    if (!fs.existsSync(fullPath)) continue;

    output += `  <file path="${e.path}" type="${e.type}">\n`;
    const content = fs.readFileSync(fullPath, 'utf-8');

    if (e.bytes > MAX_BYTES) {
      const lines = content.split('\n').slice(0, PREVIEW_LINES).join('\n');
      output += `    <!-- TRUNCATED: Exceeds MAX_BYTES. Showing first ${PREVIEW_LINES} lines -->\n`;
      output += `    <![CDATA[\n${lines}\n    ]]>\n`;
    } else {
      output += `    <![CDATA[\n${content}\n    ]]>\n`;
    }
    output += `  </file>\n\n`;
  }
  output += `</repository_files>\n`;

  fs.writeFileSync(path.join(EXPORT_DIR, 'mega-bundle.md'), output);
  console.log('✓ Mega bundle generated at exports/mega-bundle.md');
}

// ── Orchestration ─────────────────────────────────────────────
function main() {
  ensureDirs();
  const files = getFiles(process.cwd());
  const entries = stageIndex(files);

  const mode = process.argv.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'all';
  const target = process.argv.find(arg => arg.startsWith('--target='))?.split('=')[1];

  if (mode === 'index' || mode === 'all') {
    // Stage 1 already run as part of setup
  }
  if ((mode === 'cluster' || mode === 'all') && target) {
    stageCluster(entries, target);
  }
  if (mode === 'mega' || mode === 'all') {
    stageMega(entries);
  }

  console.log('\n"Everything gets exported, nothing is alive." Pipeline finished.');
}

main();
