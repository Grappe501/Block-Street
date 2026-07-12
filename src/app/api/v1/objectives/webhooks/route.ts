import { withApiGateway } from "@/lib/api/http";
import { createWebhookSubscription } from "@/lib/civic-action/builds/11.2/integrations/webhook-delivery";
import { readStoreSlice } from "@/lib/civic-action/builds/11.2/services/repository";
import type { ObjectiveWebhookSubscription } from "@/lib/civic-action/builds/11.2/integrations/webhook-delivery";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const subs = readStoreSlice<ObjectiveWebhookSubscription>("objective_webhook_subscriptions").filter(
        (s) => s.institution_id === apiCtx.institution_id
      );
      return subs.map((s) => ({ ...s, secret_reference: "[redacted]" }));
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/objectives/webhooks" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          consumer_name?: string;
          destination?: string;
          event_types?: string[];
        };
        const created = createWebhookSubscription({
          institution_id: apiCtx.institution_id,
          consumer_name: body.consumer_name ?? "external_consumer",
          destination: body.destination ?? "",
          event_types: body.event_types ?? ["execution.mission_completed"],
          event_versions: [1],
          status: "active",
          created_by: apiCtx.actor_human_id,
          expires_at: null,
        });
        return {
          subscription: { ...created.subscription, secret_reference: "[redacted]" },
          signing_secret: created.signing_secret,
        };
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/objectives/webhooks" }
);
