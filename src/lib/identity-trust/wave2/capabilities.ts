import { loadWave2Policy } from "./data";
import type { IdentityAssuranceState, InstitutionTrustState } from "./types";

export function computeCapabilities(
  assurance: IdentityAssuranceState,
  institutionTrust: InstitutionTrustState
): Record<string, boolean | string> {
  const matrix = loadWave2Policy().capability_matrix;
  const stage =
    assurance === "verified" || assurance === "strongly_verified"
      ? institutionTrust === "institution_leader"
        ? "leader"
        : institutionTrust === "active_trusted_member"
          ? "trusted"
          : "verified"
      : "sponsored";

  const result: Record<string, boolean | string> = {};
  for (const [cap, levels] of Object.entries(matrix)) {
    const val = levels[stage];
    result[cap] = val === true ? true : val === false ? false : String(val);
  }
  return result;
}

export function canPerformCapability(
  humanId: string,
  capability: string,
  view: { assurance_state: IdentityAssuranceState; institution_trust: InstitutionTrustState }
): boolean {
  const caps = computeCapabilities(view.assurance_state, view.institution_trust);
  const val = caps[capability];
  return val === true;
}
