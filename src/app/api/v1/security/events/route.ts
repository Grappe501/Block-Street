import { NextRequest } from "next/server";
import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listSecurityEvents } from "@/lib/security/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const severity = request.nextUrl.searchParams.get("severity") ?? undefined;
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    return apiSuccess({ events: listSecurityEvents({ severity, status }) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "security.view", endpoint: "/api/v1/security/events" }
);
