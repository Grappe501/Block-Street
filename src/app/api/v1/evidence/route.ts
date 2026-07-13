import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCertificationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCertificationApi(ctx, request, (apiCtx) => ({
      evidence: operationsApplicationService.listOpsEvidence(apiCtx.institution_id),
    })),
  { permission: "certification.view", endpoint: "/api/v1/evidence" }
);
