import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withWorkforceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withWorkforceApi(ctx, request, (apiCtx) => {
      const humanId = request.nextUrl.searchParams.get("human_id") ?? undefined;
      return { availability: operationsApplicationService.listAvailability(apiCtx.institution_id, humanId) };
    }),
  { permission: "civic_action.view", endpoint: "/api/v1/workforce/availability" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withWorkforceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        human_id: string;
        schedule_type: "daily" | "weekly" | "seasonal" | "special_events" | "recurring" | "emergency";
        weekly_hours_available: number;
        emergency_available?: boolean;
      };
      return operationsApplicationService.updateAvailability({
        human_id: body.human_id,
        institution_id: apiCtx.institution_id,
        schedule_type: body.schedule_type,
        weekly_hours_available: body.weekly_hours_available,
        emergency_available: body.emergency_available,
      });
    }),
  { permission: "civic_action.manage", endpoint: "/api/v1/workforce/availability" }
);
