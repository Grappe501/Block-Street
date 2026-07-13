import { assembleCertificationWorkspace, DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.12/ux";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";
import { CertificationCenterPanel } from "@/features/knowledge/components/CertificationCenterPanel";

export default function CertificationsPage() {
  const view = assembleCertificationWorkspace(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT);

  return (
    <LearningWorkbenchShell shell={view.shell}>
      <CertificationCenterPanel view={view} />
    </LearningWorkbenchShell>
  );
}
