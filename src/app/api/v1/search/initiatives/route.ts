import { withApiGateway } from "@/lib/api/http";
import { searchInitiatives } from "@/lib/civic-action/builds/11.1/integrations/search-projection";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const publicOnly = sp.get("visibility") === "public";
      return {
        results: searchInitiatives({
          institution_id: apiCtx.institution_id,
          query: sp.get("q") ?? sp.get("search") ?? undefined,
          include_archived: sp.get("include_archived") === "true",
          visibility_scope: publicOnly ? "public" : "member",
        }),
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/search/initiatives" }
);
