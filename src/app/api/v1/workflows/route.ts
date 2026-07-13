import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkflowsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withWorkflowsApi(ctx, request, (apiCtx) => {
      const status = request.nextUrl.searchParams.get("status") as Parameters<typeof operationsApplicationService.listWorkflows>[1];
      return { workflows: operationsApplicationService.listWorkflows(apiCtx.institution_id, status ?? undefined) };
    }),
  { permission: "workflows.view", endpoint: "/api/v1/workflows" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withWorkflowsApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        name: string;
        description: string;
        category: Parameters<typeof operationsApplicationService.createWorkflow>[0]["category"];
        risk_level?: Parameters<typeof operationsApplicationService.createWorkflow>[0]["risk_level"];
        automation_level?: Parameters<typeof operationsApplicationService.createWorkflow>[0]["automation_level"];
      };
      return operationsApplicationService.createWorkflow({
        institution_id: apiCtx.institution_id,
        name: body.name,
        description: body.description,
        category: body.category,
        owner: apiCtx.actor_human_id,
        created_by: apiCtx.actor_human_id,
        risk_level: body.risk_level,
        automation_level: body.automation_level,
      });
    }),
  { permission: "workflows.manage", endpoint: "/api/v1/workflows" }
);
