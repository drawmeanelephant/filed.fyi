import type { APIRoute } from 'astro';
import * as lancedb from '@lancedb/lancedb';
import path from 'node:path';
import fs from 'node:fs/promises';

// Helper to load raw file contents from disk
async function loadContentFromDisk(collection: string, id: string): Promise<string> {
  const docsDir = path.join(process.cwd(), 'src/content/docs');
  let relativePath = id;
  if (!id.startsWith(collection + '/')) {
    relativePath = path.join(collection, id);
  }
  try {
    const raw = await fs.readFile(path.join(docsDir, relativePath), 'utf-8');
    return raw.replace(/^---[\s\S]*?---/, '').trim(); // Remove frontmatter
  } catch {
    return '';
  }
}
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SeamAwareRetriever, type Seed } from '../../lib/rag/retriever';

async function generateEmbedding(text: string): Promise<number[]> {
  const dim = 384;
  const vec = new Array(dim).fill(0).map(() => Math.random() * 2 - 1);
  const mag = Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
  return vec.map(v => v / mag);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const userQuery = body.query || '';

    // 1. Trigger Vector Search for Seeds
    const dbPath = path.join(process.cwd(), '.rag');
    const db = await lancedb.connect(dbPath);
    const table = await db.openTable('document_chunks');

    const qVec = await generateEmbedding(userQuery);
    const vectorResults = await table.search(qVec).limit(5).toArray();

    const seeds: Seed[] = vectorResults.map((r: any) => ({
      id: r.node_id,
      score: Math.max(0, 1 - (r._distance / 2)) // pseudo-score conversion
    }));

    // 2. Call SeamAwareRetriever
    const retriever = new SeamAwareRetriever();
    await retriever.init();
    const bins = await retriever.retrieve(seeds);

    const enrichBinWithContent = async (bin: any[]) => {
      return Promise.all(
        bin.map(async (node) => {
          const coll = node.collection || node.type;
          const content = await loadContentFromDisk(coll, node.id);
          return { ...node, content };
        })
      );
    };

    // Enrich all active bins before prompt formatting
    bins.reference = await enrichBinWithContent(bins.reference);
    bins.lorelog = await enrichBinWithContent(bins.lorelog);
    bins.mascots = await enrichBinWithContent(bins.mascots);
    bins.poetry_posts = await enrichBinWithContent(bins.poetry_posts);

    // 3. Format Prompt & Context
    let contextStr = '--- RETRIEVED CONTEXT ---\n';
    contextStr += `REFERENCE:\n${bins.reference.map(n => n.content?.substring(0, 200)).join('\n')}\n`;
    contextStr += `LORELOG:\n${bins.lorelog.map(n => n.content?.substring(0, 200)).join('\n')}\n`;
    contextStr += `MASCOTS:\n${bins.mascots.map(n => n.content?.substring(0, 200)).join('\n')}\n`;
    contextStr += `POETRY/POSTS:\n${bins.poetry_posts.map(n => n.content?.substring(0, 200)).join('\n')}\n`;

    let systemInstruction = `You are a helpful analyst reviewing institutional records.
Strict Guardrails:
- Present conflicting views (SOMA vs. COMA) side-by-side. You must NOT attempt to reconcile them into a single, neat compromise.
- Favorable Beige quarantine rule: if any retrieved node contains heavily softened or euphemistic terms, you must explicitly highlight the unvarnished raw incident text next to it.`;

    // 4. Reassurance Metadata Check
    if (bins.reference.length > 0 && bins.lorelog.length === 0) {
       systemInstruction += `\n- [Warning: Reassurance level exceeds verified baseline evidence]. You MUST output this exact warning block in your response.`;
    }

    const prompt = `System Instructions:\n${systemInstruction}\n\nContext:\n${contextStr}\n\nUser Query: ${userQuery}`;

    // 5. Call LLM (Gemini)
    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ result: responseText, bins }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};
