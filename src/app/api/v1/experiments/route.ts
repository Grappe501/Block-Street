import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withImprovementApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withImprovementApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        title: string;
        hypothesis: string;
        method: string;
      };
      return operationsApplicationService.launchExperiment({
        institution_id: apiCtx.institution_id,
        title: body.title,
        hypothesis: body.hypothesis,
        method: body.method,
      });
    }),
  { permission: "improvement.manage", endpoint: "/api/v1/experiments" }
);
