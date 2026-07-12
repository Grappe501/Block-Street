import { InitiativeIntelligencePanel } from "@/features/initiatives/components/InitiativeIntelligencePanel";

export default async function InitiativeIntelligencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Intelligence</h1>
        <p className="mt-1 text-sm text-slate-600">
          Advisory recommendations — explainable, evidence-backed, and dismissible. Nothing here changes Initiative authority.
        </p>
      </div>
      <InitiativeIntelligencePanel initiativeId={id} />
    </div>
  );
}
