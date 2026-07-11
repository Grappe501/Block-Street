import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listSecurityEvents } from "@/lib/security/engine";

export const GET = withApiGateway(
  async (ctx) => {
    const events = listSecurityEvents({ status: "open" }).filter((e) => e.severity === "high" || e.severity === "critical");
    return apiSuccess({ alerts: events }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "security.view", endpoint: "/api/v1/security/alerts" }
);
