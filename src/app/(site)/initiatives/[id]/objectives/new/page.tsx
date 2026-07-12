import { assembleObjectiveBuilder, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.2/ux";
import { ObjectiveBuilderWizard } from "@/features/objectives/components/ObjectiveBuilderWizard";

export default async function NewObjectivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const builder = assembleObjectiveBuilder(id, DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Create an Objective</h1>
      <p className="text-slate-600">Plan conversationally — the platform teaches good execution planning.</p>
      <ObjectiveBuilderWizard builder={builder} />
    </div>
  );
}
