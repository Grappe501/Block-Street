import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { operationalMissionIdFromPath, withOperationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOperationsApi(ctx, request, () => {
      const id = operationalMissionIdFromPath(request);
      return { mission: operationsApplicationService.getOperationalMission(id) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/operations/missions/[id]" }
);

export const PATCH = withApiGateway(
  async (ctx, request) =>
    withOperationsApi(ctx, request, async () => {
      const id = operationalMissionIdFromPath(request);
      const body = (await request.json()) as {
        title?: string;
        description?: string;
        purpose?: string;
        desired_outcome?: string;
        target_completion?: string;
        priority?: "critical" | "high" | "medium" | "low" | "future";
      };
      return { mission: operationsApplicationService.updateMission(id, body) };
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/operations/missions/[id]" }
);
