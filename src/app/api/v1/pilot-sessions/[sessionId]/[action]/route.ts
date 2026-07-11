import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { completeSession, createSession, recordHelpEvent, recordObservation, startSession } from "@/lib/pilot/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const sessionId = request.nextUrl.pathname.split("/")[4] ?? "";
    const action = request.nextUrl.pathname.split("/")[5] ?? "";
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const actorId = ctx.actor_id ?? "system";
    try {
      if (action === "start") {
        return apiSuccess({ session: startSession(sessionId, actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (action === "complete") {
        return apiSuccess(
          { session: completeSession(sessionId, (body.outcome as "success" | "failure") ?? "success", actorId) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      if (action === "observations") {
        return apiSuccess(
          {
            observation: recordObservation(sessionId, {
              observation_type: String(body.observation_type ?? "hesitation"),
              workflow_step: String(body.workflow_step ?? ""),
              participant_statement: String(body.participant_statement ?? ""),
              severity: String(body.severity ?? "moderate"),
              observer_notes: String(body.observer_notes ?? ""),
            }),
          },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
          201
        );
      }
      if (action === "help-events") {
        return apiSuccess(
          {
            help_event: recordHelpEvent(sessionId, {
              help_type: String(body.help_type ?? "navigation"),
              severity: (body.severity as "H1" | "H2" | "H3" | "H4") ?? "H2",
              workflow_step: String(body.workflow_step ?? ""),
              question_asked: String(body.question_asked ?? ""),
              help_provided: String(body.help_provided ?? ""),
            }),
          },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
          201
        );
      }
      throw new Error("Unknown session action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Session action failed", 400);
    }
  },
  { permission: "pilot.observe", endpoint: "/api/v1/pilot-sessions/{sessionId}/{action}" }
);
