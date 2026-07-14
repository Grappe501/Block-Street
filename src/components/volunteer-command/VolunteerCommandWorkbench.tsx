import Link from "next/link";
import type { buildVolunteerCommandDashboard } from "@/lib/volunteer-command/dashboard";

type Dash = ReturnType<typeof buildVolunteerCommandDashboard>;

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-950">{value}</p>
    </div>
  );
}

export function VolunteerCommandWorkbench({ dashboard }: { dashboard: Dash }) {
  const h = dashboard.header;
  const p = dashboard.personnel;
  const g = dashboard.geographic;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">Volunteer Command</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{h.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85">{h.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80">
            <span>Role: {h.role}</span>
            <span>Scope: {h.scope}</span>
            <span>Refresh: {h.refreshed_at}</span>
            <span>
              Persistence: {String(h.persistence_backend)} · Postgres: {String(h.postgres_active)}
            </span>
            <span>Cert: {h.certification_state}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href={dashboard.links.operator_command} className="underline text-white/90">
              Return to Operator Command
            </Link>
            <Link href={dashboard.links.director} className="underline text-white/90">
              Director Omniview
            </Link>
            <Link href={dashboard.links.college_command} className="underline text-white/90">
              Education Command (subordinate)
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-xs font-semibold">
          {dashboard.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 ${
                item.active ? "bg-brand-100 text-brand-950" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <strong>Shell status:</strong> Structural workbench. Sensitive personnel actions stay disabled until
          durable persistence is proven. Field Plan copy remains placeholder. Canonical people counts only.
        </div>

        {dashboard.section === "command" || dashboard.section === "coverage" ? (
          <>
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Personnel strength</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Unique confirmed people" value={p.unique_confirmed_volunteers} />
                <Stat label="Active leads" value={p.active_leads} />
                <Stat label="Active volunteers" value={p.active_volunteers} />
                <Stat label="Co-lead positions" value={p.co_lead_positions} />
              </div>
              <p className="mt-2 text-xs text-slate-600">{p.counting_rule}</p>
              <p className="mt-1 text-xs text-slate-500">
                Intake / orientation / placement / retention counts: scaffold — Last recorded (no Live signal)
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Geographic coverage</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Counties (RedDirt)" value={g.counties_total} />
                <Stat label="Colleges" value={g.colleges} />
                <Stat label="Secondary schools" value={g.high_schools} />
                <Stat label="Education needing lead" value={g.institutions_needing_attention} />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Functional coverage</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {dashboard.functional_coverage.map((f) => (
                  <div key={f.function_key} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                    <p className="font-semibold capitalize text-slate-950">{f.label}</p>
                    <p className="text-xs text-slate-600">{f.note}</p>
                    <Link
                      href={`/admin/leader/function-${f.function_key}`}
                      className="mt-1 inline-block text-xs font-semibold text-brand-800 underline"
                    >
                      Open functional scaffold
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {dashboard.section === "education" || dashboard.section === "command" ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">Education Volunteer Command</h2>
            <p className="mt-1 text-sm text-slate-700">
              College Leader / Education Organizing Lead sits under Volunteer Manager. College Command remains the
              specialized education workbench — not a peer of Volunteer Command.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-700">
              <li>
                Hierarchy: Volunteer Manager → College Leader → Institution Leads → Committees → Volunteers
              </li>
              <li>
                Campus formula: <code>{dashboard.education_command.campus_goal_formula_version}</code>
              </li>
              <li className="text-slate-500">{dashboard.education_command.superseded_flat_25}</li>
              <li>
                Institutions: {dashboard.education_command.summary.totalInstitutions} · without lead:{" "}
                {dashboard.education_command.summary.withoutLead}
              </li>
            </ul>
            <Link
              href={dashboard.education_command.route}
              className="mt-3 inline-block text-sm font-semibold text-brand-800 underline"
            >
              Open College Leader Workbench
            </Link>
          </section>
        ) : null}

        {dashboard.section === "counties" || dashboard.section === "command" ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">County Volunteer Command</h2>
            <p className="mt-1 text-sm text-slate-700">
              County Volunteer Leads operate in parallel under Volunteer Manager — scoped to their county only.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {["clark", "pulaski", "benton", "washington"].map((slug) => (
                <Link
                  key={slug}
                  href={`/admin/counties/${slug}/volunteer-command`}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold capitalize text-slate-800 hover:border-brand-300"
                >
                  {slug}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {dashboard.section === "people" ||
        dashboard.section === "leadership" ||
        dashboard.section === "committees" ||
        dashboard.section === "intake" ||
        dashboard.section === "orientation" ||
        dashboard.section === "placement" ||
        dashboard.section === "retention" ||
        dashboard.section === "reports" ||
        dashboard.section === "functions" ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold capitalize text-slate-950">{dashboard.section} scaffold</h2>
            <p className="mt-2 text-sm text-slate-700">
              Registry-driven section shell. Filters, assignments, and durable writes activate when persistence and
              Field Plan ingestion are certified. Bulk messaging remains disabled.
            </p>
            <p className="mt-2 text-xs text-slate-600">{dashboard.field_plan.placeholder}</p>
          </section>
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-950">Immediate attention</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.attention.map((a) => (
              <li
                key={a.id}
                className={`rounded-lg px-3 py-2 ${
                  a.severity === "high" ? "bg-rose-50 text-rose-950" : "bg-amber-50 text-amber-950"
                }`}
              >
                {a.label}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm">
          <h2 className="text-sm font-bold text-slate-950">Activity signal</h2>
          <p className="mt-1">
            Label: <strong>{dashboard.activity.label}</strong> — {dashboard.activity.note}
          </p>
        </section>

        <section className="rounded-2xl border border-brand-200 bg-white p-4 text-sm text-slate-800 shadow-sm">
          <h2 className="text-sm font-bold text-slate-950">Field Plan · 30,000 feet</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-brand-800">
            Status: {dashboard.field_plan.status} · {dashboard.field_plan.authority}
          </p>
          <p className="mt-3 font-medium text-slate-950">{dashboard.field_plan.doctrine}</p>
          <p className="mt-2 text-xs text-slate-600">
            Event is the catalyst. Success = infrastructure left behind (volunteers, leaders, registrations, Power of
            Five teams) — not attendance alone.
          </p>
          <p className="mt-3 text-xs text-slate-700">
            Ingested role keys: {dashboard.field_plan.ingested_role_keys.join(", ")}
          </p>
          <ol className="mt-3 grid list-decimal gap-1 pl-5 text-xs text-slate-700 sm:grid-cols-2">
            {dashboard.field_plan.phases.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-slate-500">
            County/city drill-down next. Media Lead and Logistics Lead remain Field Plan–tracked until CIWS cards
            expand deliberately. No parallel ops system.
          </p>
        </section>
      </div>
    </div>
  );
}
