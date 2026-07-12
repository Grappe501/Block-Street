import { withApiGateway } from "@/lib/api/http";
import { queryObjectiveDetail } from "@/lib/civic-action/builds/11.2/api";
import { withObjectiveApi, objectiveIdFromPath } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = objectiveIdFromPath(request);
    return withObjectiveApi(ctx, request, (apiCtx) => queryObjectiveDetail(id, apiCtx));
  },
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/[id]" }
);
