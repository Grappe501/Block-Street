import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResilienceApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withResilienceApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        incident_id: string;
        aid_type: Parameters<typeof operationsApplicationService.requestMutualAid>[0]["aid_type"];
        description: string;
      };
      return operationsApplicationService.requestMutualAid({
        institution_id: apiCtx.institution_id,
        incident_id: body.incident_id,
        aid_type: body.aid_type,
        description: body.description,
        requested_by: apiCtx.actor_human_id,
      });
    }),
  { permission: "resilience.manage", endpoint: "/api/v1/mutual-aid" }
);
