import { notFound } from "next/navigation";
import {
  assembleMissionWorkspace,
  DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.2/ux";

export default async function MissionWorkspacePage({
  params,
}: {
  params: Promise<{ id: string; objectiveId: string; missionId: string }>;
}) {
  const { id, objectiveId, missionId } = await params;
  const workspace = assembleMissionWorkspace(id, objectiveId, missionId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
  if (!workspace) notFound();

  return (
    <div className="space-y-6">
      <header className="card">
        <h1 className="text-2xl font-bold text-slate-900">{workspace.display_name}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {workspace.workstream_name} · {workspace.objective_name}
        </p>
        <p className="mt-2 text-sm">
          Lead: {workspace.operational_lead_label} · {workspace.status_label}
          {workspace.due_date && ` · Due ${workspace.due_date}`}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {workspace.sections.map((s) => (
          <div key={s.key} className="card">
            <h2 className="font-semibold text-slate-900">{s.label}</h2>
            <p className="mt-2 text-sm text-slate-600">{s.summary}</p>
          </div>
        ))}
      </div>

      <section className="card">
        <h2 className="font-bold text-slate-900">Tasks</h2>
        <ul className="mt-3 space-y-2">
          {workspace.tasks.length === 0 ? (
            <li className="text-sm text-slate-600">No tasks yet.</li>
          ) : (
            workspace.tasks.map((t) => (
              <li key={t.id} className="rounded border border-slate-200 px-3 py-2 text-sm">
                <p className="font-medium">{t.description}</p>
                <p className="text-slate-500">
                  {t.status_label} · {t.owner_label}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
