import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { runIntelligenceCycle } from "@/lib/strategic-intelligence/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const result = runIntelligenceCycle({
      institution_id: body.institution_id,
      county_id: body.county_id,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "strategic_intelligence.manage", endpoint: "/api/v1/strategic-intelligence/cycle" }
);
