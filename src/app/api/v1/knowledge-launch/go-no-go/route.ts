import { withApiGateway } from "@/lib/api/http";
import { knowledgeProductionService } from "@/lib/civic-action/builds/11.12/production";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => ({
      dashboard: knowledgeProductionService.getGoNoGo(apiCtx.institution_id),
      launch: knowledgeProductionService.getLaunchControl(apiCtx.institution_id),
      event: "launch.recommendation_issued",
    })),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-launch/go-no-go" }
);
