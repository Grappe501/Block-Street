import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { queryObjectiveWorkstreams } from "@/lib/civic-action/builds/11.2/api";
import { withObjectiveApi, objectiveIdFromPath } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = objectiveIdFromPath(request);
    const initiativeId = request.nextUrl.searchParams.get("initiative_id");
    if (!initiativeId) {
      throw new ApiError("VALIDATION_ERROR", "initiative_id query parameter is required", 400);
    }
    return withObjectiveApi(ctx, request, (apiCtx) => queryObjectiveWorkstreams(initiativeId, id, apiCtx));
  },
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/[id]/workstreams" }
);
