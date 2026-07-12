import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  approveLaunchPlan,
  completeLaunchStage,
  createLaunchPlan,
  rollbackLaunchStage,
  startLaunchStage,
} from "@/lib/identity-trust/wave7/launch";
import { loadLaunchPlans } from "@/lib/identity-trust/wave7/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const planId = request.nextUrl.searchParams.get("planId");
    if (planId) {
      const plan = loadLaunchPlans().find((p) => p.id === planId);
      return apiSuccess(plan ?? null, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(loadLaunchPlans(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-launch/plans" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      plan_id?: string;
      stage_id?: string;
      name?: string;
    };

    if (body.action === "approve" && body.plan_id) {
      return apiSuccess(approveLaunchPlan(body.plan_id, ctx.actor_id ?? "system"), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (body.action === "start_stage" && body.plan_id && body.stage_id) {
      return apiSuccess(startLaunchStage(body.plan_id, body.stage_id), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (body.action === "complete_stage" && body.plan_id && body.stage_id) {
      return apiSuccess(completeLaunchStage(body.plan_id, body.stage_id), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (body.action === "rollback_stage" && body.plan_id && body.stage_id) {
      return apiSuccess(rollbackLaunchStage(body.plan_id, body.stage_id), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }

    return apiSuccess(createLaunchPlan(body.name ?? "ITL Controlled Launch"), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-launch/plans" }
);
