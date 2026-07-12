import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { generateCommunityReport } from "@/lib/community-health/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const report = generateCommunityReport({
      report_type: body.report_type ?? "annual",
      community_id: body.community_id,
      county_id: body.county_id,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(report, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "community_health.manage", endpoint: "/api/v1/community-health/reports" }
);
