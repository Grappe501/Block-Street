import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  getExecutiveOverview,
  getExecutiveReadiness,
  getExecutiveGovernanceHealth,
  getExecutiveNetworkIntegrity,
  getExecutiveHumanImpact,
  requestExecutiveAudit,
  requestExecutivePolicyReview,
} from "@/lib/identity-trust/wave6/executive";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode") ?? "overview";
    if (mode === "readiness") return apiSuccess(getExecutiveReadiness(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    if (mode === "governance") return apiSuccess(getExecutiveGovernanceHealth(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    if (mode === "network") return apiSuccess(getExecutiveNetworkIntegrity(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    if (mode === "human-impact") return apiSuccess(getExecutiveHumanImpact(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    return apiSuccess(getExecutiveOverview(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/executive/identity/overview" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string;
    if (action === "request_audit") {
      return apiSuccess(requestExecutiveAudit(ctx.actor_id!, body.purpose as string), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "request_policy_review") {
      return apiSuccess(requestExecutivePolicyReview(ctx.actor_id!, body.topic as string), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    throw new Error("Unknown action");
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/executive/identity/overview" }
);
