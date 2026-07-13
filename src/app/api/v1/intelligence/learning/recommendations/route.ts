import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, (intelCtx) => ({
      recommendations: knowledgeIntelligenceService.getLearningRecommendations(intelCtx),
      advisory_only: true,
      canonical_mutation_allowed: false,
    })),
  { permission: "training.view", endpoint: "/api/v1/intelligence/learning/recommendations" }
);
