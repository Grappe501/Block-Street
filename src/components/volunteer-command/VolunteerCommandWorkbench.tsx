import Link from "next/link";
import type { buildVolunteerCommandDashboard } from "@/lib/volunteer-command/dashboard";
import { FieldManualNavTab } from "@/components/field-strategy/FieldManualNavTab";

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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
            Volunteer Command · Grassroots personnel
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{h.title}</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/85">{h.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/80">
            <span>Role: {h.role}</span>
            <span>Scope: {h.scope}</span>
            <span>Staffing: {h.staffing_model?.replace(/_/g, " ")}</span>
            <span>Refresh: {h.refreshed_at}</span>
            <span>
              Persistence: {String(h.persistence_backend)} · Postgres: {String(h.postgres_active)}
            </span>
            <span>Cert: {h.certification_state}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href={dashboard.links.operator_command} className="underline text-white/90">
              Operator Command
            </Link>
            <Link href={dashboard.links.director} className="underline text-white/90">
              Director Omniview
            </Link>
            <Link href={dashboard.links.college_command} className="underline text-white/90">
              Education Command (subordinate)
            </Link>
            <Link href="/leader/demo-committee-canvass" className="underline text-white/90">
              Area leader shell demo
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-xs font-semibold">
          <FieldManualNavTab variant="nav" className="!bg-amber-50 !text-amber-950 !ring-amber-300" />
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
          <strong>Shell status:</strong> Volunteer Manager is the campaign’s overall personnel lead (grassroots — no
          paid field staff). Sensitive actions stay disabled until durable persistence is proven. Field Plan
          drill-down is next — placeholders only. Structure is clear and disciplined; the experience stays
          welcoming and relational.
        </div>

        {(dashboard.section === "command" || dashboard.section === "leadership") && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              Leadership support structure
            </h2>
            <p className="mt-1 text-sm text-slate-700">
              Matrix command — functional excellence through statewide managers; geographic execution through
              clusters and counties. County and Education systems both connect here.{" "}
              <Link href={dashboard.hierarchy.matrix_doctrine ?? dashboard.hierarchy.doctrine} className="font-semibold text-brand-800 underline">
                Matrix doctrine
              </Link>
            </p>
            <ol className="mt-4 space-y-2 border-l-4 border-brand-600 pl-4 text-sm text-slate-800">
              <li>
                <strong>Campaign Director</strong> — may inspect any surface; chairs Executive Command Council
              </li>
              <li>
                <strong>Volunteer Manager (you)</strong> — functional people system: counties + education + functions
              </li>
              <li className="grid gap-2 sm:grid-cols-2">
                <span>
                  <strong>County Commander</strong> — geographic execution in their county →{" "}
                  <Link href="/admin/volunteer-command/counties" className="text-brand-800 underline">
                    County Command
                  </Link>
                </span>
                <span>
                  <strong>College Leader</strong> — functional education standards →{" "}
                  <Link href="/admin/college-command" className="text-brand-800 underline">
                    Education Command
                  </Link>
                  {" "}(coordinates with County Commander per campus)
                </span>
              </li>
              <li>
                <strong>Cluster Commanders</strong> — {dashboard.hierarchy.geographic_clusters.length} clusters · ~
                {Math.round(dashboard.hierarchy.matrix.county_count / dashboard.hierarchy.geographic_clusters.length)}{" "}
                counties each — coach County Commanders regionally
              </li>
              <li>
                <strong>Institution / Functional / Co-Leads</strong> — dual reporting (functional + geographic) →
                Area Campaign Leader Dashboard (<code>/leader/{"{assignment}"}</code>)
              </li>
              <li>
                <strong>General Volunteers</strong> — committee members · participant surfaces
              </li>
            </ol>
            {dashboard.hierarchy.executive_command_council ? (
              <p className="mt-3 text-xs text-slate-600">
                Executive Command Council:{" "}
                {dashboard.hierarchy.executive_command_council.members.map((m) => m.seat).join(" · ")}
              </p>
            ) : null}
            <p className="mt-3 text-xs text-slate-600">
              Subordinate commands: {dashboard.hierarchy.subordinate_commands.join(" · ")}
            </p>
          </section>
        )}

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
                Intake / orientation / placement / retention: scaffold — Last recorded (no Live signal)
              </p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Geographic coverage</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Counties (RedDirt)" value={g.counties_total} />
                <Stat label="Goal-scope colleges" value={g.colleges} />
                <Stat label="Bonus coverage" value={g.bonus_coverage} />
                <Stat label="Colleges needing lead" value={g.institutions_needing_attention} />
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
                      Open functional area leader shell
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {dashboard.section === "education" || dashboard.section === "command" ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">Education Volunteer Command (subordinate)</h2>
            <p className="mt-1 text-sm text-slate-700">
              College Leader sits <strong>functionally under</strong> Volunteer Manager. Each campus also connects{" "}
              <strong>geographically</strong> to its County Commander for resources and local coordination — matrix
              command, not a flat committee list.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-700">
              <li>Functional: Volunteer Manager → College Leader → Institution Leads → Committees → Volunteers</li>
              <li>Geographic: County Commander → campus execution within county (Cluster Commander above)</li>
              <li>
                Campus formula (active): <code>{dashboard.education_command.campus_goal_formula_version}</code> —
                enrollment ÷ county VAP
              </li>
              <li className="text-slate-500">{dashboard.education_command.superseded_flat_25}</li>
              <li>
                Institutions: {dashboard.education_command.summary.colleges} in goal scope ·{" "}
                {dashboard.education_command.summary.bonusCoverage} bonus · without lead (goal scope):{" "}
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
            <h2 className="text-sm font-bold text-slate-950">County Volunteer Command (subordinate)</h2>
            <p className="mt-1 text-sm text-slate-700">
              County Commanders operate functionally under Volunteer Manager and geographically under Cluster
              Commanders — each sees their county only, including campus coordination needs.
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

        {(dashboard.section === "command" || dashboard.section === "leadership") && (
          <section className="rounded-2xl border border-brand-200 bg-brand-50/40 p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">Area Campaign Leader Dashboard (scaffold)</h2>
            <p className="mt-1 text-sm text-slate-700">
              When a volunteer holds a leadership seat, they get a position-scoped dashboard — not the statewide VM
              chrome. Field Plan binds next.
            </p>
            <ul className="mt-3 list-disc pl-5 text-xs text-slate-700">
              <li>
                Public: <code>{dashboard.area_campaign_leader.route_public}</code>
              </li>
              <li>
                Admin inspect: <code>{dashboard.area_campaign_leader.route_admin_inspect}</code>
              </li>
              <li>Status: {dashboard.area_campaign_leader.status}</li>
              <li>Sections: {dashboard.area_campaign_leader.sections.join(" · ")}</li>
            </ul>
            <Link
              href="/leader/demo-institution-henderson-events"
              className="mt-3 inline-block text-sm font-semibold text-brand-800 underline"
            >
              Open demo area leader shell
            </Link>
          </section>
        )}

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
          <h2 className="text-sm font-bold text-slate-950">Field Plan hook · next phase</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-brand-800">
            Status: {dashboard.field_plan.status} · {dashboard.field_plan.authority}
          </p>
          <p className="mt-3 font-medium text-slate-950">{dashboard.field_plan.doctrine}</p>
          <p className="mt-2 text-xs text-slate-700">
            Hook path: Field Plan position key → leadership assignment → Area Campaign Leader Dashboard → committee /
            phase responsibilities → tasks / KPIs / evidence.
          </p>
          <p className="mt-3 text-xs text-slate-700">
            Ingested role keys: {dashboard.field_plan.ingested_role_keys.join(", ")}
          </p>
          <ol className="mt-3 grid list-decimal gap-1 pl-5 text-xs text-slate-700 sm:grid-cols-2">
            {dashboard.field_plan.phases.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ol>
          <Link href="/field-strategy" className="mt-4 inline-block text-sm font-semibold text-brand-800 underline">
            Open Field Strategy Manual (presentation) →
          </Link>
        </section>
      </div>
    </div>
  );
}
