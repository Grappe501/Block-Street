import { withApiGateway } from "@/lib/api/http";
import { getConversationDetail } from "@/lib/civic-action/builds/11.7/api";
import { withCommunicationApi, conversationIdFromPath } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const id = conversationIdFromPath(request);
      return getConversationDetail(id, apiCtx);
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/communications/[id]" }
);
