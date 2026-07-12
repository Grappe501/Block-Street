import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createSupportRequest, resolveSupportRequest } from "@/lib/operations/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      action?: string;
      request_id?: string;
      institution_id: string;
      user_id?: string;
      subject?: string;
      description?: string;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "resolve" && body.request_id) {
        return apiSuccess({ request: resolveSupportRequest(body.request_id, actorId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      const req = createSupportRequest({
        institution_id: body.institution_id,
        user_id: body.user_id ?? actorId,
        subject: body.subject ?? "Support request",
        description: body.description ?? "",
        actor_id: actorId,
      });
      return apiSuccess({ request: req, routing_note: `Auto-classified as ${req.category} → ${req.tier}` }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Support action failed", 400);
    }
  },
  { permission: "operations.support", endpoint: "/api/v1/operations/support" }
);
