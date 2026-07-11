import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { loadHelpEvents, loadObservations, loadSessions } from "@/lib/pilot/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const sessionId = request.nextUrl.pathname.split("/")[4] ?? "";
    const session = loadSessions().find((s) => s.id === sessionId);
    if (!session) throw new ApiError("NOT_FOUND", "Session not found", 404);
    return apiSuccess(
      {
        session,
        help_events: loadHelpEvents().filter((h) => h.pilot_session_id === sessionId),
        observations: loadObservations().filter((o) => o.pilot_session_id === sessionId),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "pilot.view", endpoint: "/api/v1/pilot-sessions/{sessionId}" }
);
