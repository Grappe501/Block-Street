import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import { withKnowledgeOptimizationApi } from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

/** AI optimization advisor — advisory only, no canonical mutation */
export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { question?: string };
      return knowledgeOptimizationService.queryAdvisor(apiCtx.institution_id, body.question ?? "");
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/knowledge/optimize" }
);
