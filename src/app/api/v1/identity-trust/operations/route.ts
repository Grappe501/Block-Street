import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getIdentityOperationsDashboard } from "@/lib/identity-trust/operations";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getIdentityOperationsDashboard(ctx.actor_id ?? "system"), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/operations" }
);
