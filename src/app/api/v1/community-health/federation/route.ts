import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getFederationHealthAnalytics } from "@/lib/community-health/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getFederationHealthAnalytics(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "community_health.view", endpoint: "/api/v1/community-health/federation" }
);
