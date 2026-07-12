import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getEngagementTrends } from "@/lib/civic/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ trends: getEngagementTrends(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic.view", endpoint: "/api/v1/civic/engagement" }
);
