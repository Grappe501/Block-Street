import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getOperationsOverview, getSystemHealth, getDeadlines, getHumanImpactSummary, getOperationalAlerts } from "@/lib/identity-trust/wave6/overview";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode") ?? "overview";
    if (mode === "health") return apiSuccess(getSystemHealth(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    if (mode === "deadlines") return apiSuccess(getDeadlines(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    if (mode === "human-impact") return apiSuccess(getHumanImpactSummary(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    if (mode === "alerts") return apiSuccess(getOperationalAlerts(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    return apiSuccess(getOperationsOverview(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-ops/overview" }
);
