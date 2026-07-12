import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listEdges } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const relationshipType = request.nextUrl.searchParams.get("relationship_type") ?? undefined;
    const fromNode = request.nextUrl.searchParams.get("from_node") ?? undefined;
    const toNode = request.nextUrl.searchParams.get("to_node") ?? undefined;
    return apiSuccess(listEdges({ institution_id: institutionId, relationship_type: relationshipType, from_node: fromNode, to_node: toNode }), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/edges" }
);
