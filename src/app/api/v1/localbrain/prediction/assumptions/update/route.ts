import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        label: string;
        value: string;
        forecast_id?: string;
        scenario_id?: string;
        sensitivity?: string;
      };
      return livingIntelligenceApplicationService.updatePredictionAssumption({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        label: body.label,
        value: body.value,
        forecast_id: body.forecast_id,
        scenario_id: body.scenario_id,
        sensitivity: body.sensitivity as "low" | "medium" | "high" | undefined,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/prediction/assumptions/update" }
);
