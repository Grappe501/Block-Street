import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withImprovementApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withImprovementApi(ctx, request, (apiCtx) => ({
      measurements: operationsApplicationService.listMeasurements(apiCtx.institution_id),
    })),
  { permission: "improvement.view", endpoint: "/api/v1/measurements" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withImprovementApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        subject: string;
        objective: string;
        metric: string;
        measurement_type?: string;
        baseline?: number;
        target?: number;
      };
      return operationsApplicationService.createMeasurement({
        institution_id: apiCtx.institution_id,
        subject: body.subject,
        objective: body.objective,
        metric: body.metric,
        owner: apiCtx.actor_human_id,
        measurement_type: body.measurement_type as Parameters<typeof operationsApplicationService.createMeasurement>[0]["measurement_type"],
        baseline: body.baseline,
        target: body.target,
      });
    }),
  { permission: "improvement.manage", endpoint: "/api/v1/measurements" }
);
