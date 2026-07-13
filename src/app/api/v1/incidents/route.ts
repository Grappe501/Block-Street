import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResilienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, (apiCtx) => {
      const status = request.nextUrl.searchParams.get("status") as "active" | "closed" | null;
      return { incidents: operationsApplicationService.listIncidents(apiCtx.institution_id, status ?? undefined) };
    }),
  { permission: "resilience.view", endpoint: "/api/v1/incidents" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        title: string;
        description: string;
        incident_level: 1 | 2 | 3 | 4 | 5;
      };
      return operationsApplicationService.activateIncident({
        institution_id: apiCtx.institution_id,
        title: body.title,
        description: body.description,
        incident_level: body.incident_level,
        incident_commander: apiCtx.actor_human_id,
      });
    }),
  { permission: "resilience.manage", endpoint: "/api/v1/incidents" }
);
