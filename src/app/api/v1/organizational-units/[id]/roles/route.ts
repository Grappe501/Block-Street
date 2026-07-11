import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listUnitRoles, assignUnitRole } from "@/lib/organization/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    return apiSuccess({ roles: listUnitRoles(unitId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "organization.view", endpoint: "/api/v1/organizational-units/{id}/roles" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as { user_id: string; role_id: string; inheritance_mode?: "unit_only" | "reporting_access_only" };
    const assignment = assignUnitRole(unitId, body.user_id, body.role_id, ctx.actor_id ?? "system", body.inheritance_mode ?? "unit_only");
    return apiSuccess({ assignment }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "organization.manage", endpoint: "/api/v1/organizational-units/{id}/roles" }
);
