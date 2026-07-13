import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        partner_institution_id: string;
        knowledge_sharing?: boolean;
        mission_sharing?: boolean;
        volunteer_sharing?: boolean;
        resource_sharing?: boolean;
        research_sharing?: boolean;
        calendar_sharing?: boolean;
        emergency_cooperation?: boolean;
        approved_by_human: boolean;
      };
      return livingIntelligenceApplicationService.updateFederationTrust({
        institution_id: apiCtx.institution_id,
        ...body,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/federation/trust/update" }
);
