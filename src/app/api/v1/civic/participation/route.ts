import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import {
  computeParticipationScore,
  listParticipationEvents,
  listParticipationScores,
  recordCivicHabit,
  recordParticipationEvent,
} from "@/lib/civic/engine";
import type { ParticipationEvent } from "@/lib/civic/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const communityId = request.nextUrl.searchParams.get("community_id") ?? undefined;
    return apiSuccess(
      {
        events: listParticipationEvents(institutionId, communityId),
        scores: listParticipationScores(institutionId),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "civic.view", endpoint: "/api/v1/civic/participation" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      community_id: string;
      user_id: string;
      event_type?: ParticipationEvent["event_type"];
      title?: string;
      duration_minutes?: number;
      participants_count?: number;
      action?: string;
      habit_type?: string;
      streak_weeks?: number;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "compute_score") {
        return apiSuccess(
          { score: computeParticipationScore(body.institution_id, body.community_id, actorId) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      if (body.action === "record_habit" && body.habit_type) {
        return apiSuccess(
          { habit: recordCivicHabit({ institution_id: body.institution_id, user_id: body.user_id, habit_type: body.habit_type, streak_weeks: body.streak_weeks ?? 1, actor_id: actorId }) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
          201
        );
      }
      const event = recordParticipationEvent({
        institution_id: body.institution_id,
        community_id: body.community_id,
        user_id: body.user_id,
        event_type: body.event_type ?? "community_action",
        title: body.title ?? "Civic participation",
        duration_minutes: body.duration_minutes,
        participants_count: body.participants_count,
        actor_id: actorId,
      });
      return apiSuccess({ event }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Participation action failed", 400);
    }
  },
  { permission: "civic.manage", endpoint: "/api/v1/civic/participation" }
);
