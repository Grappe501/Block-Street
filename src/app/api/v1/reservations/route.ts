import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResourcesApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withResourcesApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        resource_id: string;
        human_id: string;
        mission_id?: string;
        start_time: string;
        end_time: string;
        priority?: "low" | "normal" | "high" | "critical";
      };
      return operationsApplicationService.reserveAsset({
        resource_id: body.resource_id,
        institution_id: apiCtx.institution_id,
        human_id: body.human_id,
        mission_id: body.mission_id,
        start_time: body.start_time,
        end_time: body.end_time,
        priority: body.priority,
      });
    }),
  { permission: "resources.manage", endpoint: "/api/v1/reservations" }
);
