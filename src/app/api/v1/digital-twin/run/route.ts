import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withEvolutionApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        simulation_type?: string;
        parameters?: Record<string, unknown>;
      };
      return operationsApplicationService.runOpsDigitalTwin({
        institution_id: apiCtx.institution_id,
        simulation_type: (body.simulation_type ?? "full") as Parameters<
          typeof operationsApplicationService.runOpsDigitalTwin
        >[0]["simulation_type"],
        parameters: body.parameters,
      });
    }),
  { permission: "evolution.manage", endpoint: "/api/v1/digital-twin/run" }
);
