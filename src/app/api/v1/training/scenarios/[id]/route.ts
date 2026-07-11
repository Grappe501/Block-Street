import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { completeScenario, startScenario } from "@/lib/training/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const scenarioKey = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as {
      action: string;
      user_id?: string;
      workspace_id?: string;
      mode?: "guided" | "independent";
      attempt_id?: string;
      actions?: string[];
      errors?: number;
      hints_used?: number;
      human_help_count?: number;
    };
    const userId = body.user_id ?? ctx.actor_id ?? "system";
    try {
      if (body.action === "start" && body.workspace_id) {
        return apiSuccess(
          startScenario(scenarioKey, userId, body.workspace_id, body.mode ?? "guided"),
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      if (body.action === "complete" && body.attempt_id) {
        return apiSuccess(
          {
            attempt: completeScenario(
              body.attempt_id,
              body.actions ?? [],
              body.errors ?? 0,
              body.hints_used ?? 0,
              body.human_help_count ?? 0,
              ctx.actor_id ?? "system"
            ),
          },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      throw new Error("Unknown scenario action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Scenario action failed", 400);
    }
  },
  { permission: "training.manage", endpoint: "/api/v1/training/scenarios/{id}" }
);
