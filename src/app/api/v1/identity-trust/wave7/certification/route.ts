import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { runWave7Certification } from "@/lib/identity-trust/wave7/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(runWave7Certification(ctx.actor_id ?? "system"), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/wave7/certification" }
);

export const POST = withApiGateway(
  async (ctx) =>
    apiSuccess(runWave7Certification(ctx.actor_id ?? "system"), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/wave7/certification" }
);
