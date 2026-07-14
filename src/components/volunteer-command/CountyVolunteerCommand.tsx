import Link from "next/link";
import type { buildCountyVolunteerCommand } from "@/lib/volunteer-command/dashboard";

type Dash = ReturnType<typeof buildCountyVolunteerCommand>;

export function CountyVolunteerCommandView({ dashboard }: { dashboard: Dash }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-gradient-to-r from-brand-900 to-slate-900 px-4 py-8 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-100">
          Under Volunteer Manager
        </p>
        <h1 className="mt-2 text-3xl font-bold">{dashboard.header.title}</h1>
        <p className="mt-2 text-sm text-white/85">{dashboard.header.subtitle}</p>
        <Link href={dashboard.header.parent} className="mt-3 inline-block text-sm underline">
          ← County list in Volunteer Command
        </Link>
      </div>
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800">
          <p>{dashboard.scope_rule}</p>
          <p className="mt-2">
            Registration goal:{" "}
            <strong>{dashboard.registration_goal?.toLocaleString() ?? "—"}</strong> · County VCI:{" "}
            <strong>{dashboard.vci_goal?.toLocaleString() ?? "—"}</strong>
          </p>
          <p className="mt-2 text-xs text-slate-600">{dashboard.verified_progress}</p>
          <p className="mt-2 text-xs text-slate-600">{dashboard.field_plan_placeholder}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {dashboard.sections.map((s) => (
            <div key={s} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <p className="font-semibold text-slate-950">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
