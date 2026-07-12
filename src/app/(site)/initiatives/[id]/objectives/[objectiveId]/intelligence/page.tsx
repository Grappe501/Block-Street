import { ObjectiveIntelligencePanel } from "@/features/objectives/components/ObjectiveIntelligencePanel";

export default async function ObjectiveIntelligencePage({
  params,
}: {
  params: Promise<{ id: string; objectiveId: string }>;
}) {
  const { id, objectiveId } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Execution intelligence</h1>
      <p className="text-slate-600">
        Advisory insights about progress, risks, and opportunities. Intelligence never mutates execution — Humans decide.
      </p>
      <ObjectiveIntelligencePanel initiativeId={id} objectiveId={objectiveId} />
    </div>
  );
}
