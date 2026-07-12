import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { generateForecasts } from "@/lib/strategic-intelligence/engine";
import { loadForecasts } from "@/lib/strategic-intelligence/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    const refresh = request.nextUrl.searchParams.get("refresh") === "true";
    const communityId = request.nextUrl.searchParams.get("community_id") ?? undefined;
    if (!institutionId) throw new Error("institution_id is required");
    const forecasts = refresh ? generateForecasts(institutionId, communityId) : loadForecasts().filter((f) => f.institution_id === institutionId);
    return apiSuccess(forecasts, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/forecasts" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const forecasts = generateForecasts(body.institution_id, body.community_id);
    return apiSuccess(forecasts, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.manage", endpoint: "/api/v1/strategic-intelligence/forecasts" }
);
