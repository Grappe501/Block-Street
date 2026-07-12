import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { assignMentor } from "@/lib/leadership/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      mentor_id: string;
      mentee_id: string;
      institution_id: string;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      const mentorship = assignMentor({ ...body, actor_id: actorId });
      return apiSuccess({ mentorship }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Mentorship assignment failed", 400);
    }
  },
  { permission: "leadership.manage", endpoint: "/api/v1/leadership/mentorship" }
);
