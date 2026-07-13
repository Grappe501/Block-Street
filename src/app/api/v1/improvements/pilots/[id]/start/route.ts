import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import {
  improvementIdFromPath,
  withKnowledgeOptimizationApi,
} from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, () => {
      const id = improvementIdFromPath(request, "pilots");
      const pilot = knowledgeOptimizationService.startPilot(id);
      return { pilot, advisory_only: true };
    }),
  { permission: "civic_action.edit", endpoint: "/api/v1/improvements/pilots/[id]/start" }
);
