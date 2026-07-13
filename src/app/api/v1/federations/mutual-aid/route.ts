import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withFederationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withFederationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        federation_id: string;
        aid_type: string;
        description: string;
      };
      return operationsApplicationService.requestFederationMutualAid({
        federation_id: body.federation_id,
        requesting_institution_id: apiCtx.institution_id,
        aid_type: body.aid_type as Parameters<typeof operationsApplicationService.requestFederationMutualAid>[0]["aid_type"],
        description: body.description,
        requested_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "federation.manage", endpoint: "/api/v1/federations/mutual-aid" }
);
