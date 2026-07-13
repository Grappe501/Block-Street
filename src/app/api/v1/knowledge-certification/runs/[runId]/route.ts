import { withApiGateway } from "@/lib/api/http";
import { knowledgeProductionService } from "@/lib/civic-action/builds/11.12/production";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, () => {
      const runId = request.nextUrl.pathname.split("/").pop() ?? "";
      return {
        run: knowledgeProductionService.getCertificationRun(runId),
      };
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-certification/runs/{runId}" }
);
