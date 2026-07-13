import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkflowsApi, workflowIdFromPath } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withWorkflowsApi(ctx, request, (apiCtx) => {
      const workflowId = workflowIdFromPath(request);
      return operationsApplicationService.pauseWorkflow(workflowId, apiCtx.actor_human_id);
    }),
  { permission: "workflows.manage", endpoint: "/api/v1/workflows/{id}/pause" }
);
