import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listMetrics } from "@/lib/monitoring/engine";

export const GET = withApiGateway(
  async (ctx) => {
    return apiSuccess(listMetrics(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "monitoring.view", endpoint: "/api/v1/monitoring/metrics" }
);
