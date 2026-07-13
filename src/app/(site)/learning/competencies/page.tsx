import { assembleCompetencyWorkspace, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.12/ux";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";
import { CompetencyTrackerPanel } from "@/features/knowledge/components/CompetencyTrackerPanel";

export default function CompetenciesPage() {
  const view = assembleCompetencyWorkspace(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT);

  return (
    <LearningWorkbenchShell shell={view.shell}>
      <CompetencyTrackerPanel view={view} />
    </LearningWorkbenchShell>
  );
}
