import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createSuccessionPlan, listSuccessionPlans } from "@/lib/leadership/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ succession_plans: listSuccessionPlans(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "leadership.view", endpoint: "/api/v1/leadership/succession" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      role: string;
      current_leader_id: string;
      candidate_user_ids: string[];
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      const plan = createSuccessionPlan({ ...body, actor_id: actorId });
      return apiSuccess({ plan }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Succession plan failed", 400);
    }
  },
  { permission: "leadership.manage", endpoint: "/api/v1/leadership/succession" }
);
