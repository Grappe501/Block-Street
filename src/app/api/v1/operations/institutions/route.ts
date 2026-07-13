import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOrganizationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOrganizationApi(ctx, request, (apiCtx) => {
      const federationId = request.nextUrl.searchParams.get("federation_id") ?? undefined;
      return { institutions: operationsApplicationService.listOpsInstitutions(federationId) };
    }),
  { permission: "organization.view", endpoint: "/api/v1/operations/institutions" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withOrganizationApi(ctx, request, async () => {
      const body = (await request.json()) as {
        legal_name: string;
        public_name: string;
        short_name: string;
        institution_type: string;
        governance_model: string;
        mission_statement: string;
        vision_statement: string;
        federation_id?: string;
      };
      return operationsApplicationService.createOpsInstitution({
        legal_name: body.legal_name,
        public_name: body.public_name,
        short_name: body.short_name,
        institution_type: body.institution_type as "nonprofit",
        governance_model: body.governance_model as "board",
        mission_statement: body.mission_statement,
        vision_statement: body.vision_statement,
        federation_id: body.federation_id,
      });
    }),
  { permission: "organization.manage", endpoint: "/api/v1/operations/institutions" }
);
