import { withApiGateway } from "@/lib/api/http";
import { knowledgeOptimizationService } from "@/lib/civic-action/builds/11.12/optimization";
import {
  improvementIdFromPath,
  withKnowledgeOptimizationApi,
} from "@/lib/civic-action/builds/11.12/optimization/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeOptimizationApi(ctx, request, async () => {
      const id = improvementIdFromPath(request, "pilots");
      const body = (await request.json()) as { reason?: "stopped" | "failed" };
      const pilot = knowledgeOptimizationService.stopPilot(id, body.reason ?? "stopped");
      return { pilot, advisory_only: true, failed_pilot_preserved: true };
    }),
  { permission: "civic_action.edit", endpoint: "/api/v1/improvements/pilots/[id]/stop" }
);
