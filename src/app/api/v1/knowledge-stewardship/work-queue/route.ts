import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import { withKnowledgeOptimizationApi } from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, (apiCtx) => ({
      work_queue: knowledgeOptimizationService.getStewardQueue(apiCtx.institution_id),
      advisory_only: true,
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/knowledge-stewardship/work-queue" }
);
