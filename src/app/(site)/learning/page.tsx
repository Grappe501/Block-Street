import {
  assembleHomeDashboard,
  assembleAICommandBar,
  DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.12/ux";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";
import { LearningHomeDashboard } from "@/features/knowledge/components/LearningHomeDashboard";

export default function LearningPage() {
  const view = assembleHomeDashboard(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT);

  return (
    <LearningWorkbenchShell shell={view.shell}>
      <LearningHomeDashboard view={view} />
    </LearningWorkbenchShell>
  );
}
