import {
  assembleMissionConversation,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { MissionConversationPanel } from "@/features/communications/components/MissionConversationPanel";

export default async function MissionConversationPage({
  params,
}: {
  params: Promise<{ missionId: string }>;
}) {
  const { missionId } = await params;
  const view = assembleMissionConversation(missionId, DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  if (!view) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="card text-slate-600">Mission conversation not found.</p>
      </div>
    );
  }

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <MissionConversationPanel view={view} />
    </CollaborationWorkbenchShell>
  );
}
