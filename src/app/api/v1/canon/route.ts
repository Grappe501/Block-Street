import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withEvolutionApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, (apiCtx) => ({
      canon: operationsApplicationService.getOpsCanon(apiCtx.institution_id),
      registry: operationsApplicationService.auditOpsCanon(apiCtx.institution_id),
    })),
  { permission: "evolution.view", endpoint: "/api/v1/canon" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { canon_id: string };
      return operationsApplicationService.publishOpsCanon(body.canon_id, apiCtx.actor_human_id);
    }),
  { permission: "evolution.manage", endpoint: "/api/v1/canon" }
);
