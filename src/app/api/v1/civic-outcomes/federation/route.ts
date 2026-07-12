import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getFederationOutcomeAnalytics } from "@/lib/civic-outcomes/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getFederationOutcomeAnalytics(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "civic_outcomes.view", endpoint: "/api/v1/civic-outcomes/federation" }
);
