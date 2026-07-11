import { NextResponse } from "next/server";
import { getDailyBriefing } from "@/lib/recommendations/engine";

export async function GET() {
  const start = Date.now();
  const briefing = getDailyBriefing();
  return NextResponse.json({
    ...briefing,
    latencyMs: Date.now() - start,
  });
}
