import { ObjectiveOptimizationPanel } from "@/features/objectives/components/ObjectiveOptimizationPanel";

export default async function ObjectiveOptimizationPage({
  params,
}: {
  params: Promise<{ id: string; objectiveId: string }>;
}) {
  const { id, objectiveId } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Continuous improvement</h1>
      <p className="text-slate-600">
        Institutional learning from completed execution. Lessons, patterns, and recommendations are advisory — Humans
        approve every improvement.
      </p>
      <ObjectiveOptimizationPanel initiativeId={id} objectiveId={objectiveId} />
    </div>
  );
}
