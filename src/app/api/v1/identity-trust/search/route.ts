import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { searchIdentities } from "@/lib/identity-trust/intelligence";

export const GET = withApiGateway(
  async (ctx, request) => {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    if (!q.trim()) throw new Error("q is required");
    return apiSuccess(searchIdentities(q), { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/search" }
);
