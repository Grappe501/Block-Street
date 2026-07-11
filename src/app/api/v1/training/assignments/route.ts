import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { assignLearningPath, listLearningPaths } from "@/lib/training/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ learning_paths: listLearningPaths(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "training.view", endpoint: "/api/v1/training/learning-paths" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      user_id: string;
      learning_path_id: string;
      institution_id: string;
      unit_id?: string;
      reason?: string;
    };
    try {
      const result = assignLearningPath({
        user_id: body.user_id,
        learning_path_id: body.learning_path_id,
        institution_id: body.institution_id,
        unit_id: body.unit_id,
        assigned_by: ctx.actor_id ?? "system",
        reason: body.reason ?? "role_requirement",
      });
      return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Assignment failed", 400);
    }
  },
  { permission: "training.manage", endpoint: "/api/v1/training/assignments" }
);
