import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getEnrichedIdentityHome, getJuly14MeetingContext } from "@/lib/july14/home";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode") ?? "home";
    const humanId = ctx.actor_id!;

    if (mode === "meeting") {
      return apiSuccess(getJuly14MeetingContext(humanId), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    return apiSuccess(getEnrichedIdentityHome(humanId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/july14/home" }
);
