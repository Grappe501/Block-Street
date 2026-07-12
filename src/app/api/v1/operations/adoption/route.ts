import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { computeAdoption } from "@/lib/operations/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? "inst-block-street";
    const rollout = Number(request.nextUrl.searchParams.get("rollout_percent") ?? 100);
    return apiSuccess({ adoption: computeAdoption(institutionId, rollout) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "operations.view", endpoint: "/api/v1/operations/adoption" }
);
