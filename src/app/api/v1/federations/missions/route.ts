import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withFederationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withFederationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        federation_id: string;
        title: string;
        supporting_institution_ids?: string[];
        mission_owners?: string[];
      };
      return operationsApplicationService.createFederationSharedMission({
        federation_id: body.federation_id,
        title: body.title,
        lead_institution_id: apiCtx.institution_id,
        supporting_institution_ids: body.supporting_institution_ids ?? [],
        mission_owners: body.mission_owners ?? [apiCtx.actor_human_id],
      });
    }),
  { permission: "federation.manage", endpoint: "/api/v1/federations/missions" }
);
