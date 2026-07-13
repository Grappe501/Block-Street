import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResilienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, (apiCtx) => ({
      exercises: operationsApplicationService.listResilienceExercises(apiCtx.institution_id),
    })),
  { permission: "resilience.view", endpoint: "/api/v1/exercises" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        exercise_type: Parameters<typeof operationsApplicationService.runResilienceExercise>[0]["exercise_type"];
        title: string;
        findings?: string[];
      };
      return operationsApplicationService.runResilienceExercise({
        institution_id: apiCtx.institution_id,
        exercise_type: body.exercise_type,
        title: body.title,
        findings: body.findings,
      });
    }),
  { permission: "resilience.manage", endpoint: "/api/v1/exercises" }
);
