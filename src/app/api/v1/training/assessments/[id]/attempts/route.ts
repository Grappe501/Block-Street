import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { submitAssessment } from "@/lib/training/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const assessmentId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { evidence_reference?: string; user_id?: string };
    const userId = body.user_id ?? ctx.actor_id ?? "system";
    try {
      const attempt = submitAssessment(assessmentId, userId, body.evidence_reference ?? "practical-submission");
      return apiSuccess({ attempt }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Assessment submission failed", 400);
    }
  },
  { permission: "training.manage", endpoint: "/api/v1/training/assessments/{id}/attempts" }
);
