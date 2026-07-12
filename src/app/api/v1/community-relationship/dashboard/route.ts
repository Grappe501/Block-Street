import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getUserDashboard } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id");
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!userId || !institutionId) throw new Error("user_id and institution_id are required");
    return apiSuccess(getUserDashboard(userId, institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/dashboard" }
);
