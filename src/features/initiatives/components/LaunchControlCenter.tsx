"use client";

import type { LaunchControlView, ProductionCertificationView, ReadinessCheck } from "@/lib/civic-action/builds/11.1/production/contracts";

const DECISION_STYLES: Record<LaunchControlView["decision"], string> = {
  go: "bg-green-100 text-green-800 border-green-300",
  conditional_go: "bg-amber-100 text-amber-800 border-amber-300",
  no_go: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_STYLES: Record<ReadinessCheck["status"], string> = {
  pass: "text-green-700",
  attention: "text-amber-700",
  fail: "text-red-700",
  not_applicable: "text-slate-500",
};

function ChecklistSection({ title, checks }: { title: string; checks: ReadinessCheck[] }) {
  if (checks.length === 0) return null;
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {checks.map((c) => (
          <li key={c.check_id} className="flex flex-wrap gap-2">
            <span className={`font-medium ${STATUS_STYLES[c.status]}`}>{c.status}</span>
            <span className="text-slate-700">{c.title}</span>
            <span className="text-slate-500">— {c.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LaunchControlCenter({
  launch,
  levels,
  onSignOff,
}: {
  launch: LaunchControlView | null;
  levels: ProductionCertificationView[];
  onSignOff?: (type: "release" | "pilot" | "organization" | "statewide") => void;
}) {
  if (!launch) return null;

  const byCategory = (prefix: string) =>
    launch.deployment_checklist.filter((c) => c.category === prefix || c.check_id.startsWith(prefix));

  return (
    <div className="space-y-8">
      <section className={`rounded-xl border p-6 ${DECISION_STYLES[launch.decision]}`}>
        <h2 className="text-lg font-semibold">Go / No-Go decision</h2>
        <p className="mt-1 text-2xl font-bold uppercase">{launch.decision.replace("_", " ")}</p>
        <p className="mt-2 text-sm">Checklist {launch.checklist_complete_pct}% complete · Rollback available</p>
        {launch.critical_issues.length > 0 && (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            {launch.critical_issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
        {launch.executive_sign_off_required && onSignOff && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSignOff("release")}
              className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Record release sign-off
            </button>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Production certification</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {levels.map((l) => (
            <div
              key={l.level}
              className={`rounded-lg border p-4 ${l.achieved ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"}`}
            >
              <p className="font-medium text-slate-900">{l.label}</p>
              <p className="text-sm text-slate-600">{l.achieved ? "Achieved" : "Not yet"}</p>
              {!l.achieved && l.blockers.length > 0 && (
                <ul className="mt-2 list-disc pl-4 text-xs text-slate-600">
                  {l.blockers.slice(0, 2).map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Deployment checklist</h2>
        <ChecklistSection title="Configuration" checks={byCategory("configuration").concat(byCategory("feature_flags"), byCategory("environment"))} />
        <ChecklistSection title="Bootstrap" checks={byCategory("bootstrap")} />
        <ChecklistSection title="Operations" checks={launch.deployment_checklist.filter((c) => ["backup", "disaster_recovery", "audit", "monitoring", "alerting", "logging", "health_checks", "operations"].includes(c.category))} />
      </section>
    </div>
  );
}
