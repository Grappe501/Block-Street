import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { loadAliasRequests } from "@/lib/identity-trust/wave1/data";
import { submitAliasRequest } from "@/lib/identity-trust/wave1/engine";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess(loadAliasRequests().filter((a) => a.human_id === ctx.actor_id), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/aliases" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const req = submitAliasRequest({
      human_id: ctx.actor_id!,
      requested_alias: body.requested_alias as string,
      alias_type: body.alias_type as Parameters<typeof submitAliasRequest>[0]["alias_type"],
      reason: body.reason as string,
    });
    return apiSuccess(req, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity/aliases" }
);
