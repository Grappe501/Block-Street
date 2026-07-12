import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getInviteAncestry, getInviteTree } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id") ?? ctx.actor_id;
    if (!userId) throw new Error("user_id is required");
    const mode = request.nextUrl.searchParams.get("mode") ?? "tree";
    const depth = Number(request.nextUrl.searchParams.get("depth") ?? "3");
    if (mode === "ancestry") {
      return apiSuccess(getInviteAncestry(userId), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    return apiSuccess(getInviteTree(userId, depth), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/invite-tree" }
);
