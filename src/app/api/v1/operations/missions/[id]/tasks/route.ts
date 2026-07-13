import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { operationalMissionIdFromPath, withOperationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withOperationsApi(ctx, request, async (apiCtx) => {
      const id = operationalMissionIdFromPath(request);
      const body = (await request.json()) as { title: string; description: string; owner?: string };
      return operationsApplicationService.createMissionTask({
        mission_id: id,
        title: body.title,
        description: body.description,
        owner: body.owner ?? apiCtx.actor_human_id,
      });
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/operations/missions/[id]/tasks" }
);
