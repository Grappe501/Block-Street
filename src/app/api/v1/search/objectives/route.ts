import { withApiGateway } from "@/lib/api/http";
import { searchObjectives } from "@/lib/civic-action/builds/11.2/integrations/search-projection";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return {
        results: searchObjectives({
          institution_id: apiCtx.institution_id,
          initiative_id: sp.get("initiative_id") ?? undefined,
          query: sp.get("q") ?? sp.get("search") ?? undefined,
          include_archived: sp.get("include_archived") === "true",
        }),
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/search/objectives" }
);
