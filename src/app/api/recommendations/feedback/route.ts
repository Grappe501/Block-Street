import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { recordFeedback, getTelemetry } from "@/lib/recommendations/engine";
import type { FeedbackAction } from "@/lib/recommendations/types";

export async function GET() {
  const path = join(process.cwd(), "data", "recommendations", "feedback.json");
  const data = JSON.parse(readFileSync(path, "utf8"));
  return NextResponse.json({ ...data, telemetry: getTelemetry() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { recommendationId, action, userId, notes } = body as {
    recommendationId: string;
    action: FeedbackAction;
    userId?: string;
    notes?: string;
  };
  if (!recommendationId || !action) {
    return NextResponse.json({ error: "recommendationId and action required" }, { status: 400 });
  }
  const entry = recordFeedback(recommendationId, action, userId, notes);
  return NextResponse.json({ ok: true, feedback: entry, telemetry: getTelemetry() });
}
