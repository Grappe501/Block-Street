import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getTrainingHealth } from "@/lib/training/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess({ health: getTrainingHealth(institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "training.view", endpoint: "/api/v1/training/analytics/overview" }
);
