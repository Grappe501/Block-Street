"use client";

import { useState } from "react";
import type { CommunityGoal } from "@/lib/community-workspace";
import type { HonestParticipationMetrics } from "@/lib/position-participation";

function MetricTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent: "brand" | "amber" | "slate" | "emerald" | "sky";
}) {
  const shell = {
    brand: "border-brand-200 bg-gradient-to-br from-white to-brand-50",
    amber: "border-amber-200 bg-gradient-to-br from-white to-amber-50",
    slate: "border-slate-200 bg-gradient-to-br from-white to-slate-50",
    emerald: "border-emerald-200 bg-gradient-to-br from-white to-emerald-50",
    sky: "border-sky-200 bg-gradient-to-br from-white to-sky-50",
  }[accent];
  const valueColor = {
    brand: "text-brand-950",
    amber: "text-amber-950",
    slate: "text-slate-950",
    emerald: "text-emerald-950",
    sky: "text-sky-950",
  }[accent];
  const labelColor = {
    brand: "text-brand-800",
    amber: "text-amber-900",
    slate: "text-slate-700",
    emerald: "text-emerald-900",
    sky: "text-sky-900",
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
  scopeKind,
  goalAccountable = true,
}: {
  goals: CommunityGoal[];
  metrics: HonestParticipationMetrics;
  primaryColor?: string;
  scopeKind?: string;
  goalAccountable?: boolean;
}) {
  const [showLaunch, setShowLaunch] = useState(false);
  const [showCivic, setShowCivic] = useState(false);
  const [showVci, setShowVci] = useState(false);
  const accent = primaryColor ?? "#0d9488";
  const isCampus = scopeKind && scopeKind !== "county";
  const regGoal = goals.find((g) => g.kind === "registration");

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div
        className="border-b border-slate-100 px-6 py-5"
        style={{
          background: `linear-gradient(120deg, ${accent}14 0%, #ffffff 55%, #f8fafc 100%)`,
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">Field &amp; team goals</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">Truthful targets</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-700">
          {goalAccountable
            ? isCampus
              ? "Campus goals scale like a city inside the county: enrollment ÷ estimated county VAP × county RedDirt goals. Sub-goals sit inside the county total (not additive). Launch-team goal stays separate."
              : "County registration goal and VCI come from the RedDirt Victory Plan snapshot on H:/SOSWebsite/RedDirt."
            : "Bonus coverage — high schools, trade/technical schools, and private/charter scopes are welcome when leaders step up, but they are not College Leader accountability targets."}
        </p>
      </div>

      <div className="space-y-5 px-6 py-5">
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-900">
            Leadership launch team (not current headcount)
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <MetricTile
              label="Goal"
              value={metrics.participation_goal}
              hint="Initial launch-team goal — strategic target, not people already here."
              accent="amber"
            />
            <MetricTile
              label="Current confirmed participants"
              value={metrics.confirmed_participants}
              hint={metrics.aliases_excluded_note}
              accent="emerald"
            />
            <MetricTile
              label="Still needed"
              value={metrics.remaining_need}
              hint={`max(0, goal ${metrics.participation_goal} − confirmed ${metrics.confirmed_participants})`}
              accent="slate"
            />
          </div>
          {metrics.system_identities > metrics.confirmed_participants ? (
            <p className="mt-3 text-xs text-amber-950">
              System identities: {metrics.system_identities} · confirmed people:{" "}
              {metrics.confirmed_people} · aliases collapsed to canonical persons (do not count as extra humans).
            </p>
          ) : null}
        </div>

        {goalAccountable ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricTile
              label={isCampus ? "Campus registration sub-goal" : "Voter-registration goal"}
              value={metrics.registration_target.toLocaleString()}
              hint={
                isCampus
                  ? metrics.campus_share_of_county_vap != null
                    ? `${(metrics.campus_share_of_county_vap * 100).toFixed(2)}% of county VAP × county registration goal`
                    : "Enrollment-share formula (missing enrollment/VAP)"
                  : "Canonical county total from RedDirt Victory Plan snapshot"
              }
              accent="brand"
            />
            <MetricTile
              label={isCampus ? "Campus VCI sub-goal" : "County VCI"}
              value={(
                isCampus
                  ? metrics.campus_vci_goal ?? metrics.vote_participation_target
                  : metrics.county_vci ?? metrics.vote_participation_target
              ).toLocaleString()}
              hint={
                isCampus
                  ? "Enrollment share of county VCI — separate from launch-team and registration"
                  : "Victory Contribution Index — county parent goal from RedDirt"
              }
              accent="sky"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-950">
            Registration and VCI sub-goals are <strong>not</strong> College Leader accountability targets for
            this scope. Local launch-team building still applies when volunteers step up.
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
          {goalAccountable ? (
            isCampus ? (
              <p>
                Campus registration and VCI goals equal the county goals times{" "}
                <strong>campus enrollment ÷ county VAP</strong>. They are organizing sub-goals within the county
                total — <strong>not</strong> added on top.{" "}
                {metrics.vap_is_estimate
                  ? "County VAP is currently estimated (not official ACS)."
                  : null}
              </p>
            ) : (
              <p>
                The county goal is the <strong>total</strong> target. College campus goals are organizing
                sub-goals that contribute toward this county total.
              </p>
            )
          ) : (
            <p>
              This scope is <strong>bonus coverage</strong> — celebrate when staffed, but do not count against
              College Leader goal KPIs.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            aria-expanded={showCivic}
            onClick={() => setShowCivic((v) => !v)}
          >
            How is the registration goal calculated? {showCivic ? "▴" : "▾"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            aria-expanded={showVci}
            onClick={() => setShowVci((v) => !v)}
          >
            What is County VCI? {showVci ? "▴" : "▾"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            aria-expanded={showLaunch}
            onClick={() => setShowLaunch((v) => !v)}
          >
            How is this goal calculated? {showLaunch ? "▴" : "▾"}
          </button>
        </div>

        {showCivic && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-800">
            <p className="rounded-md bg-white px-2 py-1.5 font-mono text-[11px] text-slate-900 ring-1 ring-slate-200">
              {metrics.civic_goal_formula}
            </p>
            <ul className="list-disc space-y-1 pl-4">
              {(metrics.civic_goal_explanation ?? []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="text-slate-600">
              Verified completed registrations:{" "}
              <strong>Not yet connected to verified registration-result data</strong>
            </p>
          </div>
        )}

        {showVci && (
          <div className="space-y-2 rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs text-sky-950">
            <p className="font-semibold">Victory Contribution Index (RedDirt)</p>
            <p>{metrics.vci_definition}</p>
            <p>
              County VCI {(metrics.county_vci ?? 0).toLocaleString()}
              {isCampus && metrics.campus_vci_goal != null
                ? ` · Campus VCI sub-goal ${metrics.campus_vci_goal.toLocaleString()}`
                : ""}
              . Distinct from voter-registration and launch-team goals.
            </p>
          </div>
        )}

        {showLaunch && (
          <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
            <p className="rounded-md bg-white px-2 py-1.5 font-mono text-[11px] text-slate-900 ring-1 ring-amber-200">
              {metrics.goal_calculation.formula}
            </p>
            <p>
              Minimum launch team: {metrics.goal_calculation.minimum_launch_team}
              {metrics.goal_calculation.configured_manual_goal != null
                ? ` · Manual override: ${metrics.goal_calculation.configured_manual_goal}`
                : " · No manual override"}
            </p>
            {(metrics.goal_calculation.explanation ?? []).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )}

        {regGoal && (
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-semibold text-slate-900">{regGoal.label}</span>
              <span className="tabular-nums text-slate-700">
                {regGoal.current.toLocaleString()} confirmed / {regGoal.target.toLocaleString()} goal
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                style={{ width: `${Math.max(regGoal.percent, regGoal.percent > 0 ? 2 : 0)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Progress uses confirmed platform participants only — not fabricated registration results.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
