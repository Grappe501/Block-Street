import { withApiGateway } from "@/lib/api/http";
import { institutionalOptimizationService } from "@/lib/civic-action/builds/11.1/optimization";
import type { ScenarioOption } from "@/lib/civic-action/builds/11.1/optimization/contracts";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as { options?: ScenarioOption[] };
        return {
          comparison: institutionalOptimizationService.compareScenarios(apiCtx.institution_id, body.options),
          advisory_only: true,
        };
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/scenario/compare" }
);
