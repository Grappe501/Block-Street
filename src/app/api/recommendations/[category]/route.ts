import { NextRequest, NextResponse } from "next/server";
import { listRecommendations } from "@/lib/recommendations/engine";

type CategoryRoute = "people" | "counties" | "events" | "organizations" | "missions";

const MAP: Record<CategoryRoute, string> = {
  people: "contact",
  counties: "county",
  events: "event",
  organizations: "organization",
  missions: "mission",
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ category: string }> }
) {
  const { category } = await context.params;
  const mapped = MAP[category as CategoryRoute];
  if (!mapped) {
    return NextResponse.json({ error: "Unknown category" }, { status: 404 });
  }
  const start = Date.now();
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "25", 10), 100);
  const recommendations = listRecommendations({ category: mapped, limit });
  return NextResponse.json({
    category,
    count: recommendations.length,
    latencyMs: Date.now() - start,
    recommendations,
  });
}
