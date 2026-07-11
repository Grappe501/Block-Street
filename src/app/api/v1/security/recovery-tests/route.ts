import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listBackups, runRecoveryTest } from "@/lib/security/engine";

export const GET = withApiGateway(
  async (ctx) => {
    const data = listBackups();
    return apiSuccess({ tests: data.recovery_tests }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "security.view", endpoint: "/api/v1/security/recovery-tests" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    return withIdempotentPost(ctx, request, "/api/v1/security/recovery-tests", async (body) => {
      const test = runRecoveryTest({
        system: String(body.system ?? "database"),
        backup_reference: String(body.backup_reference ?? "latest"),
        owner: ctx.actor_id ?? "system",
      });
      return { test };
    });
  },
  { permission: "security.manage_recovery", endpoint: "/api/v1/security/recovery-tests" }
);
