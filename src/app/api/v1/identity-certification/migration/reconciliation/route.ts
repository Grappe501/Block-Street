import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getMigrationReconciliation, runMigrationInventory, validateMigration } from "@/lib/identity-trust/wave7/migration-cert";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(getMigrationReconciliation(), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/migration/reconciliation" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json().catch(() => ({}))) as { action?: string; certification_id?: string };
    if (body.action === "inventory") {
      return apiSuccess(runMigrationInventory(), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    const certificationId = body.certification_id ?? "migration-validate";
    return apiSuccess(validateMigration(certificationId), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-certification/migration/reconciliation" }
);
