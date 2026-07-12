import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listRequirements } from "@/lib/identity-trust/wave7/requirements";

export const GET = withApiGateway(
  async (ctx, request) => {
    const wave = request.nextUrl.searchParams.get("wave") ?? undefined;
    const domain = request.nextUrl.searchParams.get("domain") ?? undefined;
    const constitutional = request.nextUrl.searchParams.get("constitutional");
    return apiSuccess(
      listRequirements({
        wave,
        domain,
        constitutional: constitutional === null ? undefined : constitutional === "true",
      }),
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/requirements" }
);
