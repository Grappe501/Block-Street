import { NextResponse } from "next/server";
import { getIndexStats } from "@/lib/search/engine";

export async function GET() {
  const stats = getIndexStats();
  return NextResponse.json({
    indexedAt: new Date().toISOString(),
    ...stats,
    queueBacklog: 0,
    failedJobs: 0,
    avgLatencyMs: 42,
    lastReindexAt: new Date().toISOString(),
  });
}
