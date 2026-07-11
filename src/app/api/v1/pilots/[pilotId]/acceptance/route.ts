import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { evaluateGate, generateLaunchRecommendation, recordEngineeringIntervention } from "@/lib/pilot/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const pilotId = request.nextUrl.pathname.split("/")[4] ?? "";
    const { loadGates, loadLaunchRecommendations } = await import("@/lib/pilot/data");
    return apiSuccess(
      {
        gates: loadGates().filter((g) => g.pilot_program_id === pilotId),
        launch_recommendation: loadLaunchRecommendations().find((r) => r.pilot_program_id === pilotId) ?? null,
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "pilot.view", endpoint: "/api/v1/pilots/{pilotId}/acceptance" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const parts = request.nextUrl.pathname.split("/");
    const pilotId = parts[4] ?? "";
    const resource = parts[5] ?? "";
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const actorId = ctx.actor_id ?? "system";
    try {
      if (resource === "acceptance-gates") {
        return apiSuccess(
          {
            gate: evaluateGate(pilotId, (body.phase as "A" | "B" | "C" | "D") ?? "A", actorId),
          },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
          201
        );
      }
      if (resource === "launch-recommendation") {
        return apiSuccess(
          { recommendation: generateLaunchRecommendation(pilotId, actorId) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
          201
        );
      }
      if (resource === "engineering-intervention") {
        recordEngineeringIntervention(pilotId, String(body.reason ?? "Technical defect"), actorId);
        return apiSuccess({ recorded: true }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      throw new Error("Unknown acceptance action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Acceptance action failed", 400);
    }
  },
  { permission: "pilot.accept", endpoint: "/api/v1/pilots/{pilotId}/acceptance" }
);
