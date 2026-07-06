import fs from 'node:fs/promises';
import path from 'node:path';
import * as lancedb from '@lancedb/lancedb';

// Placeholder for embedding generation.
// Swap this out with @xenova/transformers or OpenAI/Gemini API calls.
async function generateEmbedding(text: string): Promise<number[]> {
  // A dummy embedding generator that returns a 384-dimensional float array
  // (e.g., standard for all-MiniLM-L6-v2)
  const dim = 384;
  const vec = new Array(dim).fill(0).map(() => Math.random() * 2 - 1);
  // Normalize the vector
  const mag = Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
  return vec.map(v => v / mag);
}

export async function indexVectors() {
  console.log('Initializing vector indexer...');
  const chunksPath = path.join(process.cwd(), 'rag-dist/chunks.json');
  const manifestPath = path.join(process.cwd(), 'rag-dist/graph-manifest.json');
  const ragDbDir = path.join(process.cwd(), '.rag');

  let chunksRaw: string;
  let manifestRaw: string;

  try {
    chunksRaw = await fs.readFile(chunksPath, 'utf-8');
    manifestRaw = await fs.readFile(manifestPath, 'utf-8');
  } catch (err) {
    console.error('Error: Could not read rag-dist/chunks.json or rag-dist/graph-manifest.json.');
    console.error('Please ensure you have run the RAG graph extraction script first.');
    process.exit(1);
  }

  const chunks = JSON.parse(chunksRaw);
  const manifest = JSON.parse(manifestRaw);

  // Build a lookup map for node metadata
  const nodesMap = new Map<string, any>();
  for (const node of manifest.nodes) {
    nodesMap.set(node.id, node);
  }

  // Connect to LanceDB (embedded, disk-based)
  const db = await lancedb.connect(ragDbDir);

  console.log(`Loaded ${chunks.length} chunks. Generating embeddings...`);

  // Prepare records for LanceDB
  const records = [];
  for (const chunk of chunks) {
    const node = nodesMap.get(chunk.node_id);
    if (!node) continue;

    const vector = await generateEmbedding(chunk.text);

    records.push({
      vector,
      chunk_id: chunk.chunk_id,
      node_id: chunk.node_id,
      text: chunk.text,
      slug: node.slug,
      title: node.title,
      collection: node.collection
    });
  }

  console.log(`Generated ${records.length} records. Saving to LanceDB...`);

  // Overwrite the table if it exists
  const tableNames = await db.tableNames();
  if (tableNames.includes('document_chunks')) {
    await db.dropTable('document_chunks');
  }

  const table = await db.createTable('document_chunks', records);

  console.log(`Index successfully saved to ${ragDbDir}`);
  console.log(`Total rows in table: ${await table.countRows()}`);
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  indexVectors().catch(console.error);
}
