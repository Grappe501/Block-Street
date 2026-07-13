import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

/** AI read-only knowledge copilot — no mutation endpoints */
export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as { query?: string };
      return knowledgeIntelligenceService.copilotQuery(body.query ?? "", intelCtx);
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/ai/knowledge/query" }
);
