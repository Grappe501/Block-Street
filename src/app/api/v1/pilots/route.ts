import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createPilotProgram, listPilotPrograms } from "@/lib/pilot/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ pilots: listPilotPrograms(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "pilot.view", endpoint: "/api/v1/pilots" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      name: string;
      description: string;
      phase?: "A" | "B" | "C" | "D";
      pilot_owner_user_id: string;
      observation_lead_user_id: string;
    };
    try {
      const program = createPilotProgram({
        institution_id: body.institution_id,
        name: body.name,
        description: body.description,
        phase: body.phase ?? "A",
        pilot_owner_user_id: body.pilot_owner_user_id,
        observation_lead_user_id: body.observation_lead_user_id,
        actor_id: ctx.actor_id ?? "system",
      });
      return apiSuccess({ program }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Pilot creation failed", 400);
    }
  },
  { permission: "pilot.manage", endpoint: "/api/v1/pilots" }
);
