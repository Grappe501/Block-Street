import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOrganizationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOrganizationApi(ctx, request, (apiCtx) => ({
      units: operationsApplicationService.listOrganizationUnits(apiCtx.institution_id),
    })),
  { permission: "organization.view", endpoint: "/api/v1/operations/organizations" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withOrganizationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        name: string;
        description: string;
        unit_type: string;
        parent_unit_id?: string;
        manager_human_id?: string;
      };
      return operationsApplicationService.createOrganizationUnit({
        institution_id: apiCtx.institution_id,
        name: body.name,
        description: body.description,
        unit_type: body.unit_type as "department",
        parent_unit_id: body.parent_unit_id,
        manager_human_id: body.manager_human_id,
      });
    }),
  { permission: "organization.manage", endpoint: "/api/v1/operations/organizations" }
);
