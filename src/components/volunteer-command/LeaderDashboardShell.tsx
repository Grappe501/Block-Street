import Link from "next/link";
import type { buildLeaderDashboard } from "@/lib/volunteer-command/dashboard";
import { FieldManualNavTab } from "@/components/field-strategy/FieldManualNavTab";

type Dash = ReturnType<typeof buildLeaderDashboard>;

export function LeaderDashboardShell({
  dashboard,
  admin = false,
}: {
  dashboard: Dash;
  admin?: boolean;
}) {
  const hook = dashboard.field_plan_hook;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-slate-900 px-4 py-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">
          {admin ? "Admin inspection · " : ""}
          {dashboard.title}
        </p>
        <h1 className="mt-2 text-2xl font-bold">Assignment {dashboard.assignment_id}</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/80">{dashboard.need_to_know}</p>
        <p className="mt-1 text-xs text-white/70">{dashboard.note}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <FieldManualNavTab variant="header" />
          <Link href={dashboard.reports_to_command} className="underline">
            ↑ Volunteer Command
          </Link>
          {admin ? (
            <Link href="/admin/director" className="underline">
              Return to Director
            </Link>
          ) : null}
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          Field Plan bind: <strong>{dashboard.field_plan_bind}</strong> · content status:{" "}
          <strong>{dashboard.field_plan_content_status}</strong>
          <p className="mt-1">{dashboard.field_plan_placeholder}</p>
          <p className="mt-1 text-xs">Persistence: {dashboard.persistence} — not Postgres. Hook: {hook.status}</p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-bold text-slate-950">What you see (need-to-know)</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.sections.map((s) => (
              <div key={s} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
                <p className="font-semibold text-slate-950">{s}</p>
                <p className="mt-1 text-xs text-slate-600">Pertinent to this assignment only.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-bold text-slate-950">Field Plan scaffold (next phase)</h2>
          <p className="mt-2 text-xs italic text-slate-700">{hook.doctrine}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Binding hierarchy</p>
          <ol className="mt-1 list-decimal pl-5 text-xs text-slate-700">
            {hook.hierarchy.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Operational phases</p>
          <ul className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
            {hook.operational_phases.map((ph) => (
              <li key={ph} className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-800">
                {ph}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-500">
            Responsibility fields reserved: {hook.responsibility_fields.slice(0, 8).join(", ")}…
          </p>
        </section>
      </div>
    </div>
  );
}
