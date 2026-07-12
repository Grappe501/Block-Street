import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listDriftFindings, resolveDriftFinding, scanConstitutionalDrift } from "@/lib/identity-trust/wave7/drift";

export const GET = withApiGateway(
  async (ctx, request) => {
    const status = request.nextUrl.searchParams.get("status") as "open" | "resolved" | "accepted" | null;
    return apiSuccess(listDriftFindings(status ?? undefined), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/drift" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as { action?: string; finding_id?: string };
    if (body.action === "resolve" && body.finding_id) {
      return apiSuccess(resolveDriftFinding(body.finding_id), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    return apiSuccess(scanConstitutionalDrift(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/drift" }
);
