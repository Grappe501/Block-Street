import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        channel: string;
        title: string;
        participants: string[];
        mission_id?: string;
        consent_status: string;
        source: string;
        evidence_links?: string[];
      };
      return livingIntelligenceApplicationService.importConversation({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        channel: body.channel as Parameters<typeof livingIntelligenceApplicationService.importConversation>[0]["channel"],
        title: body.title,
        participants: body.participants,
        mission_id: body.mission_id,
        consent_status: body.consent_status as Parameters<
          typeof livingIntelligenceApplicationService.importConversation
        >[0]["consent_status"],
        source: body.source,
        evidence_links: body.evidence_links,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/conversations/import" }
);
