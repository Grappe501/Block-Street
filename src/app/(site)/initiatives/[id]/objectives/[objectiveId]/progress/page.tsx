import { notFound } from "next/navigation";
import {
  assembleObjectiveDashboard,
  DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.2/ux";

export default async function ProgressPage({ params }: { params: Promise<{ id: string; objectiveId: string }> }) {
  const { id, objectiveId } = await params;
  const dashboard = assembleObjectiveDashboard(id, objectiveId, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);
  if (!dashboard) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Progress Center</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-800">57%</p>
          <p className="text-sm text-slate-600">Objective</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-slate-900">
            {dashboard.key_results.filter((k) => k.progress_percent >= 100).length} / {dashboard.key_results.length || "—"}
          </p>
          <p className="text-sm text-slate-600">Key Results</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-slate-900">
            {dashboard.cards.find((c) => c.key === "workstreams")?.body.match(/\d+/)?.[0] ?? 0}
          </p>
          <p className="text-sm text-slate-600">Workstreams</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-slate-900">
            {dashboard.cards.find((c) => c.key === "missions")?.body ?? "—"}
          </p>
          <p className="text-sm text-slate-600">Missions</p>
        </div>
      </div>
    </div>
  );
}
