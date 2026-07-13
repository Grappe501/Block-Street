import {
  assembleDocumentWorkspace,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { DocumentWorkspacePanel } from "@/features/communications/components/DocumentWorkspacePanel";

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = assembleDocumentWorkspace(id, DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  if (!view) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="card text-slate-600">Document not found.</p>
      </div>
    );
  }

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <DocumentWorkspacePanel view={view} />
    </CollaborationWorkbenchShell>
  );
}
