import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as { query?: string; include_historical?: boolean };
      return knowledgeIntelligenceService.run(intelCtx, {
        request_type: "knowledge_query",
        purpose: "natural_language_knowledge_search",
        query: body.query ?? "",
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/knowledge/query" }
);
