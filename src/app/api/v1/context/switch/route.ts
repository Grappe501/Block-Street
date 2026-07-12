import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { switchInstitutionContext } from "@/lib/identity-trust/wave4/context";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const institutionId = body.institution_id as string;
    const context = switchInstitutionContext({
      human_id: ctx.actor_id!,
      institution_id: institutionId,
      session_id: ctx.request_id,
      workspace_id: body.workspace_id as string | undefined,
    });
    return apiSuccess(context, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/context/switch" }
);
