import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { completeChecklistItem } from "@/lib/onboarding/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const journeyId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { item_key: string };
    try {
      const item = completeChecklistItem(journeyId, body.item_key, ctx.actor_id ?? "system");
      return apiSuccess({ item }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Checklist update failed", 400);
    }
  },
  { permission: "onboarding.manage", endpoint: "/api/v1/onboarding/journeys/{journeyId}/checklist" }
);
