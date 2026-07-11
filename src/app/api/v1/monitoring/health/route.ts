import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getPlatformHealth } from "@/lib/monitoring/engine";

export const GET = withApiGateway(
  async (ctx) => {
    const health = getPlatformHealth();
    return apiSuccess(
      { status: "ok", service: "monitoring", ...health },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { public: true, endpoint: "/api/v1/monitoring/health" }
);
