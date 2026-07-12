import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { createNode, listNodes } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const nodeType = request.nextUrl.searchParams.get("node_type") ?? undefined;
    const county = request.nextUrl.searchParams.get("county") ?? undefined;
    return apiSuccess(listNodes({ institution_id: institutionId, node_type: nodeType, county }), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/nodes" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const node = createNode({
      node_type: body.node_type,
      reference_id: body.reference_id,
      label: body.label,
      institution_id: body.institution_id,
      county: body.county,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(node, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "community_relationship.manage", endpoint: "/api/v1/community-relationship/nodes" }
);
