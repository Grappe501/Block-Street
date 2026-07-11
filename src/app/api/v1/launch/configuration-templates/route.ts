import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listConfigurationTemplates } from "@/lib/launch/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      { templates: listConfigurationTemplates() },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { permission: "launch.view", endpoint: "/api/v1/launch/configuration-templates" }
);
