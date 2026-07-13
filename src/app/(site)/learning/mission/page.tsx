import { assembleLearningWorkbenchShell, assembleMissionWorkspace, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.12/ux";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";

export default function MissionPage() {
  const mission = assembleMissionWorkspace(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT, "mission-default");

  return (
    <LearningWorkbenchShell shell={mission.shell}>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">Mission workspace</h1>
        <p className="mt-2 text-slate-600">{mission.objective}</p>
        <p className="mt-4 text-sm text-slate-500">{mission.context}</p>
      </div>
    </LearningWorkbenchShell>
  );
}
