import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  createCrossInstitutionInvitation,
  listCrossInstitutionInvitationsForHuman,
  acceptCrossInstitutionInvitation,
  declineCrossInstitutionInvitation,
  getCrossInstitutionInvitation,
} from "@/lib/identity-trust/wave4/invitations";

export const GET = withApiGateway(
  async (ctx, request) => {
    const invitationId = request.nextUrl.searchParams.get("invitation_id");
    if (invitationId) {
      const inv = getCrossInstitutionInvitation(invitationId);
      if (!inv) throw new Error("Invitation not found");
      return apiSuccess(inv, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(listCrossInstitutionInvitationsForHuman(ctx.actor_id!), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/federation/invitations" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string | undefined;

    if (action === "accept") {
      const membership = acceptCrossInstitutionInvitation({
        invitation_id: body.invitation_id as string,
        human_id: ctx.actor_id!,
        session_id: ctx.request_id,
      });
      return apiSuccess(membership, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    if (action === "decline") {
      declineCrossInstitutionInvitation(body.invitation_id as string);
      return apiSuccess({ declined: true }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    const invitation = createCrossInstitutionInvitation({
      inviting_institution_id: body.inviting_institution_id as string,
      sponsor_human_id: ctx.actor_id!,
      intended_recipient_name: body.intended_recipient_name as string,
      recipient_contact: body.recipient_contact as string,
      proposed_membership_type: (body.proposed_membership_type as string) ?? "member",
      proposed_role: body.proposed_role as string | undefined,
      existing_human_candidate_id: body.existing_human_candidate_id as string | undefined,
      portable_assurance_requested: body.portable_assurance_requested as boolean | undefined,
      local_verification_required: body.local_verification_required as boolean | undefined,
    });

    return apiSuccess(invitation, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/federation/invitations" }
);
