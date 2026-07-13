import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withOpsIntelligenceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withOpsIntelligenceApi(ctx, request, (apiCtx) => ({
      forecasts: operationsApplicationService.listInstitutionalForecasts(apiCtx.institution_id),
    })),
  { permission: "intelligence.view", endpoint: "/api/v1/intelligence/forecast" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withOpsIntelligenceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        forecast_type: Parameters<typeof operationsApplicationService.generateInstitutionalForecast>[0]["forecast_type"];
        horizon?: Parameters<typeof operationsApplicationService.generateInstitutionalForecast>[0]["horizon"];
      };
      return operationsApplicationService.generateInstitutionalForecast({
        institution_id: apiCtx.institution_id,
        forecast_type: body.forecast_type,
        horizon: body.horizon,
      });
    }),
  { permission: "intelligence.manage", endpoint: "/api/v1/intelligence/forecast" }
);
