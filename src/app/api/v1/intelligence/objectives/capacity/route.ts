import { withApiGateway } from "@/lib/api/http";
import { objectiveIntelligenceService } from "@/lib/civic-action/builds/11.2/intelligence";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.2/intelligence/api-context";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const initiativeId = request.nextUrl.searchParams.get("initiative_id") ?? undefined;
      const intelCtx = toIntelligenceContext(apiCtx, { initiativeId });
      return {
        capacity: objectiveIntelligenceService.getCapacity(intelCtx),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/objectives/capacity" }
);
