import { withApiGateway } from "@/lib/api/http";
import { knowledgeProductionService } from "@/lib/civic-action/builds/11.12/production";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, () => ({
      status: knowledgeProductionService.getCertificationStatus(),
      health: knowledgeProductionService.getHealthSummary("inst-block-street"),
      event: "verification.run_completed",
    })),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-certification/status" }
);
