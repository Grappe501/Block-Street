import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import {
  improvementIdFromPath,
  withKnowledgeOptimizationApi,
} from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, (apiCtx) => {
      const id = improvementIdFromPath(request, "improvements");
      knowledgeOptimizationService.transitionProposal(id, "approved_for_adoption");
      const result = knowledgeOptimizationService.implementApproved(
        id,
        apiCtx.actor_human_id,
        apiCtx.effective_permissions
      );
      return { ...result, advisory_only: true };
    }),
  { permission: "civic_action.edit", endpoint: "/api/v1/improvements/[id]/implement" }
);
