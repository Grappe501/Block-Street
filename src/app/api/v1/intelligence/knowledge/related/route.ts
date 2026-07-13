import { withApiGateway } from "@/lib/api/http";
import { knowledgeIntelligenceService } from "@/lib/civic-action/builds/11.12/intelligence";
import { withKnowledgeIntelligenceApi } from "@/lib/civic-action/builds/11.12/intelligence/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeIntelligenceApi(ctx, request, async (intelCtx) => {
      const body = (await request.json()) as { entity_id?: string; entity_type?: string };
      const graph = knowledgeIntelligenceService.getGraph(
        body.entity_id ?? "",
        body.entity_type ?? "KnowledgeArtifact",
        intelCtx
      );
      return { graph, advisory_only: true, canonical_mutation_allowed: false };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/knowledge/related" }
);
