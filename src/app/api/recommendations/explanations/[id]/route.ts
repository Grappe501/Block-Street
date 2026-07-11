import { NextRequest, NextResponse } from "next/server";
import { getExplanation } from "@/lib/recommendations/engine";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const recommendation = getExplanation(id);
  if (!recommendation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    id,
    recommendation,
    explanation: {
      confidence: recommendation.confidence,
      evidence: recommendation.evidence,
      scoreBreakdown: recommendation.scoreBreakdown,
      campaignGoal: recommendation.campaignGoal,
    },
  });
}
