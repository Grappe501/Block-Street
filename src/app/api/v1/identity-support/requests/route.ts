import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  createSupportRequest,
  listSupportRequests,
  assignSupportRequest,
  resolveSupportRequest,
  escalateSupportRequest,
  SUPPORT_OPERATOR_PROHIBITED,
} from "@/lib/identity-trust/wave6/support";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mine = request.nextUrl.searchParams.get("mine") === "true";
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    return apiSuccess(
      listSupportRequests(mine ? { human_id: ctx.actor_id! } : status ? { status } : undefined),
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-support/requests" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string | undefined;

    if (action === "assign") {
      return apiSuccess(assignSupportRequest(body.request_id as string, ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "resolve") {
      return apiSuccess(resolveSupportRequest(body.request_id as string, ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (action === "escalate") {
      return apiSuccess(escalateSupportRequest(body.request_id as string, ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }

    const req = createSupportRequest({
      human_id: ctx.actor_id ?? undefined,
      institution_id: body.institution_id as string | undefined,
      category: body.category as string,
      description: body.description as string,
      related_invitation_id: body.related_invitation_id as string | undefined,
      related_case_id: body.related_case_id as string | undefined,
      severity: body.severity as "low" | "normal" | "high" | "urgent" | undefined,
    });
    return apiSuccess({ request: req, operator_prohibited: SUPPORT_OPERATOR_PROHIBITED }, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-support/requests" }
);
