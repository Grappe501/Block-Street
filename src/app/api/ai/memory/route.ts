import { NextRequest, NextResponse } from "next/server";
import { clearMemory, listMemory, updateMemory } from "@/lib/ai/engine";

export async function GET() {
  return NextResponse.json({ entries: listMemory() });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, value } = body as { id: string; value: string };
  if (!id || value === undefined) return NextResponse.json({ error: "id and value required" }, { status: 400 });
  const entry = updateMemory(id, value);
  if (!entry) return NextResponse.json({ error: "Memory entry not found" }, { status: 404 });
  return NextResponse.json({ ok: true, entry });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") || undefined;
  clearMemory(id);
  return NextResponse.json({ ok: true, cleared: id ?? "all" });
}
