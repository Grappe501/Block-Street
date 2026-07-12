import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { acceptMentorship, getMentorshipGraph } from "@/lib/community-relationship/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    return apiSuccess(getMentorshipGraph(institutionId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "community_relationship.view", endpoint: "/api/v1/community-relationship/mentorship" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const result = acceptMentorship({
      mentor_node_id: body.mentor_node_id,
      mentee_node_id: body.mentee_node_id,
      institution_id: body.institution_id,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "community_relationship.manage", endpoint: "/api/v1/community-relationship/mentorship" }
);
