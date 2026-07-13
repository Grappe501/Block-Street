import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkflowsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withWorkflowsApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { execution_id: string };
      return operationsApplicationService.rollbackWorkflow(body.execution_id, apiCtx.actor_human_id);
    }),
  { permission: "workflows.manage", endpoint: "/api/v1/workflows/{id}/rollback" }
);
