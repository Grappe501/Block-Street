import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { submitFeedback } from "@/lib/operations/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      user_id?: string;
      category: string;
      title: string;
      description: string;
    };
    try {
      const item = submitFeedback({
        institution_id: body.institution_id,
        user_id: body.user_id ?? ctx.actor_id ?? "system",
        category: body.category,
        title: body.title,
        description: body.description,
        actor_id: ctx.actor_id ?? "system",
      });
      return apiSuccess({ feedback: item, backlog_mapping: item.backlog_mapping }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Feedback submission failed", 400);
    }
  },
  { permission: "operations.manage", endpoint: "/api/v1/operations/feedback" }
);
