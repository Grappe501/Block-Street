import type { StepStatus } from "@/lib/data";

export function StatusBadge({ status }: { status: StepStatus | string }) {
  const map: Record<string, string> = {
    done: "badge-done",
    in_progress: "badge-progress",
    pending: "badge-pending",
    deferred: "badge-pending",
  };
  const labels: Record<string, string> = {
    done: "Done",
    in_progress: "In Progress",
    pending: "Pending",
    deferred: "Deferred",
  };
  return (
    <span className={map[status] ?? "badge-pending"}>
      {labels[status] ?? status}
    </span>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-brand-600 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
