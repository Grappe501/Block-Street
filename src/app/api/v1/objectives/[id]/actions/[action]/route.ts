import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { executeLifecycleAction } from "@/lib/civic-action/builds/11.2/api";
import {
  withObjectiveApi,
  objectiveIdFromPath,
  lifecycleActionFromPath,
} from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = objectiveIdFromPath(request);
    const action = lifecycleActionFromPath(request);
    const initiativeId = request.nextUrl.searchParams.get("initiative_id");
    if (!initiativeId) {
      throw new ApiError("VALIDATION_ERROR", "initiative_id query parameter is required", 400);
    }
    return withObjectiveApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        return executeLifecycleAction(apiCtx, initiativeId, id, action, body);
      },
      { requireAuth: true }
    );
  },
  { permission: "civic_action.manage", endpoint: "/api/v1/objectives/[id]/actions/[action]" }
);
