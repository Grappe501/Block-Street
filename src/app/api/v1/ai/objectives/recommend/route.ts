import { withApiGateway } from "@/lib/api/http";
import { objectiveIntelligenceService } from "@/lib/civic-action/builds/11.2/intelligence";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.2/intelligence/api-context";

export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { initiative_id?: string };
      const intelCtx = toIntelligenceContext(apiCtx, { initiativeId: body.initiative_id });
      return objectiveIntelligenceService.recommend(intelCtx);
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/objectives/recommend" }
);
