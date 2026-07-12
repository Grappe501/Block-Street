import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { institutionalOptimizationService } from "@/lib/civic-action/builds/11.1/optimization";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          scenario_type?: string;
          parameters?: Record<string, unknown>;
        };
        if (!body.scenario_type?.trim()) throw new ApiError("VALIDATION_ERROR", "scenario_type is required", 400);
        return {
          simulation: institutionalOptimizationService.runSimulation(apiCtx.institution_id, {
            scenario_type: body.scenario_type,
            parameters: body.parameters ?? {},
          }),
          advisory_only: true,
        };
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/simulation/run" }
);
