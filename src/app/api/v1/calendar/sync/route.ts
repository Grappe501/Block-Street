import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCalendarApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCalendarApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        provider: "google" | "outlook" | "apple" | "ics" | "caldav" | "exchange";
        direction?: "inbound" | "outbound" | "bidirectional";
      };
      return operationsApplicationService.syncExternalCalendar({
        institution_id: apiCtx.institution_id,
        human_id: apiCtx.actor_human_id,
        provider: body.provider,
        direction: body.direction,
      });
    }),
  { permission: "calendar.manage", endpoint: "/api/v1/calendar/sync" }
);
