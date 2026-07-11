import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { revokeCertification, suspendCertification } from "@/lib/training/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const awardId = request.nextUrl.pathname.split("/")[4] ?? "";
    const action = request.nextUrl.pathname.split("/")[5] ?? "";
    const body = (await request.json()) as { reason: string };
    try {
      if (action === "suspend") {
        return apiSuccess({ award: suspendCertification(awardId, body.reason, ctx.actor_id ?? "system") }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      if (action === "revoke") {
        return apiSuccess({ award: revokeCertification(awardId, body.reason, ctx.actor_id ?? "system") }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
      }
      throw new Error("Unknown action.");
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Certification action failed", 400);
    }
  },
  { permission: "training.certify", endpoint: "/api/v1/training/certification-awards/{id}" }
);
