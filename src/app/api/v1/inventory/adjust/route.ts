import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResourcesApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withResourcesApi(ctx, request, async () => {
      const body = (await request.json()) as {
        inventory_id: string;
        quantity_delta: number;
        reason: string;
        recorded_by: string;
      };
      return operationsApplicationService.adjustInventory(body);
    }),
  { permission: "resources.manage", endpoint: "/api/v1/inventory/adjust" }
);
