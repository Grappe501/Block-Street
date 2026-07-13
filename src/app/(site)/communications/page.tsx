import {
  assembleCommunicationsHome,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { CommunicationsHome } from "@/features/communications/components/CommunicationsHome";

export default function CommunicationsPage() {
  const view = assembleCommunicationsHome(DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <CommunicationsHome view={view} />
    </CollaborationWorkbenchShell>
  );
}
