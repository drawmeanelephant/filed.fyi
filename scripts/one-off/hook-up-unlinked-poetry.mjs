import fs from 'node:fs';
import path from 'node:path';

const PARENTS = [
  { file: 'src/content/docs/lorelog/SRB-SESSION-NOTES.mdx', caseNumber: 'LLG-SRB-SESSION-NOTES' },
  { file: 'src/content/docs/lorelog/TSA-SESSION-SCHEDULE.mdx', caseNumber: 'LLG-TSA-SESSION-SCHEDULE' },
  { file: 'src/content/docs/guides/gratitude-drift.mdx', caseNumber: 'GUIDE-GRATITUDE-DRIFT' },
  { file: 'src/content/docs/guides/managed-absence-and-forms.mdx', caseNumber: 'GUIDE-MANAGED-ABSENCE-AND-FORMS' },
  { file: 'src/content/docs/posts/coma-observation-transcript.md', caseNumber: 'POST-COMA-OBSERVATION-TRANSCRIPT' },
  { file: 'src/content/docs/posts/replacement-without-release.md', caseNumber: 'POST-REPLACEMENT-WITHOUT-RELEASE' },
  { file: 'src/content/docs/posts/trust-records-after-proof-decay.md', caseNumber: 'POST-TRUST-RECORDS-AFTER-PROOF-DECAY' },
  { file: 'src/content/docs/reference/directives/tri-directive-doctrine.mdx', caseNumber: 'FREF-TRI-DIRECTIVE-DOCTRINE' },
  { file: 'src/content/docs/releases/v0.1.0.md', caseNumber: 'REL-v0.1.0-INIT' }
];

const POEMS = [
  { file: 'src/content/limericks/lim-SRB-SESSION-NOTES.mdx', caseNumber: 'LIM-LLG-SRB-SESSION-NOTES', parentEntry: 'LLG-SRB-SESSION-NOTES' },
  { file: 'src/content/aphorisms/APH-SRB-SESSION-NOTES.mdx', caseNumber: 'APH-LLG-SRB-SESSION-NOTES', parentEntry: 'LLG-SRB-SESSION-NOTES' },

  { file: 'src/content/limericks/lim-TSA-SESSION-SCHEDULE.mdx', caseNumber: 'LIM-LLG-TSA-SESSION-SCHEDULE', parentEntry: 'LLG-TSA-SESSION-SCHEDULE' },
  { file: 'src/content/aphorisms/APH-TSA-SESSION-SCHEDULE.mdx', caseNumber: 'APH-LLG-TSA-SESSION-SCHEDULE', parentEntry: 'LLG-TSA-SESSION-SCHEDULE' },

  { file: 'src/content/haikus/hai-gratitude-drift.mdx', caseNumber: 'HAI-GUIDE-GRATITUDE-DRIFT', parentEntry: 'GUIDE-GRATITUDE-DRIFT' },
  { file: 'src/content/limericks/LIM-gratitude-drift.mdx', caseNumber: 'LIM-GUIDE-GRATITUDE-DRIFT', parentEntry: 'GUIDE-GRATITUDE-DRIFT' },
  { file: 'src/content/aphorisms/APH-gratitude-drift.mdx', caseNumber: 'APH-GUIDE-GRATITUDE-DRIFT', parentEntry: 'GUIDE-GRATITUDE-DRIFT' },

  { file: 'src/content/haikus/hai-managed-absence-and-forms.mdx', caseNumber: 'HAI-GUIDE-MANAGED-ABSENCE-AND-FORMS', parentEntry: 'GUIDE-MANAGED-ABSENCE-AND-FORMS' },
  { file: 'src/content/limericks/LIM-managed-absence-and-forms.mdx', caseNumber: 'LIM-GUIDE-MANAGED-ABSENCE-AND-FORMS', parentEntry: 'GUIDE-MANAGED-ABSENCE-AND-FORMS' },
  { file: 'src/content/aphorisms/APH-managed-absence-and-forms.mdx', caseNumber: 'APH-GUIDE-MANAGED-ABSENCE-AND-FORMS', parentEntry: 'GUIDE-MANAGED-ABSENCE-AND-FORMS' },

  { file: 'src/content/haikus/hai-coma-observation-transcript.mdx', caseNumber: 'HAI-POST-COMA-OBSERVATION-TRANSCRIPT', parentEntry: 'POST-COMA-OBSERVATION-TRANSCRIPT' },
  { file: 'src/content/limericks/lim-coma-observation-transcript.mdx', caseNumber: 'LIM-POST-COMA-OBSERVATION-TRANSCRIPT', parentEntry: 'POST-COMA-OBSERVATION-TRANSCRIPT' },
  { file: 'src/content/aphorisms/APH-coma-observation-transcript.mdx', caseNumber: 'APH-POST-COMA-OBSERVATION-TRANSCRIPT', parentEntry: 'POST-COMA-OBSERVATION-TRANSCRIPT' },

  { file: 'src/content/haikus/hai-replacement-without-release.mdx', caseNumber: 'HAI-POST-REPLACEMENT-WITHOUT-RELEASE', parentEntry: 'POST-REPLACEMENT-WITHOUT-RELEASE' },
  { file: 'src/content/limericks/LIM-replacement-without-release.mdx', caseNumber: 'LIM-POST-REPLACEMENT-WITHOUT-RELEASE', parentEntry: 'POST-REPLACEMENT-WITHOUT-RELEASE' },
  { file: 'src/content/aphorisms/APH-replacement-without-release.mdx', caseNumber: 'APH-POST-REPLACEMENT-WITHOUT-RELEASE', parentEntry: 'POST-REPLACEMENT-WITHOUT-RELEASE' },

  { file: 'src/content/haikus/hai-trust-records-after-proof-decay.mdx', caseNumber: 'HAI-POST-TRUST-RECORDS-AFTER-PROOF-DECAY', parentEntry: 'POST-TRUST-RECORDS-AFTER-PROOF-DECAY' },
  { file: 'src/content/limericks/lim-trust-records-after-proof-decay.mdx', caseNumber: 'LIM-POST-TRUST-RECORDS-AFTER-PROOF-DECAY', parentEntry: 'POST-TRUST-RECORDS-AFTER-PROOF-DECAY' },
  { file: 'src/content/aphorisms/aph-trust-records-after-proof-decay.mdx', caseNumber: 'APH-POST-TRUST-RECORDS-AFTER-PROOF-DECAY', parentEntry: 'POST-TRUST-RECORDS-AFTER-PROOF-DECAY' },

  { file: 'src/content/haikus/hai-tri-directive-doctrine.mdx', caseNumber: 'HAI-FREF-TRI-DIRECTIVE-DOCTRINE', parentEntry: 'FREF-TRI-DIRECTIVE-DOCTRINE' },
  { file: 'src/content/limericks/LIM-tri-directive-doctrine.mdx', caseNumber: 'LIM-FREF-TRI-DIRECTIVE-DOCTRINE', parentEntry: 'FREF-TRI-DIRECTIVE-DOCTRINE' },
  { file: 'src/content/aphorisms/APH-tri-directive-doctrine.mdx', caseNumber: 'APH-FREF-TRI-DIRECTIVE-DOCTRINE', parentEntry: 'FREF-TRI-DIRECTIVE-DOCTRINE' }
];

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

