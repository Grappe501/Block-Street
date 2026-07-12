import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { joinFederation, listFederationMembers, syncSharedPlaybooks } from "@/lib/federation/engine";
import type { FederationTrustLevel } from "@/lib/federation/types";

export const GET = withApiGateway(
  async (ctx) => {
    return apiSuccess({ members: listFederationMembers() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.view", endpoint: "/api/v1/federation/membership" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      institution_id: string;
      institution_name: string;
      trust_level?: FederationTrustLevel;
      action?: string;
      institution_ids?: string[];
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "sync_playbooks" && body.institution_ids) {
        return apiSuccess(
          { playbooks: syncSharedPlaybooks(body.institution_ids, actorId) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
        );
      }
      const member = joinFederation({
        institution_id: body.institution_id,
        institution_name: body.institution_name,
        trust_level: body.trust_level ?? "shared_assets",
        actor_id: actorId,
      });
      return apiSuccess({ member }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Membership action failed", 400);
    }
  },
  { permission: "federation.manage", endpoint: "/api/v1/federation/membership" }
);
