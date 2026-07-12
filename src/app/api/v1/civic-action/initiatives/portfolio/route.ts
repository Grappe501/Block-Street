import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { assembleInitiativePortfolio, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.1/ux";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode") ?? "institution";
    const locale = request.nextUrl.searchParams.get("locale") === "es" ? "es" : "en";
    const view = assembleInitiativePortfolio({ ...DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT, locale }, mode);
    return apiSuccess(view, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic_action.view", endpoint: "/api/v1/civic-action/initiatives/portfolio" }
);
