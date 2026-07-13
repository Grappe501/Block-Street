import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { summarizeConversationReadOnly } from "@/lib/civic-action/builds/11.7/api";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

/** AI read-only summary — no mutation endpoints */
export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { conversation_id?: string };
      if (!body.conversation_id) {
        throw new ApiError("VALIDATION_ERROR", "conversation_id is required", 400);
      }
      const summary = summarizeConversationReadOnly(body.conversation_id, apiCtx);
      if (!summary) {
        throw new ApiError("COMMUNICATION_NOT_FOUND", "Conversation not found.", 404);
      }
      return summary;
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/communications/ai/summarize" }
);
