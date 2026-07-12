import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getSubjectCaseView } from "@/lib/identity-trust/wave3/decisions";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess({ cases: getSubjectCaseView(ctx.actor_id!) }, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/cases/me" }
);
