import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getResearchLabOverview, runAcceptanceDemo } from "@/lib/research-policy-lab/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      { overview: getResearchLabOverview(), requirement: "RPL-001", acceptance: "AC-200" },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { permission: "analytics.view", endpoint: "/api/admin/research-policy-lab/overview" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      institution_id?: string;
      sponsor_email?: string;
    };
    if (body.action === "acceptance_demo") {
      const result = runAcceptanceDemo(
        body.institution_id || "inst-block-street",
        body.sponsor_email || "grappe4arkansas@gmail.com"
      );
      return apiSuccess({ ok: true, ...result }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess({ error: "Unknown action" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 400);
  },
  { permission: "analytics.view", endpoint: "/api/admin/research-policy-lab/overview" }
);
