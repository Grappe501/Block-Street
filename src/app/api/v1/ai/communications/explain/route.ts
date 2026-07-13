import { withApiGateway } from "@/lib/api/http";
import { communicationIntelligenceService } from "@/lib/civic-action/builds/11.7/intelligence";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.7/intelligence/api-context";

/** AI read-only explain — no mutation endpoints */
export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        topic?: string;
        conversation_id?: string;
        initiative_id?: string;
      };
      const intelCtx = toIntelligenceContext(apiCtx, {
        initiativeId: body.initiative_id,
        conversationId: body.conversation_id,
      });
      return communicationIntelligenceService.explain(body.topic ?? "", intelCtx);
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/communications/explain" }
);
