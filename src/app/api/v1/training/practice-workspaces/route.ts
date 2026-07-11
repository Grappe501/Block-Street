import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createPracticeWorkspace } from "@/lib/training/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as { learning_path_id: string; institution_id: string; user_id?: string };
    const userId = body.user_id ?? ctx.actor_id ?? "system";
    try {
      const workspace = createPracticeWorkspace(userId, body.learning_path_id, body.institution_id);
      return apiSuccess({ workspace, banner: "TRAINING ENVIRONMENT — No production data or notifications" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Practice workspace failed", 400);
    }
  },
  { permission: "training.manage", endpoint: "/api/v1/training/practice-workspaces" }
);
