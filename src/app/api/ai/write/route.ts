import { NextRequest, NextResponse } from "next/server";
import { writeContent } from "@/lib/ai/engine";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, topic, tone, userId } = body as { type: string; topic: string; tone?: string; userId?: string };
  if (!type || !topic) return NextResponse.json({ error: "type and topic required" }, { status: 400 });
  return NextResponse.json({ response: writeContent({ type, topic, tone, userId }) });
}
