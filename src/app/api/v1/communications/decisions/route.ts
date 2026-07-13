import { withApiGateway } from "@/lib/api/http";
import { recordDecision, queryDecisionCollection } from "@/lib/civic-action/builds/11.7/api";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";
import { ApiError } from "@/lib/api/errors";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const initiativeId = request.nextUrl.searchParams.get("initiative_id") ?? undefined;
      return { items: queryDecisionCollection(apiCtx, initiativeId) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/communications/decisions" }
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
        return recordDecision(apiCtx, initiativeId, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/communications/decisions" }
);
