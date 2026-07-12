import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { generateRecommendations } from "@/lib/strategic-intelligence/engine";
import { loadRecommendations } from "@/lib/strategic-intelligence/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    const refresh = request.nextUrl.searchParams.get("refresh") === "true";
    if (!institutionId) throw new Error("institution_id is required");
    const recs = refresh ? generateRecommendations(institutionId) : loadRecommendations().filter((r) => r.institution_id === institutionId);
    return apiSuccess(recs, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/recommendations" }
);
