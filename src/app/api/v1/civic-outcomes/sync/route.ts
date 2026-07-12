import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { syncOutcomesFromPlatformSignals } from "@/lib/civic-outcomes/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const outcomes = syncOutcomesFromPlatformSignals({
      institution_id: body.institution_id,
      program_id: body.program_id,
      community_id: body.community_id,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(outcomes, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_outcomes.manage", endpoint: "/api/v1/civic-outcomes/sync" }
);
