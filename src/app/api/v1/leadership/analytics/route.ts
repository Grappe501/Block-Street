import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getExecutiveDashboard, getLeadershipHealthSummary } from "@/lib/leadership/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    return apiSuccess(
      {
        health: getLeadershipHealthSummary(),
        executive: institutionId ? getExecutiveDashboard(institutionId) : null,
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "leadership.view", endpoint: "/api/v1/leadership/analytics" }
);
