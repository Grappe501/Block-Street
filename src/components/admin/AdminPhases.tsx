"use client";

import type { BuildProgress, Phase } from "@/lib/data";
import { StatusBadge, ProgressBar } from "@/components/StatusBadge";

export function AdminPhases({
  progress,
  selectedPhase,
  onSelectPhase,
  onBack,
}: {
  progress: BuildProgress;
  selectedPhase: Phase | null;
  onSelectPhase: (phase: Phase) => void;
  onBack: () => void;
}) {
  if (selectedPhase) {
    const done = selectedPhase.steps.filter((s) => s.status === "done").length;
    const total = selectedPhase.steps.length;
    const pct = Math.round((done / total) * 100);

    return (
      <div>
        <button onClick={onBack} className="text-sm text-brand-600 hover:underline">
          ← All Phases
        </button>
        <div className="mt-4 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">
            Phase {selectedPhase.id}: {selectedPhase.name}
          </h2>
          <StatusBadge status={selectedPhase.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">{selectedPhase.docPath}</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <ProgressBar percent={pct} />
          </div>
          <span className="text-sm font-semibold text-slate-600">{done}/{total} ({pct}%)</span>
        </div>

        <div className="mt-8 space-y-2">
          {selectedPhase.steps.map((step) => (
            <div
              key={step.id}
              className="card flex items-start justify-between gap-4 !p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-xs text-slate-400">{step.id}</span>
                <div>
                  <p className="font-medium text-slate-900">{step.name}</p>
                  {step.notes && (
                    <p className="mt-0.5 text-sm text-slate-500">{step.notes}</p>
                  )}
                </div>
              </div>
              <StatusBadge status={step.status} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">All Build Phases</h2>
      <p className="mt-1 text-slate-600">Click any phase to drill down into individual steps.</p>

      <div className="mt-8 space-y-4">
        {progress.phases.map((phase) => {
          const done = phase.steps.filter((s) => s.status === "done").length;
          const inProg = phase.steps.filter((s) => s.status === "in_progress").length;
          const total = phase.steps.length;
          const pct = Math.round((done / total) * 100);

          return (
            <button
              key={phase.id}
              onClick={() => onSelectPhase(phase)}
              className="card w-full text-left transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-brand-600">Phase {phase.id}</span>
                  <p className="text-lg font-bold text-slate-900">{phase.name}</p>
                </div>
                <StatusBadge status={phase.status} />
              </div>
              <div className="mt-3 flex gap-4 text-sm text-slate-500">
                <span className="text-green-600">{done} done</span>
                <span className="text-amber-600">{inProg} in progress</span>
                <span>{total - done - inProg} pending</span>
              </div>
              <div className="mt-3">
                <ProgressBar percent={pct} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
