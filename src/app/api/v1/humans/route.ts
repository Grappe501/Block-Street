import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadHumanIdentities } from "@/lib/identity-trust/data";
import { declarePublicIdentity, getWave1Overview } from "@/lib/identity-trust/wave1/engine";
import { getIdentityTimeline } from "@/lib/identity-trust/history";

export const GET = withApiGateway(
  async (ctx, request) => {
    const humanId = request.nextUrl.searchParams.get("human_id");
    const globalHumanId = request.nextUrl.searchParams.get("global_human_id");
    const timeline = request.nextUrl.searchParams.get("timeline") === "true";

    if (!humanId && !globalHumanId) {
      return apiSuccess(getWave1Overview(), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    const human = loadHumanIdentities().find(
      (h) => h.user_id === humanId || h.global_human_id === humanId || h.global_human_id === globalHumanId
    );
    if (!human) throw new Error("Human not found");

    if (timeline) {
      return apiSuccess(
        {
          global_human_id: human.global_human_id,
          user_id: human.user_id,
          public_name: human.public_name,
          events: getIdentityTimeline(human.global_human_id),
        },
        { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
      );
    }

    return apiSuccess(human, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/humans" }
);

export const PATCH = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const humanId = (body.human_id as string) ?? ctx.actor_id;
    if (!humanId) throw new Error("human_id is required");
    const human = loadHumanIdentities().find((h) => h.user_id === humanId);
    if (!human) throw new Error("Human not found");
    const version = declarePublicIdentity({
      human_id: humanId,
      global_human_id: human.global_human_id,
      public_name: body.public_name as string,
      preferred_short_name: body.preferred_short_name as string | undefined,
      identity_basis: body.identity_basis as Parameters<typeof declarePublicIdentity>[0]["identity_basis"],
    });
    return apiSuccess(version, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/humans" }
);
