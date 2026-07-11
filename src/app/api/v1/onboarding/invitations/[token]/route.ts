import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getInvitationByToken } from "@/lib/onboarding/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const token = request.nextUrl.pathname.split("/")[4] ?? "";
    const invitation = getInvitationByToken(token);
    if (!invitation) throw new ApiError("NOT_FOUND", "Invitation invalid or expired", 404);
    return apiSuccess(
      {
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role_key: invitation.role_key,
          institution_id: invitation.institution_id,
          unit_id: invitation.unit_id,
          status: invitation.status,
          expires_at: invitation.expires_at,
          message: invitation.message,
        },
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "onboarding.view", endpoint: "/api/v1/onboarding/invitations/{token}" }
);
