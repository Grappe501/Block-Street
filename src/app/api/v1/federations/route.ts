import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withFederationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withFederationApi(ctx, request, () => ({
      federations: operationsApplicationService.listFederations(),
    })),
  { permission: "federation.view", endpoint: "/api/v1/federations" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withFederationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        name: string;
        description: string;
        purpose: string;
        federation_type?: string;
      };
      return operationsApplicationService.createFederation({
        name: body.name,
        description: body.description,
        purpose: body.purpose,
        lead_institution_id: apiCtx.institution_id,
        federation_type: body.federation_type as Parameters<typeof operationsApplicationService.createFederation>[0]["federation_type"],
      });
    }),
  { permission: "federation.manage", endpoint: "/api/v1/federations" }
);
