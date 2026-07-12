import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { createTrustInvitation, listTrustInvitations } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const sponsorId = request.nextUrl.searchParams.get("sponsor_id") ?? ctx.actor_id ?? undefined;
    return apiSuccess(listTrustInvitations(sponsorId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/invitations" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const sponsorId = (body.sponsor_id as string) ?? ctx.actor_id;
    if (!sponsorId) throw new Error("sponsor_id is required");
    const result = createTrustInvitation({
      email: body.email as string,
      organization_id: body.organization_id as string,
      institution_id: body.institution_id as string,
      workspace_id: (body.workspace_id as string) ?? null,
      intended_role: body.intended_role as string,
      invite_reason: body.invite_reason as string,
      sponsor_id: sponsorId,
      sponsor_agreement_accepted: Boolean(body.sponsor_agreement_accepted),
      message: body.message as string | undefined,
    });
    return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/invitations" }
);
