import fs from 'node:fs';
import matter from 'gray-matter';

/**
 * Shared utility to read a markdown/mdx file and parse its frontmatter.
 * 
 * @param {string} filePath - Absolute or relative path to the file.
 * @returns {{ frontmatter: Record<string, any>, body: string }} Parsed data.
 */
export default function parseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  return {
    frontmatter: parsed.data || {},
    body: parsed.content || ''
  };
}
