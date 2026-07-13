import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withExecutiveApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withExecutiveApi(ctx, request, (apiCtx) => ({
      scenarios: operationsApplicationService.listExecutiveScenarios(apiCtx.institution_id),
    })),
  { permission: "executive.view", endpoint: "/api/v1/executive/scenarios" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withExecutiveApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { title: string; hypothesis: string; parameters?: Record<string, string> };
      return operationsApplicationService.createExecutiveScenario({
        institution_id: apiCtx.institution_id,
        title: body.title,
        hypothesis: body.hypothesis,
        parameters: body.parameters,
        created_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "executive.manage", endpoint: "/api/v1/executive/scenario" }
);
