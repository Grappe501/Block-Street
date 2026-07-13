import { withApiGateway } from "@/lib/api/http";
import { knowledgeProductionService } from "@/lib/civic-action/builds/11.12/production";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => ({
      readiness: knowledgeProductionService.getReadinessOverview(apiCtx.institution_id),
      event: "verification.run_started",
    })),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-launch/readiness" }
);
