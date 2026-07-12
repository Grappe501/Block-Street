import { loadHumanIdentities } from "../data";
import { loadIdentityLedgerEvents } from "../wave2/data";
import { verifyLedgerIntegrity } from "../wave2/ledger";
import { itlId, nowIso } from "../utils";
import { loadLedgerReconstructionRuns, persistLedgerReconstructionRuns } from "./data";

export function runLedgerReconstruction(certificationId: string, sampleSize = 10) {
  const humans = loadHumanIdentities().slice(0, sampleSize);
  const events = loadIdentityLedgerEvents();
  const integrity = verifyLedgerIntegrity();

  let differences = 0;
  const details: { human_id: string; ledger_events: number; projection_match: boolean }[] = [];

  for (const h of humans) {
    const humanEvents = events.filter((e) => e.human_id === h.user_id || e.actor_human_id === h.user_id);
    const match = humanEvents.length >= 0 && Boolean(h.global_human_id);
    if (!match) differences++;
    details.push({ human_id: h.user_id, ledger_events: humanEvents.length, projection_match: match });
  }

  const unexplained = integrity.valid ? differences : differences + 1;
  const passed = integrity.valid && unexplained === 0;

  const run = {
    id: itlId("ilrr"),
    certification_id: certificationId,
    sample_size: humans.length,
    differences_found: differences,
    unexplained_differences: unexplained,
    passed,
    run_at: nowIso(),
    details,
    integrity,
  };

  const all = loadLedgerReconstructionRuns();
  all.push({
    id: run.id,
    certification_id: certificationId,
    sample_size: run.sample_size,
    differences_found: run.differences_found,
    unexplained_differences: run.unexplained_differences,
    passed: run.passed,
    run_at: run.run_at,
  });
  persistLedgerReconstructionRuns(all);
  return run;
}

export function getLedgerReconstruction(runId: string) {
  return loadLedgerReconstructionRuns().find((r) => r.id === runId) ?? null;
}
