import { withApiGateway } from "@/lib/api/http";
import { ApiError } from "@/lib/api/errors";
import { objectiveProductionService } from "@/lib/civic-action/builds/11.2/production";
import type { ExecutiveSignOffRecord } from "@/lib/civic-action/builds/11.2/production/contracts";
import { withObjectiveApi } from "@/lib/civic-action/builds/11.2/api/http-helpers";

const TYPES: ExecutiveSignOffRecord["sign_off_type"][] = ["release", "pilot", "organization", "statewide"];
const DECISIONS: ExecutiveSignOffRecord["decision"][] = ["approved", "rejected", "deferred"];

export const POST = withApiGateway(
  async (ctx, request) =>
    withObjectiveApi(
      ctx,
      request,
      async (apiCtx) => {
        const body = (await request.json()) as {
          sign_off_type?: ExecutiveSignOffRecord["sign_off_type"];
          decision?: ExecutiveSignOffRecord["decision"];
          notes_optional?: string;
        };
        if (!body.sign_off_type || !TYPES.includes(body.sign_off_type)) {
          throw new ApiError("VALIDATION_ERROR", `sign_off_type must be one of: ${TYPES.join(", ")}`, 400);
        }
        if (!body.decision || !DECISIONS.includes(body.decision)) {
          throw new ApiError("VALIDATION_ERROR", `decision must be one of: ${DECISIONS.join(", ")}`, 400);
        }
        return {
          sign_off: objectiveProductionService.recordSignOff({
            sign_off_type: body.sign_off_type,
            actor_human_id: apiCtx.actor_human_id,
            institution_id: apiCtx.institution_id,
            decision: body.decision,
            notes_optional: body.notes_optional,
          }),
        };
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.view", endpoint: "/api/v1/objectives/production/sign-off" }
);
