import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { runAutomatedRedTeamScenarios, listRedTeamFindings, updateRedTeamFinding, getRedTeamScenarios } from "@/lib/identity-trust/wave7/redteam";

export const GET = withApiGateway(
  async (ctx, request) => {
    const engagementId =
      request.nextUrl.searchParams.get("engagementId") ?? request.nextUrl.searchParams.get("certificationId") ?? undefined;
    return apiSuccess(
      { findings: listRedTeamFindings(engagementId), scenarios: getRedTeamScenarios() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-red-team/engagements" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as {
      certification_id?: string;
      action?: string;
      finding_id?: string;
      status?: "open" | "mitigated" | "accepted_risk" | "retest_passed";
    };
    if (body.action === "update" && body.finding_id) {
      return apiSuccess(updateRedTeamFinding(body.finding_id, { status: body.status }), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    const certificationId = body.certification_id ?? `rt-${Date.now()}`;
    return apiSuccess(
      { certification_id: certificationId, findings: runAutomatedRedTeamScenarios(certificationId) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-red-team/engagements" }
);
