import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { generateStrategicInsights, listStrategicInsights } from "@/lib/strategic-intelligence/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const category = request.nextUrl.searchParams.get("category") ?? undefined;
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    return apiSuccess(listStrategicInsights(institutionId, { category, status }), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/insights" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const insights = generateStrategicInsights(body.institution_id, body.county_id);
    return apiSuccess(insights, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.manage", endpoint: "/api/v1/strategic-intelligence/insights" }
);
