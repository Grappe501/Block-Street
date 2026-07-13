import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as { entity_id?: string; entity_type?: string };
      return knowledgeIntelligenceService.run(intelCtx, {
        request_type: "knowledge_impact",
        purpose: "source_change_impact_analysis",
        target_entity_id: body.entity_id,
        target_entity_type: body.entity_type ?? "KnowledgeArtifact",
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/knowledge/impact" }
);
