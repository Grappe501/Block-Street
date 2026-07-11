import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listUnitLeadership, assignLeadership } from "@/lib/organization/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    return apiSuccess({ leadership: listUnitLeadership(unitId) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "organization.view", endpoint: "/api/v1/organizational-units/{id}/leadership" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const unitId = request.nextUrl.pathname.split("/")[3] ?? "";
    const body = (await request.json()) as { position_id: string; user_id: string };
    const assignment = assignLeadership(body.position_id, body.user_id, ctx.actor_id ?? "system");
    return apiSuccess({ assignment }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "organization.manage", endpoint: "/api/v1/organizational-units/{id}/leadership" }
);
