import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withEvolutionApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, (apiCtx) =>
      operationsApplicationService.generateOpsDocumentation(apiCtx.institution_id)
    ),
  { permission: "evolution.manage", endpoint: "/api/v1/documentation/generate" }
);
