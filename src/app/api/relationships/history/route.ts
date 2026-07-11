import { NextResponse } from "next/server";
import { getRelationshipHistory } from "@/lib/relationships/engine";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query parameter required" }, { status: 400 });
  const history = getRelationshipHistory(id);
  if (!history) return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
  return NextResponse.json(history);
}
