import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import { withKnowledgeOptimizationApi } from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, (apiCtx) => ({
      portfolio: knowledgeOptimizationService.getOverview(apiCtx.institution_id),
      executive_brief: knowledgeOptimizationService.buildExecutiveBrief(apiCtx.institution_id),
      individual_human_ranking: null,
      advisory_only: true,
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/institutional-learning/improvement-portfolio" }
);
