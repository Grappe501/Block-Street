import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getStrategicDashboard } from "@/lib/strategic-intelligence/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!institutionId) throw new Error("institution_id is required");
    return apiSuccess(getStrategicDashboard(institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "strategic_intelligence.view", endpoint: "/api/v1/strategic-intelligence/dashboard" }
);
