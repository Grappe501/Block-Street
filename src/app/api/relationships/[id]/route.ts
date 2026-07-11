import { NextResponse } from "next/server";
import { getRelationship } from "@/lib/relationships/engine";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const relationship = getRelationship(id);
  if (!relationship) return NextResponse.json({ error: "Relationship not found" }, { status: 404 });
  return NextResponse.json({ relationship });
}
