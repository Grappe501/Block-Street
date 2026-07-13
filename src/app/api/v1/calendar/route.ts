import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCalendarApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCalendarApi(ctx, request, (apiCtx) => ({
      calendar: operationsApplicationService.getCanonicalCalendar(apiCtx.institution_id),
    })),
  { permission: "calendar.view", endpoint: "/api/v1/calendar" }
);
