import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search/engine";
import type { SearchFilters } from "@/lib/search/types";

export async function GET(request: NextRequest) {
  const start = Date.now();
  const params = request.nextUrl.searchParams;
  const q = params.get("q") || "";
  const mode = params.get("mode") || "standard";
  const limit = Math.min(parseInt(params.get("limit") || "25", 10), 100);

  const filters: SearchFilters = {};
  const entityType = params.get("entity_type");
  const county = params.get("county");
  const status = params.get("status");
  const tags = params.get("tags");
  if (entityType) filters.entity_type = entityType;
  if (county) filters.county = county;
  if (status) filters.status = status;
  if (tags) filters.tags = tags;

  const results = search(q, { mode, filters, limit });
  const latencyMs = Date.now() - start;

  return NextResponse.json({
    query: q,
    mode,
    count: results.length,
    latencyMs,
    results,
  });
}
