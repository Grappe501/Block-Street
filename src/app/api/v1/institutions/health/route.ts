import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getAttentionQueue, getProvisioningHealth, listInstitutionTypes } from "@/lib/provisioning/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(
      {
        health: getProvisioningHealth(),
        attention_queue: getAttentionQueue(),
        institution_types: listInstitutionTypes(),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    ),
  { permission: "institutions.view", endpoint: "/api/v1/institutions/health" }
);
