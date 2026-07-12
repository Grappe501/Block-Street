import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getPrivacySettings, updatePrivacySettings } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id");
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!userId || !institutionId) throw new Error("user_id and institution_id are required");
    return apiSuccess(getPrivacySettings(userId, institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/privacy" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const settings = updatePrivacySettings({
      user_id: body.user_id,
      institution_id: body.institution_id,
      public_connections: body.public_connections,
      mentorship_visibility: body.mentorship_visibility,
      collaboration_history_visible: body.collaboration_history_visible,
      partnership_visibility: body.partnership_visibility,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(settings, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "community_relationship.manage", endpoint: "/api/v1/community-relationship/privacy" }
);
