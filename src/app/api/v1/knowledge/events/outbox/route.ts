import { withApiGateway } from "@/lib/api/http";
import { publishPendingKnowledgeOutboxEvents } from "@/lib/civic-action/builds/11.12/events/outbox-publisher";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(
      ctx,
      request,
      async () => {
        const body = (await request.json().catch(() => ({}))) as { limit?: number };
        return publishPendingKnowledgeOutboxEvents(body.limit ?? 50);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge/events/outbox" }
);
