import { withApiGateway } from "@/lib/api/http";
import { postMessage, queryMessageCollection } from "@/lib/civic-action/builds/11.7/api";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";
import { ApiError } from "@/lib/api/errors";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return queryMessageCollection(apiCtx, {
        conversation_id: sp.get("conversation_id") ?? undefined,
        thread_id: sp.get("thread_id") ?? undefined,
        initiative_id: sp.get("initiative_id") ?? undefined,
        cursor: sp.get("cursor") ?? undefined,
        limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/communications/messages" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown>;
        const initiativeId = (body.initiative_id as string) ?? request.nextUrl.searchParams.get("initiative_id") ?? "";
        if (!initiativeId) {
          throw new ApiError("VALIDATION_ERROR", "initiative_id is required", 400);
        }
        return postMessage(apiCtx, initiativeId, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/communications/messages" }
);
