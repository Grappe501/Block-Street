import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listEvents, recordRelationshipEvent } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const edgeId = request.nextUrl.searchParams.get("edge_id") ?? undefined;
    const limit = request.nextUrl.searchParams.get("limit");
    return apiSuccess(listEvents({ institution_id: institutionId, edge_id: edgeId, limit: limit ? Number(limit) : undefined }), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/events" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const result = recordRelationshipEvent({
      from_node: body.from_node,
      to_node: body.to_node,
      relationship_type: body.relationship_type,
      event_type: body.event_type,
      category: body.category,
      institution_id: body.institution_id,
      source: body.source ?? "api",
      verification: body.verification,
      duration_minutes: body.duration_minutes,
      notes: body.notes,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "community_relationship.manage", endpoint: "/api/v1/community-relationship/events" }
);
