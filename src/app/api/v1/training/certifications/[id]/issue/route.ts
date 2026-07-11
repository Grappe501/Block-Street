import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { issueCertification } from "@/lib/training/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const definitionId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { user_id: string; institution_id: string; evidence_reference?: string };
    try {
      const award = issueCertification(
        definitionId,
        body.user_id,
        body.institution_id,
        ctx.actor_id ?? "system",
        body.evidence_reference ?? "assessment-passed"
      );
      return apiSuccess({ award, eligibility_note: "User is now eligible for role assignment — certification does not grant access directly." }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Certification issuance failed", 400);
    }
  },
  { permission: "training.certify", endpoint: "/api/v1/training/certifications/{id}/issue" }
);
