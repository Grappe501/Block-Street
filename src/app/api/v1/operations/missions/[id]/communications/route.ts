import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { operationalMissionIdFromPath, withOperationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOperationsApi(ctx, request, () => {
      const id = operationalMissionIdFromPath(request);
      return { communications: operationsApplicationService.getMissionCommunications(id) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/operations/missions/[id]/communications" }
);
