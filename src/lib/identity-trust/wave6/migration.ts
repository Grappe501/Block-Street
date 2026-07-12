import { loadIdentityCases, loadIdentityAppealRecords, loadDuplicateIdentityCases } from "../wave3/data";
import { loadIntelligenceSignals } from "../wave5/data";
import { loadSignalReferrals } from "../wave5/data";
import { createWorkItem, listWorkItems } from "./queue";
import { ensureDefaultAuthorities } from "./authority";
import { syncIntelligenceSignalsToQueue } from "./intelligence-review";

export function syncWorkItemsFromSources() {
  ensureDefaultAuthorities();
  let created = 0;

  const cases = loadIdentityCases().filter((c) => !["closed", "archived"].includes(c.status));
  for (const c of cases) {
    const exists = listWorkItems({ work_type: "identity_case" }).find((w) => w.source_id === c.id);
    if (!exists) {
      createWorkItem({
        work_type: "identity_case",
        source_type: "identity_case",
        source_id: c.id,
        subject_human_id: c.subject_human_id,
        institution_id: c.institution_id ?? undefined,
        summary: c.summary,
        severity: c.severity,
        required_authority: c.scope.startsWith("global") ? "platform_identity_reviewer" : "identity_reviewer",
        priority: c.severity === "IG-4" ? 5 : c.severity === "IG-3" ? 4 : 3,
      });
      created++;
    }
  }

  const appeals = loadIdentityAppealRecords().filter((a) => !["closed", "denied", "withdrawn"].includes(a.status));
  for (const a of appeals) {
    const exists = listWorkItems({ work_type: "identity_appeal" }).find((w) => w.source_id === a.id);
    if (!exists) {
      createWorkItem({
        work_type: "identity_appeal",
        source_type: "identity_appeal",
        source_id: a.id,
        subject_human_id: a.appellant_human_id,
        summary: `Appeal: ${a.appeal_ground}`,
        required_authority: "appeal_reviewer",
        priority: 4,
      });
      created++;
    }
  }

  const duplicates = loadDuplicateIdentityCases().filter((d) => !["merged", "distinct_confirmed"].includes(d.status));
  for (const d of duplicates) {
    const exists = listWorkItems({ work_type: "duplicate_candidate" }).find((w) => w.source_id === d.id);
    if (!exists) {
      createWorkItem({
        work_type: "duplicate_candidate",
        source_type: "duplicate_identity_case",
        source_id: d.id,
        subject_human_id: d.primary_candidate_human_id,
        summary: `Duplicate candidate: ${d.primary_candidate_human_id} / ${d.secondary_candidate_human_id}`,
        required_authority: "platform_identity_reviewer",
        priority: 4,
      });
      created++;
    }
  }

  const referrals = loadSignalReferrals().filter((r) => r.status === "open");
  for (const r of referrals) {
    const signal = loadIntelligenceSignals().find((s) => s.id === r.signal_id);
    if (!signal) continue;
    const exists = listWorkItems({ work_type: "intelligence_signal_review" }).find((w) => w.source_id === signal.id);
    if (!exists) {
      createWorkItem({
        work_type: "intelligence_signal_review",
        source_type: "intelligence_signal",
        source_id: signal.id,
        subject_human_id: signal.subject_human_ids[0],
        institution_id: signal.institution_ids[0],
        summary: signal.summary,
        severity: signal.severity,
        required_authority: "identity_reviewer",
        advisory_signal: true,
        priority: signal.priority,
      });
      created++;
    }
  }

  const intelSync = syncIntelligenceSignalsToQueue();
  created += intelSync.synced;

  return { created, total_work_items: listWorkItems().length };
}
