import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as { question?: string };
      return knowledgeIntelligenceService.run(intelCtx, {
        request_type: "research_synthesize",
        purpose: "evidence_synthesis",
        query: body.question ?? "",
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/research/synthesize" }
);
