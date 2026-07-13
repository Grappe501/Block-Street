import { withApiGateway } from "@/lib/api/http";
import { operationsApplicationService } from "@/lib/civic-action/builds/11.6/application-service";
import { withFederationApi } from "@/lib/civic-action/builds/11.6/api/http-helpers";

export const GET = withApiGateway(
  async (ctx, request) =>
    withFederationApi(ctx, request, () => {
      const parts = request.nextUrl.pathname.split("/");
      const federationId = parts[parts.indexOf("federations") + 1] ?? "";
      const federation = operationsApplicationService.getFederation(federationId);
      if (!federation) return { federation: null, error: "not_found" };
      return { federation };
    }),
  { permission: "federation.view", endpoint: "/api/v1/federations/{id}" }
);
