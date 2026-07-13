import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResourcesApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withResourcesApi(ctx, request, (apiCtx) => ({
      facilities: operationsApplicationService.listFacilities(apiCtx.institution_id),
      spaces: operationsApplicationService.listSpaces(apiCtx.institution_id),
    })),
  { permission: "resources.view", endpoint: "/api/v1/facilities" }
);
