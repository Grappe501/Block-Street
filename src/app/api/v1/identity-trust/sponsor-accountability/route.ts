import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { detectBadActorSponsor } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const sponsorId = request.nextUrl.searchParams.get("sponsor_id");
    if (!sponsorId) throw new Error("sponsor_id is required");
    return apiSuccess(detectBadActorSponsor(sponsorId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/sponsor-accountability" }
);
