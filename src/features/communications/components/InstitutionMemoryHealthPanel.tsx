import type { MemoryGovernanceReport } from "@/lib/civic-action/builds/11.7/optimization/institutional-memory-governance";

export function InstitutionMemoryHealthPanel({ governance }: { governance: MemoryGovernanceReport }) {
  return (
    <section aria-labelledby="mem-health" className="card">
      <h2 id="mem-health" className="text-lg font-bold text-slate-900">
        Institutional Memory Health
      </h2>
      <p className="mt-1 text-sm text-slate-600">{governance.retention_policy}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Artifacts</p>
          <p className="text-2xl font-bold">{governance.artifact_count}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Institutional standards</p>
          <p className="text-2xl font-bold">{governance.knowledge_by_stage.institutional_standard}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700">Archival candidates</p>
          <p className="text-2xl font-bold">{governance.archival_candidates.length}</p>
        </div>
      </div>
    </section>
  );
}
