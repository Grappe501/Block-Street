import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createDevelopmentPlan } from "@/lib/leadership/engine";
import type { LeadershipStage } from "@/lib/leadership/types";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      user_id: string;
      institution_id: string;
      mentor_id?: string;
      target_stage?: LeadershipStage;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      const plan = createDevelopmentPlan({ ...body, actor_id: actorId });
      return apiSuccess({ plan }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Development plan failed", 400);
    }
  },
  { permission: "leadership.manage", endpoint: "/api/v1/leadership/development-plans" }
);
