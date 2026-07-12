import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { objectiveOptimizationService } from "@/lib/civic-action/builds/11.2/optimization";
import type { OptimizationFeedbackAction } from "@/lib/civic-action/builds/11.2/optimization";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        optimization_id?: string;
        action?: OptimizationFeedbackAction;
        notes_optional?: string;
      };
      if (!body.optimization_id || !body.action) {
        throw new ApiError("VALIDATION_ERROR", "optimization_id and action are required", 400);
      }
      const entry = objectiveOptimizationService.recordFeedback({
        optimization_id: body.optimization_id,
        action: body.action,
        actor_human_id: apiCtx.actor_human_id,
        institution_id: apiCtx.institution_id,
        notes_optional: body.notes_optional,
      });
      return { feedback: entry, advisory_only: true };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/objectives/feedback" }
);
