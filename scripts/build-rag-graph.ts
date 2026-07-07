import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export async function buildRagGraph() {
  console.log('Building RAG graph...');
  const baseDir = path.join(process.cwd(), 'src/content/docs');
  const collections = ['mascots', 'lorelog', 'limericks', 'haikus', 'aphorisms', 'releases', 'changelog', 'reference', 'guides'];

  interface GraphNode {
    id: string;
    collection: string;
    title: string;
    slug: string;
  }
  interface GraphEdge {
    source: string;
    target: string;
    weight: number;
    reason: string;
  }
  interface TextChunk {
    chunk_id: string;
    node_id: string;
    text: string;
  }

  const nodes: any[] = [];
  const edges: GraphEdge[] = [];
  const chunks: TextChunk[] = [];

  for (const coll of collections) {
    const isMoved = ['limericks', 'haikus', 'aphorisms'].includes(coll);
    const collDir = isMoved 
      ? path.join(process.cwd(), 'src/content', coll)
      : path.join(process.cwd(), 'src/content/docs', coll);
    try {
      const files = await getFilesRecursive(collDir);
      for (const file of files) {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

        const raw = await fs.readFile(file, 'utf-8');
        const { data, content } = matter(raw);

        const relativePath = path.relative(collDir, file);
        const id = coll === 'reference' || coll === 'guides' ? `${coll}/${relativePath}` : relativePath;
        const slug = data.slug || id.replace(/\.mdx?$/, '');
        const title = data.title || data.displayName || data.name || id;

        nodes.push({ id, collection: coll, title, slug, data, body: content });

        if (content) {
          const paragraphs = content.split('\n\n').filter((c: string) => c.trim().length > 0);
          paragraphs.forEach((p: string, idx: number) => {
            chunks.push({
              chunk_id: `${id}-chunk-${idx}`,
              node_id: id,
              text: p.trim()
            });
          });
        }
      }
    } catch (e) {
      console.warn(`Could not load ${coll}:`, (e as Error).message);
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const nodeA = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeB = nodes[j];
      let weight = 0;
      let reason = '';

      if (nodeA.data.relatedEntries?.some((e: any) => e.id === nodeB.id || e.id === nodeB.slug) ||
          nodeB.data.relatedEntries?.some((e: any) => e.id === nodeA.id || e.id === nodeA.slug)) {
        weight = Math.max(weight, 1.0);
        reason = 'hard_link';
      }

      if (Array.isArray(nodeA.data.relatedLorelog) && nodeA.data.relatedLorelog.some((l: any) => nodeB.id.includes(l)) ||
          Array.isArray(nodeB.data.relatedLorelog) && nodeB.data.relatedLorelog.some((l: any) => nodeA.id.includes(l))) {
        weight = Math.max(weight, 1.0);
        reason = 'hard_link';
      }

      if (nodeA.data.mascotRef === nodeB.id || nodeA.data.mascotRef === nodeB.slug || (nodeA.data.mascotId && String(nodeA.data.mascotId) === String(nodeB.data.mascotId)) ||
          nodeB.data.mascotRef === nodeA.id || nodeB.data.mascotRef === nodeA.slug ||
          (Array.isArray(nodeA.data.relatedMascots) && nodeA.data.relatedMascots.includes(String(nodeB.data.mascotId))) ||
          (Array.isArray(nodeB.data.relatedMascots) && nodeB.data.relatedMascots.includes(String(nodeA.data.mascotId)))) {
        weight = Math.max(weight, 0.8);
        reason = 'mascot_ref';
      }

      const prefixA = nodeA.id.match(/^LLG-\d{4}/i)?.[0];
      const prefixB = nodeB.id.match(/^LLG-\d{4}/i)?.[0];
      if (prefixA && prefixB && prefixA.toLowerCase() === prefixB.toLowerCase()) {
        weight = Math.max(weight, 0.6);
        reason = 'case_prefix_match';
      }

      const tagsA = [...(nodeA.data.tags || []), ...(nodeA.data.concepts || [])];
      const tagsB = [...(nodeB.data.tags || []), ...(nodeB.data.concepts || [])];
      const intersection = tagsA.filter((t: string) => tagsB.includes(t));
      if (intersection.length > 0) {
        weight = Math.max(weight, 0.4);
        reason = 'concept_tag';
      }

      const pathA = nodeA.id.split('/').slice(0, -1).join('/');
      const pathB = nodeB.id.split('/').slice(0, -1).join('/');
      if (pathA && pathB && pathA === pathB) {
        weight = Math.max(weight, 0.3);
        reason = 'route_adjacency';
      }

      if (weight > 0) {
        edges.push({
          source: nodeA.id,
          target: nodeB.id,
          weight,
          reason
        });
      }
    }
  }

  const outputNodes: GraphNode[] = nodes.map(n => ({
    id: n.id,
    collection: n.collection,
    title: n.title,
    slug: n.slug
  }));

  const dist = path.join(process.cwd(), 'rag-dist');
  await fs.mkdir(dist, { recursive: true });

  await fs.writeFile(
    path.join(dist, 'graph-manifest.json'),
    JSON.stringify({ nodes: outputNodes, edges }, null, 2)
  );

  await fs.writeFile(
    path.join(dist, 'chunks.json'),
    JSON.stringify(chunks, null, 2)
  );

  console.log(`RAG Graph built: ${outputNodes.length} nodes, ${edges.length} edges, ${chunks.length} chunks.`);
}

async function getFilesRecursive(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFilesRecursive(res) : res;
  }));
  return Array.prototype.concat(...files);
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildRagGraph();
}
