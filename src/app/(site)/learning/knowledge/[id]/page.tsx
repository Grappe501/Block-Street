import {
  assembleKnowledgeReader,
  DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.12/ux";
import { knowledgeApplicationService } from "@/lib/civic-action/builds/11.12/application-service";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";
import { KnowledgeReaderPanel } from "@/features/knowledge/components/KnowledgeReaderPanel";

export default async function KnowledgeReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = assembleKnowledgeReader(id, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT);
  const fallbackArtifact = knowledgeApplicationService.listArtifacts(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.institution_id)[0];
  const resolved =
    view ??
    (fallbackArtifact
      ? assembleKnowledgeReader(fallbackArtifact.canonical_id, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT)
      : null);

  if (!resolved) {
    return <p className="p-8">No knowledge artifacts available.</p>;
  }

  return (
    <LearningWorkbenchShell shell={resolved.shell}>
      <KnowledgeReaderPanel view={resolved} />
    </LearningWorkbenchShell>
  );
}
