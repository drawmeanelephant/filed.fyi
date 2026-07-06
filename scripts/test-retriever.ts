// scripts/test-retriever.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import { SeamAwareRetriever, type Seed } from '../src/lib/rag/retriever';

async function resolveNodeContent(collection: string, id: string): Promise<string> {
  const docsDir = path.join(process.cwd(), 'src/content/docs');
  // Determine if ID already includes the collection prefix (as with reference/guides)
  let relativePath = id;
  if (!id.startsWith(collection + '/')) {
    relativePath = path.join(collection, id);
  }

  const targetPath = path.join(docsDir, relativePath);
  try {
    const raw = await fs.readFile(targetPath, 'utf-8');
    // Strip frontmatter briefly to isolate the body text
    const bodyOnly = raw.replace(/^---[\s\S]*?---/, '').trim();
    return bodyOnly;
  } catch (error) {
    return `[Content Error: Unable to read file at ${relativePath}]`;
  }
}

async function runDiagnostic() {
  console.log('=== STARTING SEAM-AWARE RAG DIAGNOSTIC ===');

  const retriever = new SeamAwareRetriever();

  // 1. Initialize retriever
  try {
    await retriever.init('rag-dist/graph-manifest.json');
    console.log('✓ Successfully loaded graph-manifest.json');
  } catch (err: any) {
    console.error('✗ Initialization failed. Did you run the graph builder first?', err.message);
    return;
  }

  // 2. Simulate Seed Retrieval for the "Trust Surface" Query
  // We simulate finding 'reference/fref-0823-tsrt' or a related file as our search seed.
  const mockSeeds: Seed[] = [
    { id: 'reference/fref-0823-tsrt.mdx', score: 1.0 },
    { id: 'lorelog/LLG-0408-DTS-DEP.mdx', score: 0.9 }
  ];

  console.log(`\nSimulating Vector Search Seeds:`, mockSeeds);

  // 3. Execute weighted graph walk
  const rawBins = await retriever.retrieve(mockSeeds, 2);

  // 4. Handle Naming Mismatch and Load Content dynamically
  // Since retriever.ts expects .type but build-rag-graph.ts writes .collection,
  // we map them safely here and load their actual bodies.
  const resolvedBins = {
    reference: [] as any[],
    lorelog: [] as any[],
    mascots: [] as any[],
    poetry_posts: [] as any[]
  };

  const processNode = async (node: any) => {
    // Normalizing type/collection mismatch
    const nodeType = node.type || node.collection;
    const content = await resolveNodeContent(node.collection || node.type, node.id);

    const enrichedNode = {
      ...node,
      type: nodeType,
      content: content.substring(0, 300) + '...' // truncate for clean preview
    };

    if (nodeType === 'reference' || nodeType === 'guides') {
      resolvedBins.reference.push(enrichedNode);
    } else if (nodeType === 'lorelog') {
      resolvedBins.lorelog.push(enrichedNode);
    } else if (nodeType === 'mascots') {
      resolvedBins.mascots.push(enrichedNode);
    } else if (['poetry_posts', 'limericks', 'haikus', 'aphorisms'].includes(nodeType)) {
      resolvedBins.poetry_posts.push(enrichedNode);
    }
  };

  // Gather all visited nodes across bins
  const allVisited = [
    ...rawBins.reference,
    ...rawBins.lorelog,
    ...rawBins.mascots,
    ...rawBins.poetry_posts
  ];

  console.log(`\nGraph walk completed. Visited ${allVisited.length} nodes total.`);

  for (const node of allVisited) {
    await processNode(node);
  }

  // 5. Assert the existence of our "Trust Surface" target nodes in the results
  console.log('\n=== RAG BINNING RESULTS ===');
  console.log(`[REFERENCE] Count: ${resolvedBins.reference.length}`);
  resolvedBins.reference.forEach(n => console.log(`  - ${n.id} (Score: ${n.compositeScore.toFixed(2)})`));

  console.log(`[LORELOG] Count: ${resolvedBins.lorelog.length}`);
  resolvedBins.lorelog.forEach(n => console.log(`  - ${n.id} (Score: ${n.compositeScore.toFixed(2)})`));

  console.log(`[MASCOTS] Count: ${resolvedBins.mascots.length}`);
  resolvedBins.mascots.forEach(n => console.log(`  - ${n.id} (Score: ${n.compositeScore.toFixed(2)})`));

  console.log(`[POETRY/POSTS] Count: ${resolvedBins.poetry_posts.length}`);
  resolvedBins.poetry_posts.forEach(n => console.log(`  - ${n.id} (Score: ${n.compositeScore.toFixed(2)})`));

  console.log('\n=== VERIFYING EXPECTED TRUST SEAM RELATIONSHIPS ===');
  const hasReference = resolvedBins.reference.some(n => n.id.includes('fref-0823-tsrt'));
  const hasIncident = resolvedBins.lorelog.some(n => n.id.includes('LLG-0408'));
  const hasMascot = resolvedBins.mascots.some(n => n.id.includes('938.vantage-hollow') || n.id.includes('vanda-uiguard'));

  console.log(`Has Reference Doctrine (fref-0823-tsrt):`, hasReference ? '✓ YES' : '✗ NO');
  console.log(`Has Lived Incident (LLG-0408):`, hasIncident ? '✓ YES' : '✗ NO');
  console.log(`Has Mascot (938.vantage-hollow / UI Guard):`, hasMascot ? '✓ YES' : '✗ NO');

  console.log('\n=== COMPILING SIMULATED PROMPT CONTEXT ===');
  let contextStr = '--- RETRIEVED CONTEXT ---\n';
  contextStr += `REFERENCE:\n${resolvedBins.reference.map(n => `[${n.title}]\n${n.content}`).join('\n')}\n`;
  contextStr += `LORELOG:\n${resolvedBins.lorelog.map(n => `[${n.title}]\n${n.content}`).join('\n')}\n`;
  contextStr += `MASCOTS:\n${resolvedBins.mascots.map(n => `[${n.title}]\n${n.content}`).join('\n')}\n`;
  contextStr += `POETRY/POSTS:\n${resolvedBins.poetry_posts.map(n => `[${n.title}]\n${n.content}`).join('\n')}\n`;

  console.log(contextStr.substring(0, 1000) + '\n... [truncated for display] ...');
}

runDiagnostic();
