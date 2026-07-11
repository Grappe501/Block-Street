import { NextRequest, NextResponse } from "next/server";
import { chat, getMorningBrief } from "@/lib/ai/engine";

export async function GET() {
  return NextResponse.json({ brief: getMorningBrief() });
}

export async function POST(request: NextRequest) {
  const start = Date.now();
  const body = await request.json();
  const { prompt, userId } = body as { prompt: string; userId?: string };
  if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
  const response = chat({ prompt, userId });
  return NextResponse.json({ response, latencyMs: Date.now() - start });
}
