import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { completeLesson } from "@/lib/training/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const lessonId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { learner_record_id: string };
    try {
      const record = completeLesson(body.learner_record_id, lessonId, ctx.actor_id ?? "system");
      return apiSuccess({ learner_record: record }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Lesson completion failed", 400);
    }
  },
  { permission: "training.manage", endpoint: "/api/v1/training/lessons/{id}/complete" }
);
