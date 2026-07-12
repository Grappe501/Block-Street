import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { completeSponsorEducation, getSponsorPrivilege, listWave1Invitations } from "@/lib/identity-trust/wave1/engine";
import { loadWave1Policy } from "@/lib/identity-trust/wave1/data";

export const GET = withApiGateway(
  async (ctx) => {
    const humanId = ctx.actor_id!;
    return apiSuccess(
      {
        privilege: getSponsorPrivilege(humanId),
        invitations: listWave1Invitations(humanId),
        attestation: loadWave1Policy(),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/sponsors/me" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "complete_education") {
      return apiSuccess(completeSponsorEducation(ctx.actor_id!), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    return apiSuccess({ attestation_recorded: true }, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/sponsors/me" }
);
