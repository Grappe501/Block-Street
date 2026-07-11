import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { transitionProvisioning } from "@/lib/launch/engine";
import type { ProvisioningStatus } from "@/lib/launch/types";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { status: ProvisioningStatus; note?: string };
    try {
      const record = transitionProvisioning(id, body.status, body.note);
      return apiSuccess({ provisioning: record }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Transition failed.";
      throw new ApiError("INVALID_REQUEST", message, 400);
    }
  },
  { permission: "launch.manage", endpoint: "/api/v1/launch/provisionings/{id}/transition" }
);
