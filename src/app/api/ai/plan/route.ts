import { NextRequest, NextResponse } from "next/server";
import { plan } from "@/lib/ai/engine";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topic, horizon, userId } = body as { topic: string; horizon?: string; userId?: string };
  if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 });
  return NextResponse.json({ response: plan({ topic, horizon, userId }) });
}
