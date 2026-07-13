import {
  assembleDecisionWorkspace,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { DecisionWorkspacePanel } from "@/features/communications/components/DecisionWorkspacePanel";

export default async function DecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = assembleDecisionWorkspace(id, DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  if (!view) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="card text-slate-600">Decision not found.</p>
      </div>
    );
  }

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <DecisionWorkspacePanel view={view} />
    </CollaborationWorkbenchShell>
  );
}
