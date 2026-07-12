import type { CommunityWorkspaceView } from "@/lib/community-workspace";
import { ROLE_STATUS_COLORS } from "@/lib/community-workspace";

export function FunctionalLanes({ lanes }: { lanes: CommunityWorkspaceView["lanes"] }) {
  return (
    <section className="card">
      <h2 className="text-lg font-bold text-slate-900">Get Involved</h2>
      <p className="mt-1 text-sm text-slate-600">
        Functional lanes — plug into social meetups, registration, and field work.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {lanes.map((lane) => (
          <div
            key={lane.id}
            className="rounded-lg border border-slate-200 bg-slate-50/80 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-900">{lane.label}</p>
              <span className={`badge shrink-0 ${ROLE_STATUS_COLORS[lane.leadStatus]}`}>
                {lane.leadName ?? "Open"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600">{lane.nextActivation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
