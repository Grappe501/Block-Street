import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { updatePublicIdentity } from "@/lib/identity-trust/engine";

export const PATCH = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const userId = (body.user_id as string) ?? ctx.actor_id;
    if (!userId) throw new Error("user_id is required");
    const identity = updatePublicIdentity(userId, {
      public_name: body.public_name as string | undefined,
      display_name: body.display_name as string | undefined,
      legal_name: body.legal_name as string | undefined,
      known_alias_approved: body.known_alias_approved as boolean | undefined,
    });
    return apiSuccess(identity, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/identity" }
);
