import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { createIdentityChallenge, listChallengesForHuman } from "@/lib/identity-trust/wave2/challenges";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess({ challenges: listChallengesForHuman(ctx.actor_id!) }, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/challenges/me" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const challenge = createIdentityChallenge({
      subject_human_id: body.subject_human_id as string,
      reported_by_human_id: ctx.actor_id!,
      institution_id: body.institution_id as string | undefined,
      challenge_type: body.challenge_type as Parameters<typeof createIdentityChallenge>[0]["challenge_type"],
      description: body.description as string,
      evidence_reference: body.evidence_reference as string | undefined,
      severity: body.severity as Parameters<typeof createIdentityChallenge>[0]["severity"],
    });
    return apiSuccess(challenge, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity/challenges" }
);
