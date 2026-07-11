import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getRequest, updateRequest } from "@/lib/provisioning/engine";
import type { CreateRequestInput } from "@/lib/provisioning/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    const record = getRequest(id);
    if (!record) throw new ApiError("RESOURCE_NOT_FOUND", "Request not found.", 404);
    return apiSuccess({ request: record }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "institutions.view", endpoint: "/api/v1/institutions/requests/{id}" }
);

export const PATCH = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as Partial<CreateRequestInput>;
    try {
      const record = updateRequest(id, body, ctx.actor_id ?? "system");
      return apiSuccess({ request: record }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Update failed", 400);
    }
  },
  { permission: "institutions.request", endpoint: "/api/v1/institutions/requests/{id}" }
);
