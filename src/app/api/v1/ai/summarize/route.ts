import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCommunicationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, async () => {
      const body = (await request.json()) as { conversation_id: string };
      return operationsApplicationService.summarizeConversation(body.conversation_id);
    }),
  { permission: "communications.view", endpoint: "/api/v1/ai/summarize" }
);
