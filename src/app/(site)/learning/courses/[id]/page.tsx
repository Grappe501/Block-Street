import { assembleCoursePlayer, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.12/ux";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";
import { CoursePlayerPanel } from "@/features/knowledge/components/CoursePlayerPanel";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspace = assembleCoursePlayer(id, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT);

  return (
    <LearningWorkbenchShell shell={workspace.shell}>
      <CoursePlayerPanel view={workspace} />
    </LearningWorkbenchShell>
  );
}
