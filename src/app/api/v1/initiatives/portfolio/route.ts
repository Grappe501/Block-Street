import { withApiGateway } from "@/lib/api/http";
import { queryInitiativePortfolio } from "@/lib/civic-action/builds/11.1/api";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(ctx, request, (apiCtx) => {
      const mode = request.nextUrl.searchParams.get("mode") ?? "institution";
      return queryInitiativePortfolio(apiCtx, mode);
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/initiatives/portfolio" }
);
