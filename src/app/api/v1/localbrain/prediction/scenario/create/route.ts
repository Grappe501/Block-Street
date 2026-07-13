import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        scenario_type: string;
        title: string;
        description: string;
        assumptions?: string[];
      };
      return livingIntelligenceApplicationService.createScenario({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        scenario_type: body.scenario_type as Parameters<typeof livingIntelligenceApplicationService.createScenario>[0]["scenario_type"],
        title: body.title,
        description: body.description,
        assumptions: body.assumptions,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/prediction/scenario/create" }
);
