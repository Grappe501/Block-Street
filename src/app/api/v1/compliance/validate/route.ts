import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCertificationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const POST = withApiGateway(
  async (ctx, request) =>
    withCertificationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { requirement: string; evidence_refs: string[] };
      return operationsApplicationService.validateOpsCompliance({
        institution_id: apiCtx.institution_id,
        requirement: body.requirement,
        evidence_refs: body.evidence_refs,
      });
    }),
  { permission: "certification.manage", endpoint: "/api/v1/compliance/validate" }
);
