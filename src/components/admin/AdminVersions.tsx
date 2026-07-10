import type { BuildProgress } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";

export function AdminVersions({ progress }: { progress: BuildProgress }) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Version Roadmap</h2>
        <p className="mt-1 text-sm text-slate-500">
          6 phases to launch, then 8 rapid feature versions post-launch.
        </p>
      </div>

      <div className="space-y-3">
        {progress.versions.map((v) => (
          <div key={v.version} className="card flex items-center justify-between !p-4">
            <div>
              <span className="font-mono font-bold text-brand-600">v{v.version}</span>
              <p className="font-medium text-slate-900">{v.name}</p>
              {v.date && <p className="text-xs text-slate-400">{v.date}</p>}
            </div>
            <StatusBadge status={v.status === "in_progress" ? "in_progress" : v.status === "done" ? "done" : "pending"} />
          </div>
        ))}
      </div>
    </div>
  );
}
