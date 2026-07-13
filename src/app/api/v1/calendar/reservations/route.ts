import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCalendarApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCalendarApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        resource_id: string;
        start_time: string;
        end_time: string;
        mission_id?: string;
        title: string;
      };
      const calendar = operationsApplicationService.getCanonicalCalendar(apiCtx.institution_id);
      return operationsApplicationService.reserveOnCalendar({
        institution_id: apiCtx.institution_id,
        calendar_id: calendar.calendar_id,
        resource_id: body.resource_id,
        human_id: apiCtx.actor_human_id,
        mission_id: body.mission_id,
        start_time: body.start_time,
        end_time: body.end_time,
        title: body.title,
      });
    }),
  { permission: "calendar.manage", endpoint: "/api/v1/calendar/reservations" }
);
