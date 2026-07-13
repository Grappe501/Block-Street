import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        resource_type: string;
        description: string;
        shared_with: string[];
        approved_by_human: boolean;
      };
      return livingIntelligenceApplicationService.shareFederationResource({
        owner_institution_id: apiCtx.institution_id,
        resource_type: body.resource_type as Parameters<
          typeof livingIntelligenceApplicationService.shareFederationResource
        >[0]["resource_type"],
        description: body.description,
        shared_with: body.shared_with,
        authorized_by: apiCtx.human_id,
        approved_by_human: body.approved_by_human,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/federation/institution/share" }
);
