import {
  assembleNotificationCenter,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { NotificationCenterPanel } from "@/features/communications/components/NotificationCenterPanel";

export default function NotificationsPage() {
  const view = assembleNotificationCenter(DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT);

  return (
    <CollaborationWorkbenchShell shell={view.shell}>
      <NotificationCenterPanel view={view} />
    </CollaborationWorkbenchShell>
  );
}
