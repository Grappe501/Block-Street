import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { institutionalOptimizationService } from "@/lib/civic-action/builds/11.1/optimization";
import type { OptimizationFeedbackAction } from "@/lib/civic-action/builds/11.1/optimization/contracts";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

const ACTIONS: OptimizationFeedbackAction[] = ["accepted", "rejected", "modified", "deferred", "not_applicable"];

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          optimization_id?: string;
          action?: OptimizationFeedbackAction;
          notes_optional?: string;
        };
        if (!body.optimization_id?.trim()) throw new ApiError("VALIDATION_ERROR", "optimization_id is required", 400);
        if (!body.action || !ACTIONS.includes(body.action)) {
          throw new ApiError("VALIDATION_ERROR", `action must be one of: ${ACTIONS.join(", ")}`, 400);
        }
        return {
          feedback: institutionalOptimizationService.recordFeedback({
            optimization_id: body.optimization_id,
            action: body.action,
            actor_human_id: apiCtx.actor_human_id,
            institution_id: apiCtx.institution_id,
            notes_optional: body.notes_optional,
          }),
          advisory_only: true,
        };
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/feedback" }
);
