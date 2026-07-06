import fs from 'node:fs/promises';
import path from 'node:path';

export interface GraphNode {
  id: string;
  type: string;
  content?: string;
  title?: string;
  [key: string]: any;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  type?: string;
}

export interface GraphManifest {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Seed {
  id: string;
  score: number;
}

export interface ScoredNode extends GraphNode {
  compositeScore: number;
  stepsFromSeed: number;
}

export interface PerspectiveBins {
  reference: ScoredNode[];
  lorelog: ScoredNode[];
  mascots: ScoredNode[];
  poetry_posts: ScoredNode[];
}

export class SeamAwareRetriever {
  private manifest: GraphManifest | null = null;
  private nodeMap: Map<string, GraphNode> = new Map();
  private adjacencyList: Map<string, GraphEdge[]> = new Map();

  async init(manifestPath: string = 'rag-dist/graph-manifest.json'): Promise<void> {
    const rawData = await fs.readFile(path.resolve(process.cwd(), manifestPath), 'utf-8');
    this.manifest = JSON.parse(rawData) as GraphManifest;

    for (const node of this.manifest.nodes) {
      this.nodeMap.set(node.id, node);
    }

    for (const edge of this.manifest.edges) {
      if (!this.adjacencyList.has(edge.source)) {
        this.adjacencyList.set(edge.source, []);
      }
      this.adjacencyList.get(edge.source)!.push(edge);

      if (!this.adjacencyList.has(edge.target)) {
        this.adjacencyList.set(edge.target, []);
      }
      this.adjacencyList.get(edge.target)!.push({
        source: edge.target,
        target: edge.source,
        weight: edge.weight,
        type: edge.type
      });
    }
  }

  async retrieve(seeds: Seed[], maxSteps: number = 2): Promise<PerspectiveBins> {
    if (!this.manifest) {
      throw new Error("Retriever not initialized. Call init() first.");
    }

    const visited = new Map<string, ScoredNode>();
    const queue: Array<[string, number, number]> = [];

    for (const seed of seeds) {
      const node = this.nodeMap.get(seed.id);
      if (node) {
        queue.push([seed.id, seed.score, 0]);
        visited.set(seed.id, { ...node, compositeScore: seed.score, stepsFromSeed: 0 });
      }
    }

    let head = 0;
    while (head < queue.length) {
      const [currentId, currentScore, currentSteps] = queue[head++];

      if (currentSteps >= maxSteps) {
        continue;
      }

      const neighbors = this.adjacencyList.get(currentId) || [];
      for (const edge of neighbors) {
        const targetId = edge.target;
        const targetNode = this.nodeMap.get(targetId);

        if (!targetNode) continue;

        const edgeWeight = edge.weight || 0.5;
        const nextScore = currentScore * edgeWeight;

        if (nextScore < 0.3) {
          continue;
        }

        const nextSteps = currentSteps + 1;
        const existing = visited.get(targetId);

        if (!existing || nextScore > existing.compositeScore) {
          visited.set(targetId, {
            ...targetNode,
            compositeScore: nextScore,
            stepsFromSeed: nextSteps
          });

          queue.push([targetId, nextScore, nextSteps]);
        }
      }
    }

    const bins: PerspectiveBins = {
      reference: [],
      lorelog: [],
      mascots: [],
      poetry_posts: []
    };

    for (const scoredNode of visited.values()) {
      const nodeType = scoredNode.type || scoredNode.collection; // Fallback mapping
      if (nodeType === 'reference' || nodeType === 'guides') {
        bins.reference.push(scoredNode);
      } else if (nodeType === 'lorelog') {
        bins.lorelog.push(scoredNode);
      } else if (nodeType === 'mascots') {
        bins.mascots.push(scoredNode);
      } else if (['poetry_posts', 'limericks', 'haikus', 'aphorisms'].includes(nodeType)) {
        bins.poetry_posts.push(scoredNode);
      }
    }

    bins.reference.sort((a, b) => b.compositeScore - a.compositeScore);
    bins.lorelog.sort((a, b) => b.compositeScore - a.compositeScore);
    bins.mascots.sort((a, b) => b.compositeScore - a.compositeScore);
    bins.poetry_posts.sort((a, b) => b.compositeScore - a.compositeScore);

    return bins;
  }
}
