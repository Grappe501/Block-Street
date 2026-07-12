import { withApiGateway } from "@/lib/api/http";
import {
  createInitiativeDraft,
  queryInitiativeCollection,
} from "@/lib/civic-action/builds/11.1/api";
import { withInitiativeApi } from "@/lib/civic-action/builds/11.1/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      return queryInitiativeCollection(apiCtx, {
        institution_id: sp.get("institution_id") ?? undefined,
        status: sp.get("status") ?? undefined,
        initiative_type: sp.get("initiative_type") ?? undefined,
        owner_human_id: sp.get("owner_human_id") ?? undefined,
        search: sp.get("search") ?? undefined,
        cursor: sp.get("cursor") ?? undefined,
        limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
      });
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/initiatives" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withInitiativeApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as Record<string, unknown>;
        return createInitiativeDraft(apiCtx, body);
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/initiatives" }
);
