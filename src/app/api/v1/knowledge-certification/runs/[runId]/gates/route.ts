import { withApiGateway } from "@/lib/api/http";
import { knowledgeProductionService } from "@/lib/civic-action/builds/11.12/production";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, () => {
      const parts = request.nextUrl.pathname.split("/");
      const runIdx = parts.indexOf("runs");
      const runId = parts[runIdx + 1] ?? "";
      return {
        run: knowledgeProductionService.recordCertificationGateResults(runId),
        event: "certification.gate_passed",
      };
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge-certification/runs/{runId}/gates" }
);
