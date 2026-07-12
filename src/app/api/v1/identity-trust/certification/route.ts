import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { runIdentityCertification } from "@/lib/identity-trust/certification";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(runIdentityCertification(ctx.actor_id ?? "system"), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/certification" }
);

export const POST = withApiGateway(
  async (ctx) =>
    apiSuccess(runIdentityCertification(ctx.actor_id!), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/certification" }
);
