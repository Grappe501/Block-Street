import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getDashboards } from "@/lib/monitoring/engine";

export const GET = withApiGateway(
  async (ctx) => {
    return apiSuccess(
      { dashboards: getDashboards() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "monitoring.view", endpoint: "/api/v1/monitoring/dashboard" }
);
