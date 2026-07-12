import { withApiGateway } from "@/lib/api/http";
import { listObjectiveOperationalProjections } from "@/lib/civic-action/builds/11.2/integrations/analytics-projection";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return {
        projections: listObjectiveOperationalProjections(
          apiCtx.institution_id,
          sp.get("initiative_id") ?? undefined
        ),
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/analytics/objectives" }
);
