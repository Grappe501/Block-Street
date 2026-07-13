import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as { query?: string };
      return knowledgeIntelligenceService.run(intelCtx, {
        request_type: "memory_query",
        purpose: "institutional_memory_retrieval",
        query: body.query ?? "",
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/memory/query" }
);
