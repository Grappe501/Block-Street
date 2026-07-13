import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import {
  improvementIdFromPath,
  withKnowledgeOptimizationApi,
} from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, (apiCtx) => {
      const id = improvementIdFromPath(request, "improvements");
      const proposal = knowledgeOptimizationService.getProposal(id);
      const candidate = knowledgeOptimizationService
        .listCandidates(apiCtx.institution_id)
        .find((c) => c.improvement_candidate_id === id);
      return {
        improvement_id: id,
        candidate: candidate ?? null,
        proposal: proposal ?? null,
        advisory_only: true,
        canonical_mutation_allowed: false,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/improvements/[id]" }
);
