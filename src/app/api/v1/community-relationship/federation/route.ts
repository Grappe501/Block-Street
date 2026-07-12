import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getFederationAnalytics } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getFederationAnalytics(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/federation" }
);
