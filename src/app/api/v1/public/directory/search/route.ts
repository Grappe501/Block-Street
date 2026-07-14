import { NextRequest, NextResponse } from "next/server";
import { searchDirectory } from "@/lib/directory/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const hits = searchDirectory(q);
  return NextResponse.json({ query: q, hits, count: hits.length });
}
