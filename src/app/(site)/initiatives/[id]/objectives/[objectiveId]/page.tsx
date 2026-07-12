import { notFound } from "next/navigation";
import Link from "next/link";
import {
  assembleObjectiveDashboard,
  DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.2/ux";
import { ObjectiveLifecycleActions } from "@/features/objectives/components/ObjectiveLifecycleActions";

export default async function ObjectiveDashboardPage({
  params,
}: {
  params: Promise<{ id: string; objectiveId: string }>;
}) {
  const { id, objectiveId } = await params;
  const dashboard = assembleObjectiveDashboard(id, objectiveId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
  if (!dashboard) notFound();

  return (
    <div className="space-y-6">
      <section className="card bg-gradient-to-br from-orange-50 to-white">
        <h2 className="text-lg font-bold text-slate-900">Mission control — six questions</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {dashboard.six_questions.map((q) => (
            <div key={q.question}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-orange-800">{q.question}</dt>
              <dd className="mt-1 text-sm text-slate-800">{q.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card">
        <h2 className="font-bold text-slate-900">Your focus ({dashboard.shell.viewer_role_label})</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {dashboard.role_focus.map((f) => (
            <li key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {f}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboard.cards.map((card) => (
          <div
            key={card.key}
            className={`card ${card.tone === "warning" ? "border-amber-200 bg-amber-50" : ""}`}
          >
            <h3 className="font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{card.body}</p>
            {card.href && (
              <Link href={card.href} className="mt-2 inline-block text-sm font-semibold text-orange-800 underline">
                Open →
              </Link>
            )}
          </div>
        ))}
      </div>

      {dashboard.key_results.length > 0 && (
        <section className="card">
          <h2 className="font-bold text-slate-900">Key Results</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {dashboard.key_results.map((kr) => (
              <div key={kr.key_result_id} className="rounded border border-slate-200 p-3">
                <p className="font-semibold">{kr.title}</p>
                <p className="mt-2 text-2xl font-bold text-orange-800">{kr.progress_percent}%</p>
                <p className="text-sm text-slate-600">
                  {kr.current ?? 0} / {kr.target} {kr.unit} · {kr.trend_label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Today&apos;s priorities</h2>
          <Link
            href={`/initiatives/${id}/objectives/${objectiveId}/today`}
            className="text-sm font-semibold text-orange-800 underline"
          >
            View all →
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {dashboard.todays_priorities.length === 0 ? (
            <li className="text-sm text-slate-600">No priorities yet — create missions and tasks.</li>
          ) : (
            dashboard.todays_priorities.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="block rounded bg-slate-50 px-3 py-2 text-sm hover:bg-orange-50">
                  {item.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="card border-dashed">
        <h2 className="font-bold text-slate-900">AI Assistant</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {dashboard.ai_suggestions.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </section>

      <ObjectiveLifecycleActions actions={dashboard.lifecycle_actions} />
    </div>
  );
}
