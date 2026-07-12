import { withApiGateway } from "@/lib/api/http";
import { executeLifecycleAction } from "@/lib/civic-action/builds/11.1/api";
import { withInitiativeApi, initiativeIdFromPath, lifecycleActionFromPath } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = initiativeIdFromPath(request);
    const action = lifecycleActionFromPath(request);
    return withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        return executeLifecycleAction(apiCtx, id, action, body);
      },
      { requireAuth: true }
    );
  },
  { permission: "civic_action.manage", endpoint: "/api/v1/initiatives/[id]/actions/[action]" }
);
