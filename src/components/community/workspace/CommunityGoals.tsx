import type { CommunityGoal } from "@/lib/community-workspace";

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
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${goal.percent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {goal.percent}% · deadline {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

export function CommunityGoals({ goals }: { goals: CommunityGoal[] }) {
  return (
    <section className="card">
      <h2 className="text-lg font-bold text-slate-900">Our Goals</h2>
      <p className="mt-1 text-sm text-slate-600">
        Community-scoped targets — registration and civic participation, nonpartisan.
      </p>
      <div className="mt-4 space-y-5">
        {goals.map((goal) => (
          <GoalBar key={goal.kind} goal={goal} />
        ))}
      </div>
    </section>
  );
}
