import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { MissionExecutionError } from "@/lib/civic-action/builds/11.6/execution/services/mission-execution-service";
import { operationalMissionIdFromPath, withOperationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withOperationsApi(ctx, request, async (apiCtx) => {
      const id = operationalMissionIdFromPath(request);
      try {
        return operationsApplicationService.completeMission(id, apiCtx.actor_human_id);
      } catch (e) {
        if (e instanceof MissionExecutionError) {
          throw new ApiError(e.code, e.message, 400);
        }
        throw e;
      }
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/operations/missions/[id]/complete" }
);
