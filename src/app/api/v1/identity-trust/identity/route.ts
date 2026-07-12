import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getHumanIdentity, getPublicIdentityBadge } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id");
    if (!userId) throw new Error("user_id is required");
    const publicOnly = request.nextUrl.searchParams.get("public_only") === "true";
    if (publicOnly) {
      const badge = getPublicIdentityBadge(userId);
      if (!badge) throw new Error("Identity not found");
      return apiSuccess(badge, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const identity = getHumanIdentity(userId);
    if (!identity) throw new Error("Identity not found");
    return apiSuccess(identity, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/identity" }
);
