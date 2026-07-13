import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCalendarApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCalendarApi(ctx, request, (apiCtx) => {
      const missionId = request.nextUrl.searchParams.get("mission_id") ?? undefined;
      const humanId = request.nextUrl.searchParams.get("human_id") ?? undefined;
      const resourceId = request.nextUrl.searchParams.get("resource_id") ?? undefined;
      return { events: operationsApplicationService.listCalendarEvents(apiCtx.institution_id, { missionId, humanId, resourceId }) };
    }),
  { permission: "calendar.view", endpoint: "/api/v1/calendar/events" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCalendarApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        event_type: string;
        title: string;
        description: string;
        start_time: string;
        end_time: string;
        mission_id?: string;
        resource_ids?: string[];
        human_ids?: string[];
        visibility?: string;
      };
      const calendar = operationsApplicationService.getCanonicalCalendar(apiCtx.institution_id);
      return operationsApplicationService.createCalendarEvent({
        institution_id: apiCtx.institution_id,
        calendar_id: calendar.calendar_id,
        event_type: body.event_type as "meeting",
        title: body.title,
        description: body.description,
        start_time: body.start_time,
        end_time: body.end_time,
        mission_id: body.mission_id,
        resource_ids: body.resource_ids,
        human_ids: body.human_ids ?? [apiCtx.actor_human_id],
        visibility: body.visibility as "institution" | undefined,
        created_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "calendar.manage", endpoint: "/api/v1/calendar/events" }
);
