import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POETRY_DIRS = [
  { dir: './src/content/haikus', prefix: 'HAI' },
  { dir: './src/content/limericks', prefix: 'LIM' },
  { dir: './src/content/aphorisms', prefix: 'APH' }
];

function collectFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else if (/\.(md|mdx)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function findTopLevelKeyRange(fmLines, key) {
  const keyRe = new RegExp(`^${key}:(\\s|$)`);
  let start = -1;
  for (let i = 0; i < fmLines.length; i++) {
    if (keyRe.test(fmLines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) return null;
  let end = start + 1;
  while (end < fmLines.length) {
    const line = fmLines[end];
    if (line.length > 0 && !/^\s/.test(line) && !line.startsWith('#')) break;
    end += 1;
  }
  return { start, end };
}

function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return null;
  const afterOpen = raw.indexOf('\n');
  if (afterOpen === -1) return null;
  const closeIdx = raw.indexOf('\n---', afterOpen + 1);
  if (closeIdx === -1) return null;
  const fmRaw = raw.slice(afterOpen + 1, closeIdx);
  const body = raw.slice(closeIdx + 4);
  return { fmRaw, body };
}

const RUN = process.argv.includes('--run');

console.log(RUN ? '=== LIVE RUN ===' : '=== DRY RUN (pass --run to write changes) ===');

let count = 0;

for (const { dir, prefix } of POETRY_DIRS) {
  const files = collectFiles(path.resolve(dir));
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = matter(raw);
    const data = parsed.data || {};
    
    // Check if caseNumber is missing or empty
    if (!data.caseNumber) {
      // Find parentEntry
      const pe = data.parentEntry;
      if (pe && pe !== 'null') {
        const peStr = Array.isArray(pe) ? pe[0] : pe;
        if (peStr) {
          const caseNum = `${prefix}-${String(peStr).toUpperCase()}`;
          count++;
          console.log(`[${count}] File: ${path.relative(process.cwd(), file)}`);
          console.log(`    parentEntry: ${pe}`);
          console.log(`    caseNumber → ${caseNum}`);
          
          if (RUN) {
            const split = splitFrontmatter(raw);
            if (split) {
              const fmLines = split.fmRaw.split('\n');
              let inserted = false;
              
              // Check if key already exists (maybe commented or empty)
              const existingRange = findTopLevelKeyRange(fmLines, 'caseNumber');
              if (existingRange) {
                fmLines[existingRange.start] = `caseNumber: ${caseNum}`;
                inserted = true;
              } else {
                // Insert after title or slug
                const insertAfter = ['slug', 'title'];
                for (const key of insertAfter) {
                  const range = findTopLevelKeyRange(fmLines, key);
                  if (range) {
                    fmLines.splice(range.end, 0, `caseNumber: ${caseNum}`);
                    inserted = true;
                    break;
                  }
                }
              }
              if (!inserted) {
                fmLines.unshift(`caseNumber: ${caseNum}`);
              }
              
              // Bump updatedAt to 2026-07-10
              const updatedRange = findTopLevelKeyRange(fmLines, 'updatedAt');
              if (updatedRange) {
                fmLines[updatedRange.start] = `updatedAt: 2026-07-10`;
              } else {
                fmLines.push(`updatedAt: 2026-07-10`);
              }
              
              const next = `---\n${fmLines.join('\n')}\n---${split.body.startsWith('\n') ? '' : '\n'}${split.body}`;
              fs.writeFileSync(file, next, 'utf8');
              console.log(`    Updated!`);
            }
          }
        }
      }
    }
  }
}

console.log(`\nProcessed ${count} files.`);
