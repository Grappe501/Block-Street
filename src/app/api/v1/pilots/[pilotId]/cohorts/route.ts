import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { addParticipant, createCohort } from "@/lib/pilot/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const pilotId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as {
      action: string;
      name?: string;
      cohort_type?: string;
      cohort_id?: string;
      user_id?: string;
      role_id?: string;
      experience_level?: string;
      device_profile?: string;
    };
    try {
      if (body.action === "create_cohort" && body.name) {
        const cohort = createCohort(pilotId, body.name, body.cohort_type ?? "reference_operators", ctx.actor_id ?? "system");
        return apiSuccess({ cohort }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
      }
      if (body.action === "add_participant" && body.cohort_id && body.user_id) {
        const participant = addParticipant(
          body.cohort_id,
          body.user_id,
          body.role_id ?? "role-organizer",
          body.experience_level ?? "experienced",
          body.device_profile ?? "desktop"
        );
        return apiSuccess({ participant }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
      }
      throw new Error("Unknown cohort action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Cohort action failed", 400);
    }
  },
  { permission: "pilot.manage", endpoint: "/api/v1/pilots/{pilotId}/cohorts" }
);
