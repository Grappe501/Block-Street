import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        workflow_id: string;
        execution_mode?: "sequential" | "parallel";
        approved_by_human: boolean;
      };
      return livingIntelligenceApplicationService.startWorkflow({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        workflow_id: body.workflow_id,
        execution_mode: body.execution_mode,
        approved_by_human: body.approved_by_human,
      });
    }),
  { permission: "localbrain.manage", endpoint: "/api/v1/localbrain/automation/workflow/start" }
);
