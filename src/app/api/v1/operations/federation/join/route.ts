import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOrganizationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withOrganizationApi(ctx, request, async () => {
      const body = (await request.json()) as { federation_id: string; institution_id: string };
      return operationsApplicationService.joinFederation({
        federation_id: body.federation_id,
        institution_id: body.institution_id,
      });
    }),
  { permission: "organization.manage", endpoint: "/api/v1/operations/federation/join" }
);
