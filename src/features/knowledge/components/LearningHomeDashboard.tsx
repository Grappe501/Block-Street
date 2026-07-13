import type { HomeDashboardView } from "@/lib/civic-action/builds/11.12/ux";

export function LearningHomeDashboard({ view }: { view: HomeDashboardView }) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">{view.primary_question}</h2>
        <p className="mt-2 text-slate-600">{view.welcome_message}</p>
        {view.recommended_next_step && (
          <a
            href={view.recommended_next_step.href}
            className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {view.recommended_next_step.label}
          </a>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-900">Continue Learning</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {view.continue_learning.length === 0 ? (
              <li className="text-slate-500">No active enrollments yet.</li>
            ) : (
              view.continue_learning.map((c) => (
                <li key={c.course_id}>
                  <a href={c.href} className="text-indigo-700 hover:underline">
                    {c.display_name} — {c.progress_percent}%
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-900">Recent Knowledge</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {view.recent_knowledge.map((k) => (
              <li key={k.id}>
                <a href={k.href} className="text-indigo-700 hover:underline">
                  {k.title}
                </a>
                <span className="ml-2 text-xs text-slate-500">{k.status_label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="text-xs text-slate-500">{view.competency_note}</p>
      <p className="text-xs text-slate-500">{view.certification_note}</p>
    </div>
  );
}
