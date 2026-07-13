import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        title: string;
        content_type: string;
        summary: string;
        visibility: string;
        permissions?: string[];
        approved_by_human: boolean;
      };
      return livingIntelligenceApplicationService.publishFederationKnowledge({
        owner_institution_id: apiCtx.institution_id,
        publisher_institution_id: apiCtx.institution_id,
        title: body.title,
        content_type: body.content_type as Parameters<
          typeof livingIntelligenceApplicationService.publishFederationKnowledge
        >[0]["content_type"],
        summary: body.summary,
        visibility: body.visibility as Parameters<
          typeof livingIntelligenceApplicationService.publishFederationKnowledge
        >[0]["visibility"],
        permissions: body.permissions,
        approved_by_human: body.approved_by_human,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/federation/knowledge/publish" }
);
