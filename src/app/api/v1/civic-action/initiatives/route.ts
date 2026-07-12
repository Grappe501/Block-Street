import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listInitiatives, getInitiativeOverview } from "@/lib/civic-action/initiatives";
import { ensureCaeStore } from "@/lib/civic-action/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    ensureCaeStore();
    const id = request.nextUrl.searchParams.get("id");
    if (id) {
      return apiSuccess(getInitiativeOverview(id), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess(listInitiatives({ institution_id: institutionId }), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "civic_action.view", endpoint: "/api/v1/civic-action/initiatives" }
);
