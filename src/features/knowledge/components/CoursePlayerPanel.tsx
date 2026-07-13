import type { LearningWorkspaceView } from "@/lib/civic-action/builds/11.12/ux";

export function CoursePlayerPanel({ view }: { view: LearningWorkspaceView }) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-bold text-slate-900">
        {view.current_course?.display_name ?? "Learning workspace"}
      </h1>
      {view.current_course && (
        <p className="text-sm text-slate-600">Progress: {view.current_course.progress_percent}%</p>
      )}
      <p className="text-sm text-slate-500">{view.time_remaining_label}</p>
      <ul className="space-y-2 text-sm">
        {view.lesson_progress.map((l) => (
          <li key={l.lesson_id} className={l.complete ? "text-green-700" : "text-slate-700"}>
            {l.complete ? "✓" : "○"} {l.label}
          </li>
        ))}
      </ul>
      <a href={view.tutor_href} className="text-sm font-medium text-indigo-700 hover:underline">
        Open AI Tutor (advisory)
      </a>
    </div>
  );
}
