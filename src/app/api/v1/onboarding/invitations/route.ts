import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createInstitutionalInvitation, listInstitutionInvitations } from "@/lib/onboarding/engine";
import { onboardingInvitationScopeResolver } from "@/lib/authority/scope-resolvers";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const invitations = institutionId ? listInstitutionInvitations(institutionId) : [];
    return apiSuccess({ invitations }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "onboarding.view", endpoint: "/api/v1/onboarding/invitations", scopeResolver: onboardingInvitationScopeResolver }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      unit_id?: string;
      email: string;
      role_key: string;
      message?: string;
      unit_name?: string;
      institution_name?: string;
    };
    try {
      const result = createInstitutionalInvitation({
        institution_id: body.institution_id,
        unit_id: body.unit_id,
        email: body.email,
        role_key: body.role_key,
        invited_by: ctx.actor_id ?? "system",
        message: body.message,
      });
      return apiSuccess(
        {
          invitation: { ...result.invitation, invitation_token_hash: undefined },
          accept_url: `/onboarding/activate?token=${result.token}`,
        },
        { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
        201
      );
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Invitation failed", 400);
    }
  },
  { permission: "onboarding.manage", endpoint: "/api/v1/onboarding/invitations", scopeResolver: onboardingInvitationScopeResolver }
);
