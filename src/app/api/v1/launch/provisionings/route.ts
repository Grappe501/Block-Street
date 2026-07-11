import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listProvisionings, createProvisioning } from "@/lib/launch/engine";
import type { CreateProvisioningInput } from "@/lib/launch/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const status = request.nextUrl.searchParams.get("status") ?? undefined;
    return apiSuccess(
      { provisionings: listProvisionings(status ? { status: status as never } : undefined) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "launch.view", endpoint: "/api/v1/launch/provisionings" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as CreateProvisioningInput;
    const record = createProvisioning(body);
    return apiSuccess({ provisioning: record }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "launch.provision", endpoint: "/api/v1/launch/provisionings" }
);
