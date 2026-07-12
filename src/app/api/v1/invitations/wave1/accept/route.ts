import { NextRequest } from "next/server";
import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { completeWave1Activation, startWave1Acceptance } from "@/lib/identity-trust/wave1/acceptance";

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = (body.action as string) ?? "accept";

    if (action === "acceptance_start") {
      const result = startWave1Acceptance(body.token as string, body.email as string | undefined);
      return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    const result = completeWave1Activation(
      {
        token: body.token as string,
        email: body.email as string,
        password: body.password as string,
        public_name: body.public_name as string,
        preferred_short_name: body.preferred_short_name as string | undefined,
        link_existing_user_id: body.link_existing_user_id as string | undefined,
      },
      { ip: request.headers.get("x-forwarded-for") ?? undefined, userAgent: request.headers.get("user-agent") ?? undefined }
    );
    return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { public: true, endpoint: "/api/v1/invitations/wave1/accept" }
);
