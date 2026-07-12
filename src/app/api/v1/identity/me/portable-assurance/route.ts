import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getPublicAssuranceClaims } from "@/lib/identity-trust/wave4/assurance";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getPublicAssuranceClaims(ctx.actor_id!), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/me/portable-assurance" }
);
