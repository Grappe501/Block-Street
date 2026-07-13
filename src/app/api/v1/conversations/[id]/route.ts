import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCommunicationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) => {
    const parts = request.nextUrl.pathname.split("/");
    const conversationId = parts[parts.indexOf("conversations") + 1] ?? "";
    return withCommunicationsApi(ctx, request, (apiCtx) => ({
      conversation: operationsApplicationService.getConversation(conversationId),
      threads: operationsApplicationService.listThreads(apiCtx.institution_id, conversationId),
      messages: operationsApplicationService.listMessages(apiCtx.institution_id, { conversationId }),
    }));
  },
  { permission: "communications.view", endpoint: "/api/v1/conversations/{id}" }
);
