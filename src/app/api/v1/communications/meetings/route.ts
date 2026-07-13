import { withApiGateway } from "@/lib/api/http";
import { createMeeting, queryMeetingCollection } from "@/lib/civic-action/builds/11.7/api";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const initiativeId = request.nextUrl.searchParams.get("initiative_id") ?? undefined;
      return { items: queryMeetingCollection(apiCtx, initiativeId) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/communications/meetings" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown>;
        return createMeeting(apiCtx, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/communications/meetings" }
);
