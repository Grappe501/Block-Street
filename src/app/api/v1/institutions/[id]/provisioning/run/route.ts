import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { getInstitution, runProvisioning } from "@/lib/provisioning/engine";
import { getRequest } from "@/lib/provisioning/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    const inst = getInstitution(id);
    if (!inst?.request_id) {
      const body = (await request.json().catch(() => ({}))) as { request_id?: string };
      if (!body.request_id) throw new ApiError("INVALID_REQUEST", "No request linked to institution.", 400);
      const institution = runProvisioning(body.request_id, ctx.actor_id ?? "system");
      return apiSuccess({ institution }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const req = getRequest(inst.request_id);
    if (!req) throw new ApiError("RESOURCE_NOT_FOUND", "Linked request not found.", 404);
    const institution = runProvisioning(req.id, ctx.actor_id ?? "system");
    return apiSuccess({ institution }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "institutions.provision", endpoint: "/api/v1/institutions/{id}/provisioning/run" }
);
