import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import {
  createVerificationRequest,
  listVerificationRequestsForHuman,
  respondUnableToConfirm,
  submitVerificationStatement,
} from "@/lib/identity-trust/wave2/verification";

export const GET = withApiGateway(
  async (ctx, request) => {
    const role = (request.nextUrl.searchParams.get("role") as "subject" | "verifier") ?? "subject";
    return apiSuccess(listVerificationRequestsForHuman(ctx.actor_id!, role), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/verification-requests" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string | undefined;

    if (action === "confirm") {
      const stmt = submitVerificationStatement({
        subject_human_id: body.subject_human_id as string,
        verifier_human_id: ctx.actor_id!,
        institution_id: body.institution_id as string,
        verification_request_id: body.request_id as string,
        verification_method_key: (body.verification_method_key as string) ?? "personal_knowledge",
        relationship_basis: body.relationship_basis as string,
        identity_name_confirmed: body.identity_name_confirmed as string,
        confidence: (body.confidence as "certain" | "strong" | "limited") ?? "certain",
        responsibility_accepted: Boolean(body.responsibility_accepted),
      });
      return apiSuccess(stmt, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    if (action === "unable_to_confirm") {
      const req = respondUnableToConfirm(body.request_id as string, ctx.actor_id!, body.reason as string);
      return apiSuccess(req, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    const req = createVerificationRequest({
      subject_human_id: (body.subject_human_id as string) ?? ctx.actor_id!,
      requested_verifier_human_id: body.requested_verifier_human_id as string,
      requested_by_human_id: ctx.actor_id!,
      institution_id: (body.institution_id as string) ?? "inst-block-street",
      verification_method_key: body.verification_method_key as string | undefined,
      request_reason: (body.request_reason as string) ?? "Identity confirmation requested",
    });
    return apiSuccess(req, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity/verification-requests" }
);
