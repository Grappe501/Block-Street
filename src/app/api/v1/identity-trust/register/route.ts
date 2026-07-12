import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { registerWithInvitation } from "@/lib/identity-trust/engine";
import { requestMeta } from "@/lib/auth/http";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const result = registerWithInvitation(
      {
        token: body.token as string,
        email: body.email as string,
        password: body.password as string,
        public_name: body.public_name as string,
        display_name: body.display_name as string | undefined,
        legal_name: body.legal_name as string | undefined,
        known_alias_approved: body.known_alias_approved as boolean | undefined,
      },
      requestMeta(request)
    );
    if ("error" in result) throw new Error(result.error);
    return apiSuccess(
      { user_id: result.user.user_id, identity: result.identity, session_id: result.session.session_id },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { public: true, endpoint: "/api/v1/identity-trust/register" }
);
