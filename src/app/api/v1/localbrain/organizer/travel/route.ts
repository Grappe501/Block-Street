import { withApiGateway } from "@/lib/api/http";
import { livingIntelligenceApplicationService } from "@/lib/civic-action/builds/11.7/living/application-service";
import { withLocalBrainApi } from "@/lib/civic-action/builds/11.7/living/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withLocalBrainApi(ctx, request, async (apiCtx) => {
      const destination = request.nextUrl.searchParams.get("destination") ?? "Partner Office";
      const departure = request.nextUrl.searchParams.get("departure_at") ?? new Date().toISOString();
      const arrival =
        request.nextUrl.searchParams.get("arrival_at") ??
        new Date(Date.now() + 3600000).toISOString();
      return livingIntelligenceApplicationService.getTravelPlan({
        human_id: apiCtx.human_id,
        institution_id: apiCtx.institution_id,
        destination,
        departure_at: departure,
        arrival_at: arrival,
      });
    }),
  { permission: "localbrain.view", endpoint: "/api/v1/localbrain/organizer/travel" }
);
