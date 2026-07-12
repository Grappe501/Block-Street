import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { openIdentityCase, listCasesForHuman, getIdentityCase } from "@/lib/identity-trust/wave3/cases";
import { submitCaseResponse, getSubjectCaseView } from "@/lib/identity-trust/wave3/decisions";

export const GET = withApiGateway(
  async (ctx, request) => {
    const caseId = request.nextUrl.searchParams.get("case_id");
    if (caseId) {
      const c = getIdentityCase(caseId);
      if (!c || c.subject_human_id !== ctx.actor_id) throw new Error("Case not found.");
      return apiSuccess(c, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(getSubjectCaseView(ctx.actor_id!), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/cases/me" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string | undefined;

    if (action === "respond") {
      const response = submitCaseResponse({
        case_id: body.case_id as string,
        submitted_by_human_id: ctx.actor_id!,
        response_type: (body.response_type as string) ?? "subject_statement",
        statement: body.statement as string,
        evidence_references: body.evidence_references as string[] | undefined,
      });
      return apiSuccess(response, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    const c = openIdentityCase({
      case_type: (body.case_type as Parameters<typeof openIdentityCase>[0]["case_type"]) ?? "other_identity_matter",
      subject_human_id: (body.subject_human_id as string) ?? ctx.actor_id!,
      reporting_human_id: ctx.actor_id!,
      institution_id: body.institution_id as string | undefined,
      summary: body.summary as string,
      scope: body.scope as Parameters<typeof openIdentityCase>[0]["scope"],
    });
    return apiSuccess(c, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity/cases" }
);
