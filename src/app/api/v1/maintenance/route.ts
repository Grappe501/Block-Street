import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResourcesApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withResourcesApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        resource_id: string;
        maintenance_type: "inspection" | "service" | "repair" | "warranty";
        scheduled_date: string;
        description: string;
        recorded_by: string;
      };
      return operationsApplicationService.scheduleMaintenance({
        resource_id: body.resource_id,
        institution_id: apiCtx.institution_id,
        maintenance_type: body.maintenance_type,
        scheduled_date: body.scheduled_date,
        description: body.description,
        recorded_by: body.recorded_by,
      });
    }),
  { permission: "resources.manage", endpoint: "/api/v1/maintenance" }
);
