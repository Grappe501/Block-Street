import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { generateOutcomeReport } from "@/lib/civic-outcomes/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const report = generateOutcomeReport({
      report_type: body.report_type ?? "annual_impact",
      institution_id: body.institution_id,
      community_id: body.community_id,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(report, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.manage", endpoint: "/api/v1/civic-outcomes/reports" }
);
