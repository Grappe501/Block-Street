import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResourcesApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withResourcesApi(ctx, request, (apiCtx) => {
      const missionId = request.nextUrl.searchParams.get("mission_id") ?? undefined;
      return { assets: operationsApplicationService.listAssets(apiCtx.institution_id, missionId) };
    }),
  { permission: "resources.view", endpoint: "/api/v1/assets" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withResourcesApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        resource_type: string;
        category: string;
        sub_category: string;
        name: string;
        description: string;
        ownership_type: string;
        steward_human_id: string;
        mission_id?: string;
        purchase_price?: number;
      };
      return operationsApplicationService.createAsset({
        institution_id: apiCtx.institution_id,
        resource_type: body.resource_type,
        category: body.category as "equipment",
        sub_category: body.sub_category,
        name: body.name,
        description: body.description,
        ownership_type: body.ownership_type as "institution_owned",
        steward_human_id: body.steward_human_id,
        mission_id: body.mission_id,
        purchase_price: body.purchase_price,
      });
    }),
  { permission: "resources.manage", endpoint: "/api/v1/assets" }
);
