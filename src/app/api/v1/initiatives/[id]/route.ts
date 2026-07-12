import { withApiGateway } from "@/lib/api/http";
import { queryInitiativeDetail } from "@/lib/civic-action/builds/11.1/api";
import { withInitiativeApi, initiativeIdFromPath } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = initiativeIdFromPath(request);
    return withInitiativeApi(ctx, request, (apiCtx) => queryInitiativeDetail(id, apiCtx));
  },
  { permission: "civic_action.view", endpoint: "/api/v1/initiatives/[id]" }
);
