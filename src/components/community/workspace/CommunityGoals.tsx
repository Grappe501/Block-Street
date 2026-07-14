"use client";

import { useState } from "react";
import type { CommunityGoal } from "@/lib/community-workspace";
import type { HonestParticipationMetrics } from "@/lib/position-participation";

function GoalBar({ goal }: { goal: CommunityGoal }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-slate-900">{goal.label}</span>
        <span className="text-slate-600">
          {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${goal.percent}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Confirmed progress toward strategic target · deadline{" "}
        {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

export function CommunityGoals({
  goals,
  metrics,
}: {
  goals: CommunityGoal[];
  metrics: HonestParticipationMetrics;
}) {
  const [showCalc, setShowCalc] = useState(false);
  const calc = metrics.goal_calculation;

  return (
    <section className="card space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Participation truth</h2>
        <p className="mt-1 text-sm text-slate-600">
          Goals are targets. Confirmed people are real humans (aliases count once).
        </p>
      </div>

      <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-800">Launch-team goal</p>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-600">Goal</dt>
            <dd className="text-2xl font-bold text-slate-950">{metrics.participation_goal}</dd>
            <p className="text-xs text-slate-600">Initial launch-team goal: {metrics.participation_goal} people.</p>
          </div>
          <div>
            <dt className="text-slate-600">Current confirmed participants</dt>
            <dd className="text-2xl font-bold text-slate-950">{metrics.confirmed_participants}</dd>
          </div>
          <div>
            <dt className="text-slate-600">Still needed</dt>
            <dd className="text-xl font-bold text-amber-800">{metrics.remaining_need}</dd>
          </div>
          <div>
            <dt className="text-slate-600">Confirmed people / system identities</dt>
            <dd className="font-semibold text-slate-900">
              {metrics.confirmed_people} people · {metrics.system_identities} identities
            </dd>
            <p className="text-xs text-slate-600">{metrics.aliases_excluded_note}</p>
          </div>
        </dl>
        <button
          type="button"
          className="mt-3 text-xs font-semibold text-brand-800 underline"
          aria-expanded={showCalc}
          onClick={() => setShowCalc((v) => !v)}
        >
          How is this goal calculated? {showCalc ? "▴" : "▾"}
        </button>
        {showCalc && (
          <div className="mt-2 space-y-1 rounded-lg border border-brand-100 bg-white/80 p-3 text-xs text-slate-700">
            <p className="font-mono text-[11px]">{calc.formula}</p>
            <ul className="list-disc space-y-1 pl-4">
              {calc.explanation.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="pt-1 text-slate-500">
              Long-horizon registration / vote targets below are separate strategic goals — they are not current headcount.
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900">Long-horizon civic targets</h3>
        <p className="mt-1 text-xs text-slate-600">
          Progress “current” uses confirmed participants only — never mock membership floors.
        </p>
        <div className="mt-3 space-y-5">
          {goals.map((goal) => (
            <GoalBar key={goal.kind} goal={goal} />
          ))}
        </div>
      </div>
    </section>
  );
}
