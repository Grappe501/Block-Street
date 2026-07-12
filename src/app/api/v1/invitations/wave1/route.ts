import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  createWave1Invitation,
  evaluateEntryGate,
  getWave1Invitation,
  listWave1Invitations,
  revokeWave1Invitation,
} from "@/lib/identity-trust/wave1/engine";
import { loadWave1Policy } from "@/lib/identity-trust/wave1/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.searchParams.get("id");
    const token = request.nextUrl.searchParams.get("token");
    const sponsorId = request.nextUrl.searchParams.get("sponsor_id") ?? ctx.actor_id ?? undefined;

    if (token) {
      const gate = evaluateEntryGate(token, request.nextUrl.searchParams.get("email") ?? undefined);
      return apiSuccess(gate, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    if (id) {
      const inv = getWave1Invitation(id);
      if (!inv) throw new Error("Invitation not found");
      return apiSuccess(inv, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(listWave1Invitations(sponsorId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/invitations" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string | undefined;

    if (action === "revoke") {
      const inv = revokeWave1Invitation(body.invitation_id as string, ctx.actor_id!, body.reason as string);
      return apiSuccess(inv, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    if (action === "evaluate") {
      const gate = evaluateEntryGate(body.token as string, body.email as string | undefined);
      return apiSuccess(gate, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    if (action === "accept") {
      const { completeWave1Activation } = await import("@/lib/identity-trust/wave1/acceptance");
      const result = completeWave1Activation(
        {
          token: body.token as string,
          email: body.email as string,
          password: body.password as string,
          public_name: body.public_name as string,
          preferred_short_name: body.preferred_short_name as string | undefined,
          link_existing_user_id: body.link_existing_user_id as string | undefined,
        },
        { ip: undefined, userAgent: undefined }
      );
      return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    if (action === "acceptance_start") {
      const { startWave1Acceptance } = await import("@/lib/identity-trust/wave1/acceptance");
      const result = startWave1Acceptance(body.token as string, body.email as string | undefined);
      return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    const result = createWave1Invitation({
      sponsor_human_id: (body.sponsor_human_id as string) ?? ctx.actor_id!,
      institution_id: body.institution_id as string,
      organization_unit_id: body.organization_unit_id as string | undefined,
      workspace_id: body.workspace_id as string | undefined,
      intended_recipient_name: body.intended_recipient_name as string,
      recipient_email: body.recipient_email as string,
      proposed_membership_type: body.proposed_membership_type as string | undefined,
      proposed_role_id: body.proposed_role_id as string | undefined,
      invitation_purpose: body.invitation_purpose as string,
      relationship_basis: body.relationship_basis as Parameters<typeof createWave1Invitation>[0]["relationship_basis"],
      primary_attestation: Boolean(body.primary_attestation),
      secondary_attestation: Boolean(body.secondary_attestation),
    });

    return apiSuccess(
      { invitation: result.invitation, accept_url: `/invitations/accept?token=${result.token}`, policy: loadWave1Policy() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/invitations" }
);
