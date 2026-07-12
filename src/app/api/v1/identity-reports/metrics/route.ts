import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listReports, getOperationalMetrics, runReport } from "@/lib/identity-trust/wave6/reports";

export const GET = withApiGateway(
  async (ctx, request) => {
    const mode = request.nextUrl.searchParams.get("mode") ?? "metrics";
    if (mode === "definitions") {
      return apiSuccess(listReports(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(getOperationalMetrics(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-reports/metrics" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const reportId = body.report_id as string;
    return apiSuccess(runReport(reportId), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-reports/metrics" }
);
