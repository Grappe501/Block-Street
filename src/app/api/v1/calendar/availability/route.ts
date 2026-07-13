import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCalendarApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCalendarApi(ctx, request, (apiCtx) => {
      const humanId = request.nextUrl.searchParams.get("human_id") ?? apiCtx.actor_human_id;
      const from = request.nextUrl.searchParams.get("from") ?? new Date().toISOString();
      const to = request.nextUrl.searchParams.get("to") ?? new Date(Date.now() + 30 * 86400000).toISOString();
      return operationsApplicationService.getHumanAvailability(apiCtx.institution_id, humanId, from, to);
    }),
  { permission: "calendar.view", endpoint: "/api/v1/calendar/availability" }
);
