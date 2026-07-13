import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCertificationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCertificationApi(ctx, request, (apiCtx) => ({
      certifications: operationsApplicationService.listOpsCertifications(apiCtx.institution_id),
    })),
  { permission: "certification.view", endpoint: "/api/v1/certifications" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCertificationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as {
        subject: string;
        standard: string;
        certification_type?: string;
      };
      return operationsApplicationService.createOpsCertification({
        institution_id: apiCtx.institution_id,
        subject: body.subject,
        standard: body.standard,
        owner: apiCtx.actor_human_id,
        certification_type: body.certification_type as Parameters<typeof operationsApplicationService.createOpsCertification>[0]["certification_type"],
      });
    }),
  { permission: "certification.manage", endpoint: "/api/v1/certifications" }
);
