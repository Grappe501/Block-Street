import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { enterInstitutionContext, leaveInstitutionMembership } from "@/lib/identity-trust/federation";
import { loadFederationMembershipsV4 } from "@/lib/identity-trust/wave4/data";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string;
    const institutionId = body.institution_id as string;

    if (action === "enter") {
      const context = enterInstitutionContext(ctx.actor_id!, institutionId, ctx.request_id);
      return apiSuccess(context, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    if (action === "leave") {
      const membership = loadFederationMembershipsV4().find(
        (m) => m.human_id === ctx.actor_id && m.institution_id === institutionId && m.membership_status !== "ended"
      );
      if (!membership) throw new Error("Membership not found");
      const ended = leaveInstitutionMembership(membership.id);
      return apiSuccess(ended, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    throw new Error("Unknown action");
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/me/institutions/switch" }
);
