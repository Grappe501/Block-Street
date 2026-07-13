import { assembleAICommandBar, assembleLearningWorkbenchShell, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.12/ux";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";
import { AITutorPanel } from "@/features/knowledge/components/AITutorPanel";

export default function TutorPage() {
  const shell = assembleLearningWorkbenchShell(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT, undefined, "learning");
  const bar = assembleAICommandBar();

  return (
    <LearningWorkbenchShell shell={shell}>
      <AITutorPanel bar={bar} />
    </LearningWorkbenchShell>
  );
}
