import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listTemplates } from "@/lib/provisioning/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess({ templates: listTemplates() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }),
  { permission: "institutions.view", endpoint: "/api/v1/institution-templates" }
);
