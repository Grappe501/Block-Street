import { withApiGateway } from "@/lib/api/http";
import { apiSuccess, ApiError } from "@/lib/api/errors";
import { getIdentityMe } from "@/lib/api/gateway";

export const GET = withApiGateway(
  (ctx) => {
    const user = getIdentityMe(ctx.actor_id!);
    if (!user) throw new ApiError("RESOURCE_NOT_FOUND", "User not found.", 404);
    return apiSuccess(user, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "users.read", endpoint: "/api/v1/identity/me" }
);
