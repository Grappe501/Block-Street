import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getVerificationStatusView } from "@/lib/identity-trust/wave2/trust-lifecycle";
import { getSafeLedgerSummary } from "@/lib/identity-trust/wave2/ledger";

export const GET = withApiGateway(
  async (ctx) => {
    const humanId = ctx.actor_id!;
    return apiSuccess(
      {
        trust: getVerificationStatusView(humanId),
        ledger_summary: getSafeLedgerSummary(humanId),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/me/trust" }
);
