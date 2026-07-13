import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        institution_id: string;
        name: string;
        jurisdiction: string;
        organization_type: string;
        governance_model: string;
        approved_by_human: boolean;
      };
      return livingIntelligenceApplicationService.joinFederation({
        human_id: apiCtx.human_id,
        institution_id: body.institution_id,
        name: body.name,
        jurisdiction: body.jurisdiction,
        organization_type: body.organization_type as Parameters<
          typeof livingIntelligenceApplicationService.joinFederation
        >[0]["organization_type"],
        governance_model: body.governance_model,
        approved_by_human: body.approved_by_human,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/federation/institution/join" }
);
