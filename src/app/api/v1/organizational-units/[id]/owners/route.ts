import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listUnitOwners, assignUnitOwner } from "@/lib/organization/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    return apiSuccess({ owners: listUnitOwners(unitId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "organization.view", endpoint: "/api/v1/organizational-units/{id}/owners" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as { owner_type: string; user_id: string };
    const owner = assignUnitOwner(unitId, body.owner_type, body.user_id, ctx.actor_id ?? "system");
    return apiSuccess({ owner }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "organization.manage", endpoint: "/api/v1/organizational-units/{id}/owners" }
);
