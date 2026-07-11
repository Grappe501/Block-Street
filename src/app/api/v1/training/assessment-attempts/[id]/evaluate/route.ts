import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { evaluateAttempt } from "@/lib/training/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const attemptId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { passed: boolean; rubric_notes?: string };
    try {
      const attempt = evaluateAttempt(attemptId, ctx.actor_id ?? "system", body.passed, body.rubric_notes ?? "");
      return apiSuccess({ attempt }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Evaluation failed", 400);
    }
  },
  { permission: "training.evaluate", endpoint: "/api/v1/training/assessment-attempts/{id}/evaluate" }
);
