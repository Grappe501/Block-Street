import type { CommunityWorkspaceView } from "@/lib/community-workspace";
import { ROLE_STATUS_COLORS } from "@/lib/community-workspace";

export function FunctionalLanes({
  lanes,
  primaryColor,
}: {
  lanes: CommunityWorkspaceView["lanes"];
  primaryColor?: string;
}) {
  const accent = primaryColor ?? "#0d9488";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="border-b border-slate-100 px-6 py-5"
        style={{
          background: `linear-gradient(140deg, ${accent}12 0%, #ffffff 60%)`,
        }}
      >
        <h2 className="text-xl font-bold text-slate-950">Get involved</h2>
        <p className="mt-1 text-sm text-slate-700">
          Functional lanes — plug into social meetups, registration, and field work.
        </p>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
        {lanes.map((lane) => (
          <div
            key={lane.id}
            className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-950">{lane.label}</p>
              <span className={`badge shrink-0 ${ROLE_STATUS_COLORS[lane.leadStatus]}`}>
                {lane.leadName ?? "Open"}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">{lane.nextActivation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
