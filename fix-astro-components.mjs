import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let modifiedFiles = [];

walkDir('src/pages', (filePath) => {
  if (!filePath.endsWith('.astro')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix excludeindex -> exclude="index"
  content = content.replace(/\bexcludeindex\b/g, 'exclude="index"');

  // Fix filterPrefix="SOMETHING" to filterPrefix="something"
  content = content.replace(/filterPrefix="([^"]+)"/g, (match, prefix) => {
    return `filterPrefix="${prefix.toLowerCase()}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedFiles.push(filePath);
  }
});

console.log("Modified files:\\n" + modifiedFiles.join("\\n"));
