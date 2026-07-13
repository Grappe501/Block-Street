import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOpsIntelligenceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withOpsIntelligenceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        simulation_type: string;
        inputs?: Record<string, string>;
      };
      return operationsApplicationService.runInstitutionalSimulation({
        institution_id: apiCtx.institution_id,
        simulation_type: body.simulation_type,
        inputs: body.inputs ?? {},
        created_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "intelligence.manage", endpoint: "/api/v1/intelligence/simulate" }
);
