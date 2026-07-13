import { withApiGateway } from "@/lib/api/http";
import { knowledgeProductionService } from "@/lib/civic-action/builds/11.12/production";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, () => ({
      runs: knowledgeProductionService.listCertificationRuns(),
      event: "certification.run_created",
    })),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-certification/runs" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => ({
      run: knowledgeProductionService.createCertificationRun({
        environment: "production",
        started_by_human_id: apiCtx.actor_human_id,
        certification_scope: "full_engine",
      }),
      event: "certification.run_created",
    })),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-certification/runs" }
);
