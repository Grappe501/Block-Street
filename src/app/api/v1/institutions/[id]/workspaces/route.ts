import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listInstitutionWorkspaces } from "@/lib/provisioning/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return apiSuccess(
      { workspaces: listInstitutionWorkspaces(id) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "institutions.view", endpoint: "/api/v1/institutions/{id}/workspaces" }
);
