import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listAppeals, resolveAppeal, submitAppeal } from "@/lib/identity-trust/governance";

export const GET = withApiGateway(
  async (ctx, request) => {
    const status = request.nextUrl.searchParams.get("status") as Parameters<typeof listAppeals>[0];
    return apiSuccess(listAppeals(status ?? undefined), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/appeals" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "resolve") {
      const appeal = resolveAppeal({
        appeal_id: body.appeal_id as string,
        resolver_id: ctx.actor_id!,
        status: body.status as "upheld" | "denied",
        resolution: body.resolution as string,
      });
      return apiSuccess(appeal, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const appeal = submitAppeal({
      review_id: body.review_id as string,
      subject_user_id: body.subject_user_id as string,
      submitted_by: ctx.actor_id!,
      reason: body.reason as string,
    });
    return apiSuccess(appeal, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/appeals" }
);
