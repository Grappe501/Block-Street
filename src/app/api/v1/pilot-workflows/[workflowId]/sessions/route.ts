import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createSession } from "@/lib/pilot/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const workflowId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as {
      program_id: string;
      participant_id: string;
      observer_id: string;
      device_type?: string;
    };
    try {
      const session = createSession({
        program_id: body.program_id,
        workflow_id: workflowId,
        participant_id: body.participant_id,
        observer_id: body.observer_id ?? ctx.actor_id ?? "observer",
        device_type: body.device_type ?? "desktop",
      });
      return apiSuccess({ session }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Session creation failed", 400);
    }
  },
  { permission: "pilot.observe", endpoint: "/api/v1/pilot-workflows/{workflowId}/sessions" }
);
