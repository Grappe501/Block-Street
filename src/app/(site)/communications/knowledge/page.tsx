import {
  assembleKnowledgeExplorer,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { KnowledgeExplorerPanel } from "@/features/communications/components/KnowledgeExplorerPanel";

export default function KnowledgePage() {
  const view = assembleKnowledgeExplorer(DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <KnowledgeExplorerPanel view={view} />
    </CollaborationWorkbenchShell>
  );
}
