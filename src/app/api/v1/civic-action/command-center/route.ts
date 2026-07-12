import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getOperationsOverview } from "@/lib/civic-action/command-center";
import { ensureCaeStore } from "@/lib/civic-action/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    ensureCaeStore();
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? "inst-block-street";
    return apiSuccess(getOperationsOverview(institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "civic_action.view", endpoint: "/api/v1/civic-action/command-center" }
);
