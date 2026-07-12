import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadCertificationRuns } from "@/lib/identity-trust/wave7/data";
import { runWave7Certification, startCertificationRun } from "@/lib/identity-trust/wave7/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.searchParams.get("certificationId");
    if (id) {
      const run = loadCertificationRuns().find((r) => r.id === id);
      return apiSuccess(run ?? null, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(loadCertificationRuns(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/runs" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as { action?: string };
    const actorId = ctx.actor_id ?? "system";
    if (body.action === "full") {
      return apiSuccess(runWave7Certification(actorId), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    return apiSuccess(startCertificationRun(actorId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/runs" }
);
