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
        {"activeProgram" in project && project.activeProgram && (
          <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {String(project.activeProgram)}
          </p>
        )}
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
            {"productionCommit" in project && project.productionCommit && (
              <p className="mt-1 font-mono text-xs text-slate-500">{String(project.productionCommit)}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-slate-500">Database</p>
            <StatusBadge status={project.databaseStatus === "not_connected" ? "pending" : "done"} />
            <p className="mt-1 text-xs text-slate-500">JSON seed + Netlify Blobs (no Postgres yet)</p>
          </div>
        </div>
        {"currentDesignCycle" in project && project.currentDesignCycle && (
          <p className="mt-4 text-sm text-slate-600">
            <span className="font-medium text-slate-800">Design cycle:</span> {String(project.currentDesignCycle)}
          </p>
        )}
      </div>

      {/* Factory Layer */}
      {"implementationVolumes" in progress && progress.implementationVolumes && (
        <div className="card border-indigo-300 bg-indigo-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700">Factory Layer</span>
            <StatusBadge status={progress.implementationVolumes.status} />
          </div>
          <p className="mt-2 font-bold text-indigo-950">{progress.implementationVolumes.name}</p>
          <p className="mt-1 text-sm text-indigo-800">{progress.implementationVolumes.question}</p>
          <p className="mt-2 text-xs text-indigo-600">
            Volumes 1–5 + CKK delivered · Phase 11 Living Intelligence Architecture Complete · V1 Certification active
          </p>
        </div>
      )}

      {"volume0" in progress && progress.volume0 && (
        <div className="card border-violet-300 bg-violet-50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-violet-700">Volume 0</span>
            <StatusBadge status={progress.volume0.status} />
          </div>
          <p className="mt-2 font-bold text-violet-950">{progress.volume0.name}</p>
          <p className="mt-1 text-sm text-violet-800">{progress.volume0.question}</p>
          <p className="mt-2 text-xs text-violet-600">
            [{progress.volume0.requirement}] · Read before any production code
          </p>
        </div>
      )}

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
