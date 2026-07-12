import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listMyInstitutions } from "@/lib/identity-trust/wave4/memberships";
import { getActiveContext } from "@/lib/identity-trust/wave4/context";
import { getPublicAssuranceClaims } from "@/lib/identity-trust/wave4/assurance";
import { getInstitutionDisplayName } from "@/lib/july14/config";

export const GET = withApiGateway(
  async (ctx) => {
    const humanId = ctx.actor_id!;
    const institutions = listMyInstitutions(humanId).map((m) => ({
      ...m,
      institution_name: getInstitutionDisplayName(m.institution_id),
    }));
    const active = getActiveContext(humanId);
    return apiSuccess(
      {
        institutions,
        active_context: active
          ? { ...active, institution_name: getInstitutionDisplayName(active.institution_id) }
          : active,
        portable_assurance: getPublicAssuranceClaims(humanId),
      },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity/me/institutions" }
);
