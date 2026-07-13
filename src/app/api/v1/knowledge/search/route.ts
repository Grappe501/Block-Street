import { withApiGateway } from "@/lib/api/http";
import { searchKnowledge } from "@/lib/civic-action/builds/11.12/integrations/search-projection";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const results = searchKnowledge({
        institution_id: apiCtx.institution_id,
        query: sp.get("q") ?? sp.get("query") ?? undefined,
        include_historical: sp.get("include_historical") === "true",
        actor_permissions: apiCtx.effective_permissions,
      });
      return { items: results, query: sp.get("q") ?? sp.get("query") ?? "" };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/knowledge/search" }
);
