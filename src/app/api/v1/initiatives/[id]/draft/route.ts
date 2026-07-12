import { withApiGateway } from "@/lib/api/http";
import { updateInitiativeDraft } from "@/lib/civic-action/builds/11.1/api";
import { withInitiativeApi, initiativeIdFromPath } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const PATCH = withApiGateway(
  async (ctx, request) => {
    const id = initiativeIdFromPath(request);
    return withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown>;
        return updateInitiativeDraft(apiCtx, id, body);
      },
      { requireAuth: true }
    );
  },
  { permission: "civic_action.manage", endpoint: "/api/v1/initiatives/[id]/draft" }
);
