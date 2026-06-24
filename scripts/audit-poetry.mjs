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

  // Auto-scaffold a new batch file for the unmapped files
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const newBatchFile = path.join(sidecarDir, `batch_${timestamp}.json`);

  const records = unmappedFiles.map(file => ({
    file_path: file,
    verses: []
  }));

  const batchData = {
    batch_timestamp: new Date().toISOString(),
    total_files_processed: records.length,
    records: records
  };

  fs.writeFileSync(newBatchFile, JSON.stringify(batchData, null, 2));
  console.log(`\nAuto-scaffolded placeholders in ${newBatchFile}`);

  // Exit with 1 in CI/strict mode to block merges, exit with 0 locally for warnings
  const isStrict = process.env.CI === 'true' || process.argv.includes('--strict');
  process.exit(isStrict ? 1 : 0);
} else {
  console.log("All .mdx files are mapped. No unmapped files found.");
  process.exit(0);
}
