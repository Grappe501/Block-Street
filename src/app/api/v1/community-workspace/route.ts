import { withApiGateway } from "@/lib/api/http";
import { apiSuccess, ApiError } from "@/lib/api/errors";
import { getCommunityWorkspaceById } from "@/lib/community-workspace";

export const GET = withApiGateway(
  async (ctx, request) => {
    const communityId = request.nextUrl.searchParams.get("community_id");
    if (!communityId) {
      throw new ApiError("VALIDATION_ERROR", "community_id is required", 400);
    }
    const workspace = getCommunityWorkspaceById(communityId);
    if (!workspace) {
      throw new ApiError("NOT_FOUND", "Community workspace not found", 404);
    }
    return apiSuccess(workspace, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { public: true, endpoint: "/api/v1/community-workspace" }
);
