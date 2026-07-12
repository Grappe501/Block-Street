import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getFederationHealthSummary, runSecurityIsolationAudit } from "@/lib/federation/engine";

export const GET = withApiGateway(
  async (ctx) => {
    return apiSuccess({ health: getFederationHealthSummary() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.view", endpoint: "/api/v1/federation/analytics" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as { action?: string; institution_ids?: string[] };
    const actorId = ctx.actor_id ?? "system";
    if (body.action === "security_audit" && body.institution_ids) {
      const audit = runSecurityIsolationAudit(body.institution_ids, actorId);
      return apiSuccess({ audit, health: getFederationHealthSummary() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess({ health: getFederationHealthSummary() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.manage", endpoint: "/api/v1/federation/analytics" }
);
