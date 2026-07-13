import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withEvolutionApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withEvolutionApi(ctx, request, (apiCtx) =>
      operationsApplicationService.getOpsBuildGenome(apiCtx.institution_id)
    ),
  { permission: "evolution.view", endpoint: "/api/v1/build-genome" }
);
