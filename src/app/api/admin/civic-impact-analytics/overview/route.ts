import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getCivicImpactOverview, runAcceptanceCycle } from "@/lib/civic-impact-analytics/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      { overview: getCivicImpactOverview(), requirement: "CIA-001", acceptance: "AC-201" },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { permission: "analytics.view", endpoint: "/api/admin/civic-impact-analytics/overview" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      institution_id?: string;
      county_id?: string;
    };
    if (body.action === "acceptance_cycle") {
      const result = runAcceptanceCycle(body.institution_id || "inst-block-street", body.county_id);
      return apiSuccess({ ok: true, ...result }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess({ error: "Unknown action" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 400);
  },
  { permission: "analytics.view", endpoint: "/api/admin/civic-impact-analytics/overview" }
);
