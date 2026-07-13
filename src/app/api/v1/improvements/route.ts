import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import { withKnowledgeOptimizationApi } from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, (apiCtx) => ({
      candidates: knowledgeOptimizationService.listCandidates(apiCtx.institution_id),
      proposals: knowledgeOptimizationService.listProposals(apiCtx.institution_id),
      pilots: knowledgeOptimizationService.listPilots(apiCtx.institution_id),
      outcomes: knowledgeOptimizationService.listOutcomes(apiCtx.institution_id),
      optimizations: knowledgeOptimizationService.getOverview(apiCtx.institution_id).optimizations,
      advisory_only: true,
      canonical_mutation_allowed: false,
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/improvements" }
);
