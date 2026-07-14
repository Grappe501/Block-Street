import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        twin_id: string;
        simulation_type:
          | "discrete_event"
          | "workflow"
          | "timeline_replay"
          | "resource"
          | "operational"
          | "strategic"
          | "emergency"
          | "election"
          | "community"
          | "institutional_growth";
        hypothesis: string;
      };
      return livingIntelligenceApplicationService.runSimulation({
        twin_id: body.twin_id,
        institution_id: apiCtx.institution_id,
        human_id: apiCtx.human_id,
        simulation_type: body.simulation_type,
        hypothesis: body.hypothesis,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/digital-twin/simulation/run" }
);
