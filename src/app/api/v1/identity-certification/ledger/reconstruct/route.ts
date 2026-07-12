import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { runLedgerReconstruction, getLedgerReconstruction } from "@/lib/identity-trust/wave7/ledger-reconstruction";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as { certification_id?: string; sample_size?: number };
    return apiSuccess(runLedgerReconstruction(body.certification_id ?? "ledger-run", body.sample_size), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/ledger/reconstruct" }
);

export const GET = withApiGateway(
  async (ctx, request) => {
    const runId = request.nextUrl.searchParams.get("runId");
    return apiSuccess(runId ? getLedgerReconstruction(runId) : null, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/ledger/reconstruct" }
);
