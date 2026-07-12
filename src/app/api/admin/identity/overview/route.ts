import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import { getWave1Overview, listWave1Invitations, runWave1Certification } from "@/lib/identity-trust/wave1/engine";
import { listWave1Audit } from "@/lib/identity-trust/wave1/lineage";
import { loadDuplicateCandidates, loadWave1Memberships } from "@/lib/identity-trust/wave1/data";
import { loadHumanIdentities } from "@/lib/identity-trust/data";
import { getInviteTree } from "@/lib/identity-trust/engine";
import { WAVE1_INVARIANTS, checkWave1Invariants } from "@/lib/identity-trust/wave1/invariants";
import { reconcileLegacyHumans } from "@/lib/identity-trust/wave1/reconciliation";

export const GET = withAdmin((ctx) => {
  reconcileLegacyHumans(ctx.user_id);
  const certification = runWave1Certification();
  return NextResponse.json({    overview: getWave1Overview(),
    invariants: checkWave1Invariants(),
    invariant_docs: WAVE1_INVARIANTS,
    invitations: listWave1Invitations(),
    duplicate_candidates: loadDuplicateCandidates(),
    memberships: loadWave1Memberships(),
    humans: loadHumanIdentities(),
    lineage: getInviteTree("usr-001", 4),
    audit: listWave1Audit(50),
    certification,
  });
});
