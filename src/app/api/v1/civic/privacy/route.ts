import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getPrivacySettings, updatePrivacySettings } from "@/lib/civic/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id");
    const institutionId = request.nextUrl.searchParams.get("institution_id");
    if (!userId || !institutionId) throw new ApiError("INVALID_REQUEST", "user_id and institution_id required", 400);
    return apiSuccess({ privacy: getPrivacySettings(userId, institutionId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic.view", endpoint: "/api/v1/civic/privacy" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      user_id: string;
      institution_id: string;
      milestone_badges_only?: boolean;
      public_achievements?: boolean;
      volunteer_history_visible?: boolean;
      community_profile_visibility?: "private" | "institution" | "community" | "public";
    };
    const actorId = ctx.actor_id ?? "system";
    const privacy = updatePrivacySettings({ ...body, actor_id: actorId });
    return apiSuccess({ privacy }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "civic.manage", endpoint: "/api/v1/civic/privacy" }
);
