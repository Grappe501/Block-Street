import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createRequest, listRequests } from "@/lib/provisioning/engine";
import type { CreateRequestInput } from "@/lib/provisioning/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    return apiSuccess(
      { requests: listRequests(status ? { status: status as never } : undefined) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "institutions.view", endpoint: "/api/v1/institutions/requests" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as CreateRequestInput;
    try {
      const record = createRequest({ ...body, requesting_user_id: body.requesting_user_id ?? ctx.actor_id ?? "system" });
      return apiSuccess({ request: record }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Failed to create request", 400);
    }
  },
  { permission: "institutions.request", endpoint: "/api/v1/institutions/requests" }
);
