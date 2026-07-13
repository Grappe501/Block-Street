import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withExecutiveApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withExecutiveApi(ctx, request, (apiCtx) => {
      const role = request.nextUrl.searchParams.get("role") ?? "executive_director";
      return operationsApplicationService.getExecutiveDashboard(apiCtx.institution_id, role);
    }),
  { permission: "executive.view", endpoint: "/api/v1/executive/dashboard" }
);
