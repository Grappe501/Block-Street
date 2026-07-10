"use client";

import type { BuildProgress, Phase } from "@/lib/data";
import { StatusBadge, ProgressBar } from "@/components/StatusBadge";

export function AdminOverview({
  progress,
  onSelectPhase,
}: {
  progress: BuildProgress;
  onSelectPhase: (phase: Phase) => void;
}) {
  const { stats, project } = progress;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Steps", value: stats.totalSteps, color: "text-slate-900" },
          { label: "Done", value: stats.doneSteps, color: "text-green-600" },
          { label: "In Progress", value: stats.inProgressSteps, color: "text-amber-600" },
          { label: "Pending", value: stats.pendingSteps, color: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Current Status */}
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Current Build Status</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Active Phase</p>
            <p className="font-semibold">Phase {project.currentPhase}: {project.currentPhaseName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Version</p>
            <p className="font-semibold">v{project.version}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Netlify</p>
            <StatusBadge status={project.netlifyStatus === "pending" ? "pending" : "done"} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Database</p>
            <StatusBadge status={project.databaseStatus === "not_connected" ? "pending" : "done"} />
          </div>
        </div>
      </div>

      {/* Phase Cards */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Build Phases — Click to Drill Down</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {progress.phases.map((phase) => {
            const done = phase.steps.filter((s) => s.status === "done").length;
            const total = phase.steps.length;
            const pct = Math.round((done / total) * 100);
            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(phase)}
                className="card text-left transition hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-600">Phase {phase.id}</span>
                  <StatusBadge status={phase.status} />
                </div>
                <p className="mt-2 font-bold text-slate-900">{phase.name}</p>
                <p className="mt-1 text-sm text-slate-500">{done}/{total} steps complete</p>
                <div className="mt-3">
                  <ProgressBar percent={pct} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Build Log */}
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
        <div className="mt-4 space-y-3">
          {progress.buildLog.map((entry, i) => (
            <div key={i} className="flex gap-4 border-b border-slate-100 pb-3 last:border-0">
              <span className="text-sm text-slate-400">{entry.date}</span>
              <div>
                <p className="font-semibold text-slate-900">{entry.title}</p>
                <p className="text-sm text-slate-600">{entry.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
