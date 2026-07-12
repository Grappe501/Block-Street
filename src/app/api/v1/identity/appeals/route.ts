import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { submitIdentityAppeal, listAppealsForHuman } from "@/lib/identity-trust/wave3/appeals";

export const GET = withApiGateway(
  async (ctx) =>
    apiSuccess({ appeals: listAppealsForHuman(ctx.actor_id!) }, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    }),
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/appeals/me" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const appeal = submitIdentityAppeal({
      case_id: body.case_id as string,
      appellant_human_id: ctx.actor_id!,
      appeal_ground: body.appeal_ground as Parameters<typeof submitIdentityAppeal>[0]["appeal_ground"],
      statement: body.statement as string,
      new_evidence_references: body.new_evidence_references as string[] | undefined,
      requested_remedy: body.requested_remedy as string,
    });
    return apiSuccess(appeal, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity/appeals" }
);
