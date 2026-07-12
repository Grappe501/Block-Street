import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { queryObjectiveDashboard, queryObjectiveProgress } from "@/lib/civic-action/builds/11.2/api";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

/** AI read-only query surface — no mutation endpoints */
export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        query_type?: "summarize" | "explain" | "recommend" | "compare";
        objective_id?: string;
        initiative_id?: string;
      };
      if (!body.objective_id || !body.initiative_id) {
        throw new ApiError("VALIDATION_ERROR", "objective_id and initiative_id are required", 400);
      }
      const dashboard = queryObjectiveDashboard(body.initiative_id, body.objective_id, apiCtx);
      const progress = queryObjectiveProgress(body.initiative_id, body.objective_id, apiCtx);
      return {
        query_type: body.query_type ?? "summarize",
        human_summary: dashboard.six_questions,
        machine_summary: progress,
        confidence: "advisory",
        note: "AI receives projections only; mutations require Human commands.",
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/objectives/query" }
);
