import type { BuildProgress } from "@/lib/data";

export function AdminBuildLog({ progress }: { progress: BuildProgress }) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Build Chronicle</h2>
        <p className="mt-1 text-sm text-slate-500">
          Chronological record of every build step. Also in docs/build-log/BUILD-LOG.md
        </p>
      </div>

      <div className="space-y-4">
        {progress.buildLog.map((entry, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3">
              <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
                Phase {entry.phase}
              </span>
              <span className="text-sm text-slate-400">{entry.date}</span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-slate-900">{entry.title}</h3>
            <p className="mt-1 text-slate-600">{entry.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
