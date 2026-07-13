import { withApiGateway } from "@/lib/api/http";
import { createKnowledgeArtifact, queryArtifactCollection } from "@/lib/civic-action/builds/11.12/api";
import { withKnowledgeApi } from "@/lib/civic-action/builds/11.12/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return queryArtifactCollection(apiCtx, {
        initiative_id: sp.get("initiative_id") ?? undefined,
        institution_id: sp.get("institution_id") ?? undefined,
        status: sp.get("status") ?? undefined,
        artifact_type: sp.get("artifact_type") ?? undefined,
        domain_id: sp.get("domain_id") ?? undefined,
        search: sp.get("search") ?? sp.get("q") ?? undefined,
        cursor: sp.get("cursor") ?? undefined,
        limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
        include_historical: sp.get("include_historical") === "true",
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/knowledge" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withKnowledgeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown>;
        return createKnowledgeArtifact(apiCtx, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/knowledge" }
);
