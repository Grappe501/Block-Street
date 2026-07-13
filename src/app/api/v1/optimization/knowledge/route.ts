import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import { withKnowledgeOptimizationApi } from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, (apiCtx) => ({
      optimization: knowledgeOptimizationService.getOverview(apiCtx.institution_id),
      executive_brief: knowledgeOptimizationService.buildExecutiveBrief(apiCtx.institution_id),
      steward_queue: knowledgeOptimizationService.getStewardQueue(apiCtx.institution_id),
      advisory_only: true,
      canonical_mutation_allowed: false,
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/knowledge" }
);
