import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResourcesApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withResourcesApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        mission_id?: string;
        objective_id?: string;
        item_description: string;
        estimated_cost: number;
        budget_id: string;
        requested_by: string;
      };
      return operationsApplicationService.requestPurchase({
        institution_id: apiCtx.institution_id,
        mission_id: body.mission_id,
        objective_id: body.objective_id,
        item_description: body.item_description,
        estimated_cost: body.estimated_cost,
        budget_id: body.budget_id,
        requested_by: body.requested_by,
      });
    }),
  { permission: "resources.manage", endpoint: "/api/v1/purchases" }
);
