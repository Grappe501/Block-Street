import { withApiGateway } from "@/lib/api/http";
import { knowledgeProductionService } from "@/lib/civic-action/builds/11.12/production";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, () => ({
      verification: knowledgeProductionService.runContinuousVerification(),
      schedules: knowledgeProductionService.getVerificationSchedules(),
      event: "verification.run_completed",
    })),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-certification/continuous-verification" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, () => ({
      verification: knowledgeProductionService.runContinuousVerification(),
      event: "verification.run_started",
    })),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-certification/continuous-verification" }
);
