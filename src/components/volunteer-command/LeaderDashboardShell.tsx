import Link from "next/link";
import type { buildLeaderDashboard } from "@/lib/volunteer-command/dashboard";

type Dash = ReturnType<typeof buildLeaderDashboard>;

export function LeaderDashboardShell({
  dashboard,
  admin = false,
}: {
  dashboard: Dash;
  admin?: boolean;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-slate-900 px-4 py-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">
          {admin ? "Admin inspection · Leader dashboard" : "Campaign leader dashboard"}
        </p>
        <h1 className="mt-2 text-2xl font-bold">Assignment {dashboard.assignment_id}</h1>
        <p className="mt-2 text-sm text-white/80">{dashboard.note}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/admin/volunteer-command" className="underline">
            Volunteer Command
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
          Field Plan status: <strong>{dashboard.field_plan_content_status}</strong>
          <p className="mt-1">{dashboard.field_plan_placeholder}</p>
          <p className="mt-1 text-xs">Persistence: {dashboard.persistence} — not Postgres.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {dashboard.sections.map((s) => (
            <div key={s} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
              <p className="font-semibold text-slate-950">{s}</p>
              <p className="mt-1 text-xs text-slate-600">Relevant to this assignment only.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
