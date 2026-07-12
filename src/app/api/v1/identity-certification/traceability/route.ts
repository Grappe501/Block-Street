import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getTraceabilityMatrix } from "@/lib/identity-trust/wave7/requirements";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getTraceabilityMatrix(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/traceability" }
);
