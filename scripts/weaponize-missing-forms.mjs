// scripts/weaponize-missing-forms.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DEFAULT_EXCLUDES = [
  'node_modules', 'public', 'dist', '.git', '.astro',
  '.cache', 'exports', '.rag', 'reference/empathegy', '.turbo', '.vercel'
];

function getFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
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

function getCollectionType(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/src/content/docs/lorelog/') || normalized.includes('/content/docs/lorelog/')) return 'lorelog';
  if (normalized.includes('/src/content/docs/mascots/') || normalized.includes('/content/docs/mascots/')) return 'mascots';
  if (normalized.includes('/src/content/limericks/') || normalized.includes('/content/limericks/')) return 'limericks';
  if (normalized.includes('/src/content/haikus/') || normalized.includes('/content/haikus/')) return 'haikus';
  if (normalized.includes('/src/content/aphorisms/') || normalized.includes('/content/aphorisms/')) return 'aphorisms';
  if (normalized.includes('/src/content/docs/reference/') || normalized.includes('/content/docs/reference/')) return 'reference';
  if (normalized.includes('/src/content/docs/posts/') || normalized.includes('/content/docs/posts/')) return 'posts';
  if (normalized.includes('/src/content/docs/releases/') || normalized.includes('/content/docs/releases/')) return 'releases';
  if (normalized.includes('/src/content/docs/changelog/') || normalized.includes('/content/docs/changelog/')) return 'changelog';
  if (normalized.includes('/src/content/docs/guides/') || normalized.includes('/content/docs/guides/')) return 'guides';
  return 'other';
}

function injectFields(fileContent, fieldsToAdd) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return fileContent;

  let frontmatterText = match[1];
  const bodyText = fileContent.slice(match[0].length);

  for (const [key, value] of Object.entries(fieldsToAdd)) {
    const re = new RegExp(`^${key}:.*$`, 'mi');
    if (re.test(frontmatterText)) {
      frontmatterText = frontmatterText.replace(re, `${key}: ${value}`);
    } else {
      frontmatterText = frontmatterText.trim() + `\n${key}: ${value}\n`;
    }
  }

  return `---\n${frontmatterText.trim()}\n---\n${bodyText}`;
}

function main() {
  console.log('▶ Initiating missing form/case number injection...');

  const contentDir = path.resolve('./src/content');
  const allFiles = getFiles(contentDir);
  let updatedCount = 0;

  for (const file of allFiles) {
    const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
    const collection = getCollectionType(file);

    // Skip mascots because they don't use caseNumber case-by-case
    if (collection === 'mascots') continue;

    let content = '';
    try {
      content = fs.readFileSync(file, 'utf-8');
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
      continue;
    }

    let parsed;
    try {
      parsed = matter(content);
    } catch (err) {
      console.error(`Error parsing frontmatter for ${file}:`, err);
      continue;
    }

    const frontmatter = parsed.data || {};

    // Only process if caseNumber is missing
    if (!frontmatter.caseNumber) {
      const basename = path.basename(file, path.extname(file));
      
      // Match case number codes (e.g. LLG-0020, OCV-INTAKE, etc.)
      const codeMatch = basename.match(/(?:hai|lim|aph)?-?(llg|ocv|ffp|fref|rel|mascot)-([a-z0-9xX]+(?:-[a-z0-9xX]+)*)/i);
      if (codeMatch) {
        const extractedCode = (codeMatch[1] + '-' + codeMatch[2]).toUpperCase();
        
        const fieldsToAdd = {
          caseNumber: extractedCode
        };

        if (['haikus', 'limericks', 'aphorisms'].includes(collection)) {
          fieldsToAdd.relatedLorelog = `"${extractedCode}"`;
        }

        const updatedContent = injectFields(content, fieldsToAdd);
        
        try {
          fs.writeFileSync(file, updatedContent, 'utf-8');
          console.log(`✓ Updated ${relPath} -> caseNumber: ${extractedCode}`);
          updatedCount++;
        } catch (err) {
          console.error(`Error writing updates to ${file}:`, err);
        }
      }
    }
  }

  console.log(`\n============================================================`);
  console.log(`Injection complete: ${updatedCount} files updated.`);
  console.log(`============================================================\n`);
}

main();
