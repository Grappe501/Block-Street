import { NextRequest, NextResponse } from "next/server";
import { meetingAssist } from "@/lib/ai/engine";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { topic, userId } = body as { topic: string; userId?: string };
  if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 });
  return NextResponse.json({ response: meetingAssist(topic, userId) });
}
