import { notFound } from "next/navigation";
import Link from "next/link";
import {
  assembleCharterWorkbench,
  DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.1/ux";

export default async function InitiativeCharterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workbench = assembleCharterWorkbench(id, DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT);
  if (!workbench) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-lg font-bold">Charter Workbench</h2>
        <p className="text-sm text-slate-600">{workbench.completion_summary}</p>
        {workbench.sections.map((section) => (
          <div key={section.key} className="card">
            <div className="flex justify-between gap-2">
              <h3 className="font-semibold">{section.label}</h3>
              <span className="badge bg-slate-100 text-slate-700">{section.status.replace(/_/g, " ")}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{section.prompt}</p>
          </div>
        ))}
      </div>
      <aside className="space-y-4">
        <div className="card">
          <h3 className="font-bold">Readiness</h3>
          {workbench.readiness.required_before_review.length > 0 && (
            <ul className="mt-2 text-sm text-amber-800 list-disc pl-4">
              {workbench.readiness.required_before_review.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
          <Link href={`/initiatives/${id}/readiness`} className="btn-primary mt-4 inline-block text-sm">
            {workbench.next_action.label}
          </Link>
        </div>
        <p className="text-xs text-slate-500">Charter Version {workbench.charter_version ?? "—"} · Submission does not authorize execution.</p>
      </aside>
    </div>
  );
}
