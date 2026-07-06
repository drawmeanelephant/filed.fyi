import { buildRagGraph } from '../../../scripts/build-rag-graph';
export async function GET() {
  await buildRagGraph();
  return new Response(JSON.stringify({ success: true }));
}
