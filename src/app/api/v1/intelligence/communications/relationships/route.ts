import { withApiGateway } from "@/lib/api/http";
import { communicationIntelligenceService } from "@/lib/civic-action/builds/11.7/intelligence";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";
import { toIntelligenceContext } from "@/lib/civic-action/builds/11.7/intelligence/api-context";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const intelCtx = toIntelligenceContext(apiCtx, {
        initiativeId: sp.get("initiative_id") ?? undefined,
        conversationId: sp.get("conversation_id") ?? undefined,
      });
      const graph = intelCtx.conversation_id_optional
        ? communicationIntelligenceService.getKnowledgeGraph(
            intelCtx.conversation_id_optional,
            intelCtx.institution_id
          )
        : null;
      return {
        relationships: communicationIntelligenceService.getRelationships(
          intelCtx.institution_id,
          intelCtx.initiative_id_optional
        ),
        graph,
        advisory_only: true,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/intelligence/communications/relationships" }
);
