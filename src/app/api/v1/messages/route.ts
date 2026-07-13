import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCommunicationsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, (apiCtx) => {
      const threadId = request.nextUrl.searchParams.get("thread_id") ?? undefined;
      const conversationId = request.nextUrl.searchParams.get("conversation_id") ?? undefined;
      return { messages: operationsApplicationService.listMessages(apiCtx.institution_id, { threadId, conversationId }) };
    }),
  { permission: "communications.view", endpoint: "/api/v1/messages" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationsApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        conversation_id: string;
        thread_id: string;
        body: string;
        mentions?: string[];
        classification?: string;
      };
      return operationsApplicationService.postMessage({
        institution_id: apiCtx.institution_id,
        conversation_id: body.conversation_id,
        thread_id: body.thread_id,
        author_human_id: apiCtx.actor_human_id,
        body: body.body,
        mentions: body.mentions,
        classification: body.classification as "discussion" | undefined,
      });
    }),
  { permission: "communications.manage", endpoint: "/api/v1/messages" }
);
