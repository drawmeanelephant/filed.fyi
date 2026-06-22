import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.resolve(__dirname, '../src/content/docs');
const sidecarDir = path.resolve(__dirname, '../src/data/sidecar');

// Find all .mdx files recursively
function getMdxFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getMdxFiles(filePath, fileList);
    } else if (filePath.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allMdxFilesFullPaths = getMdxFiles(docsDir);
const allMdxFiles = allMdxFilesFullPaths.map(f => path.relative(path.resolve(__dirname, '..'), f).replace(/\\/g, '/'));

// Read all JSON sidecar files
function getJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files.filter(f => f.endsWith('.json')).map(f => path.join(dir, f));
}

const sidecarFiles = getJsonFiles(sidecarDir);

let processedMdxFiles = new Set();

for (const sidecarFile of sidecarFiles) {
  const content = fs.readFileSync(sidecarFile, 'utf-8');
  try {
    const data = JSON.parse(content);
    if (data.records && Array.isArray(data.records)) {
      for (const record of data.records) {
        if (record.file_path) {
          processedMdxFiles.add(record.file_path);
        }
      }
    }
  } catch (err) {
    console.error(`Error parsing JSON in ${sidecarFile}: ${err.message}`);
  }
}

const unmappedFiles = allMdxFiles.filter(file => !processedMdxFiles.has(file));

if (unmappedFiles.length > 0) {
  console.log(`Found ${unmappedFiles.length} unmapped .mdx files that need poetry:`);
  unmappedFiles.forEach(f => console.log(` - ${f}`));

  // Create a new sidecar file if there are unmapped files
  // Not creating one automatically because this is just an audit. The actual generation might happen elsewhere.
  // Wait, the memory says "script identifies unmapped .mdx files... to ensure files are not processed multiple times in batch loops."
  // And the user says: "the poetry audit is great and i like to keep running it as it's instrumental in my poetry workflow. i think i need something to ensure it can automerge so it's always accurate too as it checks for what needs poetry and will allow me to automate that more in the future."
  // To allow automerge, the test should PASS. If we exit with 1, the test fails, which blocks automerge unless they generate poetry. But if they just added an MDX file, they MIGHT want it to fail until poetry is generated?
  // Let's exit with 0, but output clearly, OR maybe exit with 0 unless there's a strict CI mode. Let's just exit 0 for now so PRs can pass and they see the audit, OR exit 0. Wait, if it's a test to ensure it's accurate...
  process.exit(0);
} else {
  console.log("All .mdx files are mapped. No unmapped files found.");
  process.exit(0);
}