function updateFile(filePath, updates) {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }
  const raw = fs.readFileSync(absPath, 'utf8');
  const split = splitFrontmatter(raw);
  if (!split) {
    console.error(`Could not parse frontmatter for ${filePath}`);
    return;
  }
  const fmLines = split.fmRaw.split('\n');

  for (const [key, val] of Object.entries(updates)) {
    const range = findTopLevelKeyRange(fmLines, key);
    if (range) {
      fmLines[range.start] = `${key}: ${val}`;
      if (range.end - range.start > 1) {
        fmLines.splice(range.start + 1, range.end - range.start - 1);
      }
    } else {
      // Insert at suitable place
      if (key === 'caseNumber') {
        const titleRange = findTopLevelKeyRange(fmLines, 'title');
        if (titleRange) {
          fmLines.splice(titleRange.end, 0, `${key}: ${val}`);
        } else {
          fmLines.unshift(`${key}: ${val}`);
        }
      } else {
        fmLines.push(`${key}: ${val}`);
      }
    }
  }

  // Update updatedAt
  const updatedRange = findTopLevelKeyRange(fmLines, 'updatedAt');
  if (updatedRange) {
    fmLines[updatedRange.start] = `updatedAt: "2026-07-10"`;
  } else {
    fmLines.push(`updatedAt: "2026-07-10"`);
  }

  const next = `---\n${fmLines.join('\n')}\n---${split.body.startsWith('\n') ? '' : '\n'}${split.body}`;
  fs.writeFileSync(absPath, next, 'utf8');
  console.log(`Updated: ${filePath}`);
}

console.log('Hooking up parent entries...');
for (const parent of PARENTS) {
  updateFile(parent.file, { caseNumber: `"${parent.caseNumber}"` });
}

console.log('\nHooking up poetry files...');
for (const poem of POEMS) {
  updateFile(poem.file, {
    caseNumber: `"${poem.caseNumber}"`,
    parentEntry: `"${poem.parentEntry}"`
  });
}

console.log('\nAll files processed.');
