import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { opsInstitutionIdFromPath, withOrganizationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOrganizationApi(ctx, request, () => {
      const id = opsInstitutionIdFromPath(request);
      return { institution: operationsApplicationService.getOpsInstitution(id) };
    }),
  { permission: "organization.view", endpoint: "/api/v1/operations/institutions/[id]" }
);
