import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { applyPrivacyToGraph, getGraph } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const county = request.nextUrl.searchParams.get("county") ?? undefined;
    const userId = request.nextUrl.searchParams.get("user_id") ?? undefined;
    const graph = getGraph({ institution_id: institutionId, county });
    return apiSuccess(applyPrivacyToGraph(graph, userId ?? undefined, institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/graph" }
);
