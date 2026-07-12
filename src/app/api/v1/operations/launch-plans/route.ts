import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { approveLaunchPlan, completeRollout, createLaunchPlan, listLaunchPlans, rollbackLaunch, startRollout } from "@/lib/operations/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ launch_plans: listLaunchPlans(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "operations.view", endpoint: "/api/v1/operations/launch-plans" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      name: string;
      strategy?: string;
      target_scope: string;
      action?: string;
      plan_id?: string;
      rollout_percent?: number;
      reason?: string;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "approve" && body.plan_id) {
        return apiSuccess({ plan: approveLaunchPlan(body.plan_id, actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "rollout" && body.plan_id) {
        return apiSuccess({ plan: startRollout(body.plan_id, actorId, body.rollout_percent ?? 25) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "complete" && body.plan_id) {
        return apiSuccess({ plan: completeRollout(body.plan_id, actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (body.action === "rollback" && body.plan_id) {
        return apiSuccess({ plan: rollbackLaunch(body.plan_id, body.reason ?? "Rollback triggered", actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      const plan = createLaunchPlan({
        institution_id: body.institution_id,
        name: body.name,
        strategy: (body.strategy as "single_campus") ?? "single_campus",
        target_scope: body.target_scope,
        actor_id: actorId,
      });
      return apiSuccess({ plan }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Launch plan action failed", 400);
    }
  },
  { permission: "operations.launch", endpoint: "/api/v1/operations/launch-plans" }
);
