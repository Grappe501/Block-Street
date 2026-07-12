import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { objectiveOptimizationService } from "@/lib/civic-action/builds/11.2/optimization";
import type { SimulationRequest } from "@/lib/civic-action/builds/11.2/optimization";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as SimulationRequest & { initiative_id?: string };
      if (!body.scenario_type) {
        throw new ApiError("VALIDATION_ERROR", "scenario_type is required", 400);
      }
      return {
        simulation: objectiveOptimizationService.runSimulation(
          apiCtx.institution_id,
          {
            scenario_type: body.scenario_type,
            parameters: body.parameters ?? {},
            objective_id_optional: body.objective_id_optional,
          },
          body.initiative_id
        ),
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/objectives/simulate" }
);
