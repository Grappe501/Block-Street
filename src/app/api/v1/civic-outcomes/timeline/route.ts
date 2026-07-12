import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getOutcomeTimeline } from "@/lib/civic-outcomes/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const outcomeId = request.nextUrl.searchParams.get("outcome_id");
    if (!outcomeId) throw new Error("outcome_id is required");
    return apiSuccess(getOutcomeTimeline(outcomeId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/timeline" }
);
