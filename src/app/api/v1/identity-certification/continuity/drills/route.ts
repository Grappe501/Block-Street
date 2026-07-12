import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { completeContinuityDrill, listContinuityDrills, startContinuityDrill } from "@/lib/identity-trust/wave7/continuity";

export const GET = withApiGateway(
  async (ctx, request) => {
    const drillId = request.nextUrl.searchParams.get("drillId");
    if (drillId) {
      const drill = listContinuityDrills().find((d) => d.id === drillId);
      return apiSuccess(drill ?? null, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(listContinuityDrills(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/continuity/drills" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      drill_id?: string;
      scenario?: string;
      observed_result?: string;
      passed?: boolean;
      recovery_time_ms?: number;
    };
    if (body.action === "complete" && body.drill_id) {
      return apiSuccess(
        completeContinuityDrill(body.drill_id, body.observed_result ?? "completed", body.passed ?? true, body.recovery_time_ms),
        { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
      );
    }
    return apiSuccess(startContinuityDrill(body.scenario ?? "identity_service_outage"), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/continuity/drills" }
);
