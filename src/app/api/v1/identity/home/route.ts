import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getEnrichedIdentityHome } from "@/lib/july14/home";
import { getNextAction, getIdentityTimeline } from "@/lib/identity-trust/wave6/home";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode") ?? "home";
    const humanId = ctx.actor_id!;

    if (mode === "timeline") {
      return apiSuccess(getIdentityTimeline(humanId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (mode === "next-action") {
      return apiSuccess(getNextAction(humanId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(getEnrichedIdentityHome(humanId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/home" }
);
