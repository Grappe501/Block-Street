import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import { withKnowledgeOptimizationApi } from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, (apiCtx) =>
      knowledgeOptimizationService.buildExecutiveBrief(apiCtx.institution_id)
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/institutional-learning/executive-brief" }
);
