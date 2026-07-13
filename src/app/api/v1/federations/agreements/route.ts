import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withFederationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withFederationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        federation_id: string;
        agreement_type: string;
        title: string;
        parties: string[];
        terms: string;
      };
      return operationsApplicationService.createFederationAgreement({
        federation_id: body.federation_id,
        agreement_type: body.agreement_type as Parameters<typeof operationsApplicationService.createFederationAgreement>[0]["agreement_type"],
        title: body.title,
        parties: body.parties,
        terms: body.terms,
        signed_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "federation.manage", endpoint: "/api/v1/federations/agreements" }
);
