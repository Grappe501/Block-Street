import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, (apiCtx) => {
      const taskId = request.nextUrl.searchParams.get("task_id") ?? undefined;
      return livingIntelligenceApplicationService.listAgentEvidence(taskId);
    }),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/agents/evidence" }
);
