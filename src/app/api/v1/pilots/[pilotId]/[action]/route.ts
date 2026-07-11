import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { advancePhase, attachWorkflowCatalog, getPilotProgram, startPilot, validateReadiness } from "@/lib/pilot/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const pilotId = request.nextUrl.pathname.split("/")[4] ?? "";
    try {
      return apiSuccess(getPilotProgram(pilotId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("NOT_FOUND", e instanceof Error ? e.message : "Pilot not found", 404);
    }
  },
  { permission: "pilot.view", endpoint: "/api/v1/pilots/{pilotId}" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const parts = request.nextUrl.pathname.split("/");
    const pilotId = parts[4] ?? "";
    const action = parts[5] ?? "";
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const actorId = ctx.actor_id ?? "system";
    try {
      if (action === "start") {
        return apiSuccess({ program: startPilot(pilotId, actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (action === "workflows") {
        return apiSuccess({ workflows: attachWorkflowCatalog(pilotId, actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (action === "readiness") {
        return apiSuccess(validateReadiness(pilotId, actorId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (action === "advance-phase") {
        return apiSuccess({ program: advancePhase(pilotId, actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      throw new Error("Unknown pilot action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Pilot action failed", 400);
    }
  },
  { permission: "pilot.manage", endpoint: "/api/v1/pilots/{pilotId}/{action}" }
);
