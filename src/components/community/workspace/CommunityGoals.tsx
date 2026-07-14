"use client";

import { useState } from "react";
import type { CommunityGoal } from "@/lib/community-workspace";
import type { HonestParticipationMetrics } from "@/lib/position-participation";

function GoalBar({ goal }: { goal: CommunityGoal }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-slate-900">{goal.label}</span>
        <span className="tabular-nums font-medium text-slate-700">
          {goal.current.toLocaleString()}
          <span className="text-slate-400"> / </span>
          {goal.target.toLocaleString()}
        </span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-500"
          style={{ width: `${Math.max(goal.percent, goal.percent > 0 ? 2 : 0)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-600">
        Confirmed progress · deadline{" "}
        {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

function MetricTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent: "brand" | "amber" | "slate" | "emerald";
}) {
  const shell = {
    brand: "border-brand-200 bg-gradient-to-br from-white to-brand-50",
    amber: "border-amber-200 bg-gradient-to-br from-white to-amber-50",
    slate: "border-slate-200 bg-gradient-to-br from-white to-slate-50",
    emerald: "border-emerald-200 bg-gradient-to-br from-white to-emerald-50",
  }[accent];
  const valueColor = {
    brand: "text-brand-950",
    amber: "text-amber-950",
    slate: "text-slate-950",
    emerald: "text-emerald-950",
  }[accent];
  const labelColor = {
    brand: "text-brand-800",
    amber: "text-amber-900",
    slate: "text-slate-700",
    emerald: "text-emerald-900",
  }[accent];

  return (
    <div className={`rounded-2xl border p-4 ${shell}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-wider ${labelColor}`}>{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular-nums tracking-tight ${valueColor}`}>{value}</p>
      {hint ? <p className={`mt-1 text-xs leading-snug ${labelColor} opacity-90`}>{hint}</p> : null}
    </div>
  );
}

export function CommunityGoals({
  goals,
  metrics,
  primaryColor,
}: {
  goals: CommunityGoal[];
  metrics: HonestParticipationMetrics;
  primaryColor?: string;
}) {
  const [showCalc, setShowCalc] = useState(false);
  const [showCivic, setShowCivic] = useState(false);
  const calc = metrics.goal_calculation;
  const accent = primaryColor ?? "#0d9488";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="border-b border-slate-100 px-6 py-5"
        style={{
          background: `linear-gradient(120deg, ${accent}14 0%, #ffffff 55%, #f8fafc 100%)`,
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">Participation truth</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">Where this community stands</h2>
        <p className="mt-1 max-w-xl text-sm text-slate-700">
          Goals are targets. Confirmed people are real humans — aliases count once.
        </p>
      </div>

      <div className="space-y-5 px-6 py-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricTile
            label="Goal"
            value={metrics.participation_goal}
            hint={`Initial launch-team goal: ${metrics.participation_goal} people.`}
            accent="brand"
          />
          <MetricTile
            label="Confirmed participants"
            value={metrics.confirmed_participants}
            hint="Unique people who joined this campus or county."
            accent="emerald"
          />
          <MetricTile
            label="Still needed"
            value={metrics.remaining_need}
            hint="Goal minus confirmed participants."
            accent="amber"
          />
          <MetricTile
            label="People · identities"
            value={`${metrics.confirmed_people} · ${metrics.system_identities}`}
            hint={metrics.aliases_excluded_note}
            accent="slate"
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950"
          aria-expanded={showCalc}
          onClick={() => setShowCalc((v) => !v)}
        >
          How is this goal calculated?{" "}
          <span aria-hidden className="text-slate-500">
            {showCalc ? "▴" : "▾"}
          </span>
        </button>
        {showCalc && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
            <p className="rounded-md bg-white px-2 py-1.5 font-mono text-[11px] text-slate-900 ring-1 ring-slate-200">
              {calc.formula}
            </p>
            <ul className="list-disc space-y-1 pl-4 text-slate-700">
              {calc.explanation.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="pt-1 text-slate-600">
              Long-horizon registration / vote targets below are separate strategic goals — not current headcount.
            </p>
          </div>
        )}

        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-slate-950">Civic targets — registration &amp; VCI</h3>
          <p className="mt-1 text-xs text-slate-600">
            {metrics.campus_enrollment != null
              ? "Campus treated like a city: goals scale with enrollment ÷ county voting-age population."
              : "County targets use voting-age population rates (or seeded county goals)."}{" "}
            Progress “current” uses confirmed participants only.
          </p>
          {metrics.civic_goal_formula && (
            <>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-950"
                aria-expanded={showCivic}
                onClick={() => setShowCivic((v) => !v)}
              >
                How are registration &amp; VCI calculated?{" "}
                <span aria-hidden className="text-slate-500">
                  {showCivic ? "▴" : "▾"}
                </span>
              </button>
              {showCivic && (
                <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
                  <p className="rounded-md bg-white px-2 py-1.5 font-mono text-[11px] text-slate-900 ring-1 ring-slate-200">
                    {metrics.civic_goal_formula}
                  </p>
                  {metrics.campus_enrollment != null && (
                    <p className="text-slate-700">
                      Enrollment {metrics.campus_enrollment.toLocaleString()} · County VAP{" "}
                      {(metrics.county_voting_age_population ?? 0).toLocaleString()} · Share{" "}
                      {((metrics.campus_share_of_county_vap ?? 0) * 100).toFixed(2)}%
                    </p>
                  )}
                  <ul className="list-disc space-y-1 pl-4 text-slate-700">
                    {(metrics.civic_goal_explanation ?? []).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="mt-3 space-y-3">
            {goals.map((goal) => (
              <GoalBar key={goal.kind} goal={goal} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
