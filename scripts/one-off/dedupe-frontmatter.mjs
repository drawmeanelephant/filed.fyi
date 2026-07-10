import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const docsDir = path.join(process.cwd(), 'src/content/docs');

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function run() {
  const allFiles = await getFiles(docsDir);
  const mdFiles = allFiles.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  
  let modifiedCount = 0;

  for (const filePath of mdFiles) {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const parsed = matter(fileContent);
    let modified = false;

    // Deduplicate array fields in frontmatter
    for (const [key, value] of Object.entries(parsed.data)) {
      if (Array.isArray(value)) {
        if (value.length === 0) continue;

        // Check if it's an array of objects (like relatedEntries)
        if (typeof value[0] === 'object' && value[0] !== null) {
          const uniqueEntries = new Map();
          for (const entry of value) {
            // Create a unique key for the object
            // specifically handling relatedEntries which has collection and id
            const objKey = Object.entries(entry).sort().map(([k, v]) => `${k}:${v}`).join('|');
            if (!uniqueEntries.has(objKey)) {
              uniqueEntries.set(objKey, entry);
            }
          }
          if (uniqueEntries.size !== value.length) {
            parsed.data[key] = Array.from(uniqueEntries.values());
            modified = true;
          }
        } else {
          // It's an array of primitives (strings, numbers, etc.)
          const uniqueSet = new Set(value);
          if (uniqueSet.size !== value.length) {
            parsed.data[key] = [...uniqueSet];
            modified = true;
          }
        }
      }
    }

    if (modified) {
      const newContent = matter.stringify(parsed.content, parsed.data);
      await fs.writeFile(filePath, newContent, 'utf8');
      modifiedCount++;
      console.log(`Deduplicated frontmatter in: ${path.relative(process.cwd(), filePath)}`);
    }
  }
  
  console.log(`\nFinished! Modified ${modifiedCount} files.`);
}

run().catch(console.error);
