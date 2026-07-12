import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createLeadershipCohort, joinLeadershipCohort, listCohorts } from "@/lib/leadership/engine";
import type { LeadershipCohort } from "@/lib/leadership/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ cohorts: listCohorts(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "leadership.view", endpoint: "/api/v1/leadership/cohorts" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      name?: string;
      cohort_type?: LeadershipCohort["cohort_type"];
      mentor_ids?: string[];
      action?: string;
      cohort_id?: string;
      user_id?: string;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "join" && body.cohort_id && body.user_id) {
        return apiSuccess(
          { cohort: joinLeadershipCohort({ cohort_id: body.cohort_id, user_id: body.user_id, institution_id: body.institution_id, actor_id: actorId }) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      const cohort = createLeadershipCohort({
        institution_id: body.institution_id,
        name: body.name ?? "County Leadership Cohort",
        cohort_type: body.cohort_type ?? "county",
        mentor_ids: body.mentor_ids ?? ["director@block-street.local"],
        actor_id: actorId,
      });
      return apiSuccess({ cohort }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Cohort action failed", 400);
    }
  },
  { permission: "leadership.manage", endpoint: "/api/v1/leadership/cohorts" }
);
