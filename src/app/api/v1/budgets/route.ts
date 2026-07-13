import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withResourcesApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withResourcesApi(ctx, request, (apiCtx) => {
      const scopeId = request.nextUrl.searchParams.get("scope_id") ?? undefined;
      return { budgets: operationsApplicationService.listBudgets(apiCtx.institution_id, scopeId) };
    }),
  { permission: "resources.view", endpoint: "/api/v1/budgets" }
);
