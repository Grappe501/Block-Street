import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResilienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, (apiCtx) => ({
      recovery: operationsApplicationService.listRecoveryOperations(apiCtx.institution_id),
    })),
  { permission: "resilience.view", endpoint: "/api/v1/recovery" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        incident_id: string;
        phase: Parameters<typeof operationsApplicationService.activateRecovery>[0]["phase"];
      };
      return operationsApplicationService.activateRecovery({
        institution_id: apiCtx.institution_id,
        incident_id: body.incident_id,
        phase: body.phase,
      });
    }),
  { permission: "resilience.manage", endpoint: "/api/v1/recovery" }
);
