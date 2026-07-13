import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkflowsApi, workflowIdFromPath } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withWorkflowsApi(ctx, request, async (apiCtx) => {
      const workflowId = workflowIdFromPath(request);
      const body = (await request.json().catch(() => ({}))) as { inputs?: Record<string, string> };
      return operationsApplicationService.executeWorkflow(workflowId, {
        institution_id: apiCtx.institution_id,
        triggered_by: apiCtx.actor_human_id,
        inputs: body.inputs,
      });
    }),
  { permission: "workflows.manage", endpoint: "/api/v1/workflows/{id}/execute" }
);
