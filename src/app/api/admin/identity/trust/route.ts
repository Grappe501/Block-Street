import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  getWave2Overview,
  migrateWave1HumansToWave2,
  runWave2Certification,
} from "@/lib/identity-trust/wave2/engine";
import { listLedgerForHuman, verifyLedgerIntegrity } from "@/lib/identity-trust/wave2/ledger";
import { loadVerificationStatements, loadIdentityChallenges } from "@/lib/identity-trust/wave2/data";

export const GET = withAdmin((ctx, request) => {
  migrateWave1HumansToWave2(ctx.user_id);
  const humanId = request.nextUrl.searchParams.get("human_id");
  return NextResponse.json({
    overview: getWave2Overview(),
    certification: runWave2Certification(),
    verification_statements: loadVerificationStatements(),
    challenges: loadIdentityChallenges(),
    ledger_integrity: verifyLedgerIntegrity(humanId ?? undefined),
    ledger: humanId ? listLedgerForHuman(humanId, 100) : undefined,
  });
});
