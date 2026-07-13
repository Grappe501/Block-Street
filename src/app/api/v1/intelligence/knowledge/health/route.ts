import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, (intelCtx) => ({
      health: knowledgeIntelligenceService.getHealth(intelCtx),
      advisory_only: true,
      canonical_mutation_allowed: false,
    })),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/knowledge/health" }
);
