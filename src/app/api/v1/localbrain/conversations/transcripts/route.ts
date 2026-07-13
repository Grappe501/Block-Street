import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) => {
      const url = new URL(request.url);
      const conversationId = url.searchParams.get("conversation_id");
      return livingIntelligenceApplicationService.listTranscripts(apiCtx.human_id, conversationId ?? undefined);
    }),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/conversations/transcripts" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        conversation_id: string;
        content: string;
        transcript_type?: string;
      };
      return livingIntelligenceApplicationService.transcribeConversation({
        conversation_id: body.conversation_id,
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        content: body.content,
        transcript_type: body.transcript_type as "verbatim" | "readable" | undefined,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/conversations/transcripts" }
);
