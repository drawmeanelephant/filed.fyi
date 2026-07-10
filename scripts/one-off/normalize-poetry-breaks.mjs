// scripts/normalize-poetry-breaks.mjs
import fs from 'fs';
import path from 'path';

const rootDir = path.join(process.cwd(), 'src/content');
const targetDirs = ['limericks', 'haikus'];

let modifiedFiles = 0;

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let inLimerick = false;
  let changed = false;

  const newLines = lines.map(line => {
    if (line.trim().startsWith('<Limerick')) {
      inLimerick = true;
      return line;
    }
    if (line.trim().startsWith('</Limerick>')) {
      inLimerick = false;
      return line;
    }

    if (inLimerick && line.trim() !== '') {
      // Remove existing trailing whitespace.
      const trimmed = line.trimEnd();
      // Add exactly two spaces.
      const newLine = trimmed + '  ';
      if (line !== newLine) {
        changed = true;
      }
      return newLine;
    }
    
    return line;
  });

  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    modifiedFiles++;
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDirectory(fullPath);
    } else if (fullPath.endsWith('.mdx') || fullPath.endsWith('.md')) {
      processFile(fullPath);
    }
  }
}

for (const dir of targetDirs) {
  const targetPath = path.join(rootDir, dir);
  if (fs.existsSync(targetPath)) {
    traverseDirectory(targetPath);
  }
}

console.log(`Successfully normalized line breaks in ${modifiedFiles} files.`);
