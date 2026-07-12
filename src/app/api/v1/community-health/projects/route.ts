import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { recordCommunityProject } from "@/lib/community-health/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = await request.json();
    const project = recordCommunityProject({
      community_id: body.community_id,
      county_id: body.county_id,
      title: body.title,
      category: body.category,
      organizations_involved: body.organizations_involved ?? [],
      institution_id: body.institution_id,
      actor_id: ctx.actor_id ?? body.actor_id ?? "system",
    });
    return apiSuccess(project, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "community_health.manage", endpoint: "/api/v1/community-health/projects" }
);
