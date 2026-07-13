import { withApiGateway } from "@/lib/api/http";
import { createConversation, queryConversationCollection } from "@/lib/civic-action/builds/11.7/api";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return queryConversationCollection(apiCtx, {
        initiative_id: sp.get("initiative_id") ?? undefined,
        institution_id: sp.get("institution_id") ?? undefined,
        status: sp.get("status") ?? undefined,
        context_type: sp.get("context_type") ?? undefined,
        mission_id: sp.get("mission_id") ?? undefined,
        search: sp.get("search") ?? sp.get("q") ?? undefined,
        cursor: sp.get("cursor") ?? undefined,
        limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/communications" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown>;
        return createConversation(apiCtx, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/communications" }
);
