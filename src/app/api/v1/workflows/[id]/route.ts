import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkflowsApi, workflowIdFromPath } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withWorkflowsApi(ctx, request, () => {
      const workflowId = workflowIdFromPath(request);
      return { workflow: operationsApplicationService.getWorkflow(workflowId) };
    }),
  { permission: "workflows.view", endpoint: "/api/v1/workflows/{id}" }
);
