import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        subject: string;
        summary: string;
        time_horizon?: string;
        assumptions?: string[];
      };
      return livingIntelligenceApplicationService.runForecast({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        subject: body.subject,
        summary: body.summary,
        time_horizon: body.time_horizon as Parameters<typeof livingIntelligenceApplicationService.runForecast>[0]["time_horizon"],
        assumptions: body.assumptions,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/prediction/forecast/run" }
);
