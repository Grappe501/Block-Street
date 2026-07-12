import { withApiGateway } from "@/lib/api/http";
import { listObjectiveDomainEvents } from "@/lib/civic-action/builds/11.2/events/event-replay";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(ctx, request, (apiCtx) => {
      const sp = request.nextUrl.searchParams;
      const initiativeId = sp.get("initiative_id") ?? undefined;
      const events = listObjectiveDomainEvents(initiativeId, sp.get("limit") ? Number(sp.get("limit")) : 100);
      return {
        events: events.map((e) => ({
          event_id: e.event_id,
          event_type: e.event_type,
          initiative_id: e.initiative_id,
          entity_id: e.entity_id,
          entity_type: e.entity_type,
          occurred_at: e.occurred_at,
        })),
        institution_id: apiCtx.institution_id,
      };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/timeline/objectives" }
);
