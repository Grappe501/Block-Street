import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listInstitutionModules } from "@/lib/provisioning/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return apiSuccess(
      { modules: listInstitutionModules(id) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "institutions.view", endpoint: "/api/v1/institutions/{id}/modules" }
);
