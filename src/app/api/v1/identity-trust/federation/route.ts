import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  getFederationIdentityView,
  grantFederationTrust,
  listFederationMemberships,
  transferInstitutionMembership,
} from "@/lib/identity-trust/federation";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id");
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    if (userId) {
      const view = getFederationIdentityView(userId);
      if (!view) throw new Error("Federation identity not found");
      return apiSuccess(view, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    return apiSuccess(listFederationMemberships(institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/federation" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "grant_federation_trust") {
      grantFederationTrust(body.user_id as string, ctx.actor_id!);
      return apiSuccess({ granted: true }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const membership = transferInstitutionMembership({
      membership_id: body.membership_id as string,
      new_institution_id: body.new_institution_id as string,
      new_organization_id: body.new_organization_id as string,
      actor_id: ctx.actor_id!,
    });
    return apiSuccess(membership, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/federation" }
);
