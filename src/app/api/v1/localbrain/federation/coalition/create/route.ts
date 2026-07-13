import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        name: string;
        member_institution_ids: string[];
        charter_summary: string;
        approved_by_human: boolean;
      };
      return livingIntelligenceApplicationService.createFederationCoalition({
        name: body.name,
        lead_institution_id: apiCtx.institution_id,
        member_institution_ids: body.member_institution_ids,
        charter_summary: body.charter_summary,
        approved_by_human: body.approved_by_human,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/federation/coalition/create" }
);
