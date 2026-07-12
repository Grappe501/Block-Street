import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { completeVerifierEducation, getVerifierQualification, isVerifierEligible } from "@/lib/identity-trust/wave2/verifier";
import { loadWave2Policy } from "@/lib/identity-trust/wave2/data";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      {
        qualification: getVerifierQualification(ctx.actor_id!),
        eligibility: isVerifierEligible(ctx.actor_id!),
        responsibility_statement: loadWave2Policy().verifier_responsibility_statement,
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/verifier-qualification" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "complete_education") {
      const qual = completeVerifierEducation(ctx.actor_id!);
      return apiSuccess(qual, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    throw new Error("Unknown action");
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity/verifier-qualification" }
);
