import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withFederationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withFederationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { federation_id: string; institution_id?: string };
      return operationsApplicationService.joinFederation({
        federation_id: body.federation_id,
        institution_id: body.institution_id ?? apiCtx.institution_id,
      });
    }),
  { permission: "federation.manage", endpoint: "/api/v1/federations/join" }
);
