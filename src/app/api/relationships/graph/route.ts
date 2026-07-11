import { NextResponse } from "next/server";
import { getGraph } from "@/lib/relationships/engine";

export async function GET() {
  const graph = getGraph();
  return NextResponse.json({ nodeCount: graph.nodes.length, edgeCount: graph.edges.length, ...graph });
}
