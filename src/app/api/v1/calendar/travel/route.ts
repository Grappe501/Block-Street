import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCalendarApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCalendarApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        event_id: string;
        origin: string;
        destination: string;
        travel_minutes: number;
        buffer_minutes?: number;
        preparation_minutes?: number;
      };
      return operationsApplicationService.calculateTravel({
        institution_id: apiCtx.institution_id,
        event_id: body.event_id,
        origin: body.origin,
        destination: body.destination,
        travel_minutes: body.travel_minutes,
        buffer_minutes: body.buffer_minutes,
        preparation_minutes: body.preparation_minutes,
      });
    }),
  { permission: "calendar.manage", endpoint: "/api/v1/calendar/travel" }
);
