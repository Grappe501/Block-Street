import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getTrainingMe } from "@/lib/training/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess(getTrainingMe(ctx.actor_id ?? "", institutionId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "training.view", endpoint: "/api/v1/training/me" }
);
