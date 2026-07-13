import { withApiGateway } from "@/lib/api/http";
import { searchCommunications } from "@/lib/civic-action/builds/11.7/integrations/search-projection";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const results = searchCommunications({
        institution_id: apiCtx.institution_id,
        initiative_id: sp.get("initiative_id") ?? undefined,
        query: sp.get("q") ?? sp.get("query") ?? undefined,
        include_archived: sp.get("include_archived") === "true",
      });
      return { items: results, query: sp.get("q") ?? sp.get("query") ?? "" };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/communications/search" }
);
