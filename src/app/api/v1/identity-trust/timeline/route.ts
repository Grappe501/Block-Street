import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getIdentityTimeline } from "@/lib/identity-trust/history";
import { getHumanIdentity } from "@/lib/identity-trust/engine";
import { loadHumanIdentities } from "@/lib/identity-trust/data";

export const GET = withApiGateway(
  async (ctx, request) => {
    const globalHumanId = request.nextUrl.searchParams.get("global_human_id");
    const userId = request.nextUrl.searchParams.get("user_id");
    let ghid = globalHumanId;
    let identity = userId ? getHumanIdentity(userId) : null;
    if (!ghid && identity) ghid = identity.global_human_id;
    if (ghid && !identity) identity = loadHumanIdentities().find((i) => i.global_human_id === ghid) ?? null;
    if (!ghid) throw new Error("global_human_id or user_id is required");
    const events = getIdentityTimeline(ghid);
    return apiSuccess(
      {
        global_human_id: ghid,
        user_id: identity?.user_id ?? userId,
        public_name: identity?.public_name ?? "",
        events,
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/timeline" }
);
