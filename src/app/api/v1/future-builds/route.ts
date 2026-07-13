import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withEvolutionApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, (apiCtx) => ({
      future_builds: operationsApplicationService.listOpsFutureBuilds(apiCtx.institution_id),
    })),
  { permission: "evolution.view", endpoint: "/api/v1/future-builds" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        category: string;
        title: string;
        description: string;
        priority?: string;
      };
      return operationsApplicationService.queueOpsFutureBuild({
        institution_id: apiCtx.institution_id,
        category: body.category as Parameters<typeof operationsApplicationService.queueOpsFutureBuild>[0]["category"],
        title: body.title,
        description: body.description,
        priority: body.priority as Parameters<typeof operationsApplicationService.queueOpsFutureBuild>[0]["priority"],
      });
    }),
  { permission: "evolution.manage", endpoint: "/api/v1/future-builds" }
);
