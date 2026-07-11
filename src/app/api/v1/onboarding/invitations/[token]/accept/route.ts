import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { acceptInstitutionalInvitation, generateJourney } from "@/lib/onboarding/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const token = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as {
      user_email: string;
      unit_name?: string;
      institution_name?: string;
    };
    try {
      const invitation = acceptInstitutionalInvitation(token, ctx.actor_id ?? "system", body.user_email);
      const journey = generateJourney({
        user_id: ctx.actor_id ?? "system",
        institution_id: invitation.institution_id,
        unit_id: invitation.unit_id,
        unit_name: body.unit_name ?? "University of Arkansas Campus Chapter",
        institution_name: body.institution_name ?? "Block Street Network",
        role_key: invitation.role_key,
        invitation_id: invitation.id,
      });
      return apiSuccess({ invitation, journey }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Accept failed", 400);
    }
  },
  { permission: "onboarding.manage", endpoint: "/api/v1/onboarding/invitations/{token}/accept" }
);
