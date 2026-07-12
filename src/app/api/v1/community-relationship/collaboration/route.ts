import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getCollaborationAnalytics } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess(getCollaborationAnalytics(institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/collaboration" }
);
