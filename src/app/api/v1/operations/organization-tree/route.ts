import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOrganizationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOrganizationApi(ctx, request, (apiCtx) =>
      operationsApplicationService.getOrganizationTree(apiCtx.institution_id)
    ),
  { permission: "organization.view", endpoint: "/api/v1/operations/organization-tree" }
);
