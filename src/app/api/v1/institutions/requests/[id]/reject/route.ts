import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { rejectRequest } from "@/lib/provisioning/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as { reason?: string };
    try {
      const record = rejectRequest(id, ctx.actor_id ?? "system", body.reason ?? "Rejected");
      return apiSuccess({ request: record }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Rejection failed", 400);
    }
  },
  { permission: "institutions.approve", endpoint: "/api/v1/institutions/requests/{id}/reject" }
);
