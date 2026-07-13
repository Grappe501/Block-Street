import {
  assembleMeetingWorkspace,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { MeetingWorkspacePanel } from "@/features/communications/components/MeetingWorkspacePanel";

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const view = assembleMeetingWorkspace(id, DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  if (!view) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="card text-slate-600">Meeting not found.</p>
      </div>
    );
  }

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <MeetingWorkspacePanel view={view} />
    </CollaborationWorkbenchShell>
  );
}
