import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getActiveContext, listContextHistory } from "@/lib/identity-trust/wave4/context";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      {
        context: getActiveContext(ctx.actor_id!),
        history: listContextHistory(ctx.actor_id!),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { permission: "identity_trust.view", endpoint: "/api/v1/context" }
);
