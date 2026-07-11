import { NextRequest } from "next/server";
import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { createAlert, listAlerts, resolveAlert } from "@/lib/monitoring/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    const severity = request.nextUrl.searchParams.get("severity") ?? undefined;
    return apiSuccess(
      { alerts: listAlerts({ status, severity }) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "monitoring.view", endpoint: "/api/v1/monitoring/alerts" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    return withIdempotentPost(ctx, request, "/api/v1/monitoring/alerts", async (body) => {
      const alert = createAlert({
        type: String(body.type ?? "unknown"),
        severity: (body.severity as "info" | "warning" | "high" | "critical") ?? "warning",
        service: String(body.service ?? "platform"),
        recommended_action: String(body.recommended_action ?? "Investigate"),
        correlation_id: body.correlation_id ? String(body.correlation_id) : undefined,
      });
      return { alert };
    });
  },
  { permission: "monitoring.manage_alerts", endpoint: "/api/v1/monitoring/alerts" }
);
