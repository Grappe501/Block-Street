import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { addVerification, listVerificationsForUser } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const userId = request.nextUrl.searchParams.get("user_id");
    if (!userId || !ctx.actor_id) throw new Error("user_id is required");
    return apiSuccess(listVerificationsForUser(userId, ctx.actor_id), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/verifications" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const verifierId = (body.verifier_user_id as string) ?? ctx.actor_id;
    if (!verifierId) throw new Error("verifier_user_id is required");
    const record = addVerification({
      subject_user_id: body.subject_user_id as string,
      verifier_user_id: verifierId,
      relationship: body.relationship as string,
      verification_method: body.verification_method as Parameters<typeof addVerification>[0]["verification_method"],
      confidence: body.confidence as Parameters<typeof addVerification>[0]["confidence"],
      notes_private: body.notes_private as string | undefined,
      independent: body.independent as boolean | undefined,
    });
    return apiSuccess(record, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/verifications" }
);
