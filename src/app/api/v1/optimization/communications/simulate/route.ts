import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { communicationOptimizationService } from "@/lib/civic-action/builds/11.7/optimization";
import type { SimulationRequest } from "@/lib/civic-action/builds/11.7/optimization";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as SimulationRequest & { initiative_id?: string };
      if (!body.scenario_type) {
        throw new ApiError("VALIDATION_ERROR", "scenario_type is required", 400);
      }
      const result = communicationOptimizationService.runSimulation(
        apiCtx.institution_id,
        { scenario_type: body.scenario_type, parameters: body.parameters ?? {}, conversation_id_optional: body.conversation_id_optional },
        body.initiative_id
      );
      return { simulation: result, advisory_only: true };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/optimization/communications/simulate" }
);
