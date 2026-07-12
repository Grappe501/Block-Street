import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getRelationshipInsights } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!institutionId) throw new Error("institution_id is required");
    return apiSuccess(getRelationshipInsights(institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/insights" }
);
