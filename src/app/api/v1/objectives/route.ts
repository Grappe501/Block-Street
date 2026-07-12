import { withApiGateway } from "@/lib/api/http";
import { createObjective, queryObjectiveCollection } from "@/lib/civic-action/builds/11.2/api";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return queryObjectiveCollection(apiCtx, {
        initiative_id: sp.get("initiative_id") ?? undefined,
        institution_id: sp.get("institution_id") ?? undefined,
        status: sp.get("status") ?? undefined,
        objective_type: sp.get("objective_type") ?? undefined,
        owner_human_id: sp.get("owner_human_id") ?? undefined,
        search: sp.get("search") ?? sp.get("q") ?? undefined,
        cursor: sp.get("cursor") ?? undefined,
        limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/objectives" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown>;
        return createObjective(apiCtx, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/objectives" }
);
