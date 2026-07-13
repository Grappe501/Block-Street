import { withApiGateway } from "@/lib/api/http";
import { createWebhookSubscription } from "@/lib/civic-action/builds/11.12/integrations/webhook-delivery";
import { readStoreSlice } from "@/lib/civic-action/builds/11.12/services/repository";
import type { KnowledgeWebhookSubscription } from "@/lib/civic-action/builds/11.12/integrations/webhook-delivery";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => ({
      subscriptions: readStoreSlice<KnowledgeWebhookSubscription>("knowledge_webhook_subscriptions").filter(
        (s) => s.institution_id === apiCtx.institution_id
      ),
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/knowledge/webhooks" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          consumer_name: string;
          destination: string;
          event_types: string[];
        };
        return createWebhookSubscription({
          institution_id: apiCtx.institution_id,
          consumer_name: body.consumer_name,
          destination: body.destination,
          event_types: body.event_types,
          event_versions: [1],
          status: "active",
          created_by: apiCtx.actor_human_id,
          expires_at: null,
        });
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge/webhooks" }
);
