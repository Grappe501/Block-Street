import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withCertificationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withCertificationApi(ctx, request, (apiCtx) => ({
      audits: operationsApplicationService.listOpsAudits(apiCtx.institution_id),
    })),
  { permission: "certification.view", endpoint: "/api/v1/audits" }
);

export const POST = withApiGateway(
  async (ctx, request) =>
    withCertificationApi(ctx, request, async (apiCtx) => {
      const body = (await request.json()) as { subject: string; audit_type?: string };
      return operationsApplicationService.runOpsAudit({
        institution_id: apiCtx.institution_id,
        subject: body.subject,
        conducted_by: apiCtx.actor_human_id,
        audit_type: body.audit_type as Parameters<typeof operationsApplicationService.runOpsAudit>[0]["audit_type"],
      });
    }),
  { permission: "certification.manage", endpoint: "/api/v1/audits" }
);
