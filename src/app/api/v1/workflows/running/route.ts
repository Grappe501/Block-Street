import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkflowsApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withWorkflowsApi(ctx, request, (apiCtx) => ({
      executions: operationsApplicationService.listRunningWorkflows(apiCtx.institution_id),
    })),
  { permission: "workflows.view", endpoint: "/api/v1/workflows/running" }
);
