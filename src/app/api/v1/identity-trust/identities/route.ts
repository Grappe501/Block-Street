import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listHumanIdentities } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const organizationId = request.nextUrl.searchParams.get("organization_id") ?? undefined;
    return apiSuccess(listHumanIdentities(organizationId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/identities" }
);
