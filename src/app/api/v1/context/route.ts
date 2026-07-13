import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getActiveContext, listContextHistory } from "@/lib/identity-trust/wave4/context";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withExperienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) => {
    if (request.nextUrl.searchParams.get("scope") === "experience") {
      return withExperienceApi(ctx, request, (apiCtx) => ({
        context: operationsApplicationService.getExperienceContext(apiCtx.actor_human_id, apiCtx.institution_id),
      }));
    }
    return apiSuccess(
      {
        context: getActiveContext(ctx.actor_id!),
        history: listContextHistory(ctx.actor_id!),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/context" }
);
