import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import {
  improvementIdFromPath,
  withKnowledgeOptimizationApi,
} from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, async (apiCtx) => {
      const id = improvementIdFromPath(request, "improvements");
      const body = (await request.json()) as { outcome?: string };
      const candidate = knowledgeOptimizationService.triageCandidate(
        id,
        (body.outcome as "advanced") ?? "advanced"
      );
      return { candidate, advisory_only: true };
    }),
  { permission: "civic_action.edit", endpoint: "/api/v1/improvements/[id]/triage" }
);
