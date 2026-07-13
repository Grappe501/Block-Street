import { knowledgeProductionService } from "@/lib/civic-action/builds/11.12/production";
import { LearningWorkbenchShell } from "@/features/knowledge/components/LearningWorkbenchShell";
import { KnowledgeLaunchControlCenter } from "@/features/knowledge/components/KnowledgeLaunchControlCenter";
import { assembleLearningWorkbenchShell } from "@/lib/civic-action/builds/11.12/ux/assemble-workbench-shell";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.12/ux/experience-context";
import { resolveLearningExperienceRole } from "@/lib/civic-action/builds/11.12/ux/experience-context";
import { runKnowledgeCertificationGates } from "@/lib/civic-action/builds/11.12/production/certification-registry";

const INSTITUTION_ID = DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.institution_id;

export default function KnowledgeLaunchPage() {
  const role = resolveLearningExperienceRole(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions);
  const shell = assembleLearningWorkbenchShell(DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT, role, "settings");
  const launch = knowledgeProductionService.getLaunchControl(INSTITUTION_ID);
  const levels = knowledgeProductionService.getProductionLevels(INSTITUTION_ID);
  const gates = runKnowledgeCertificationGates();

  return (
    <LearningWorkbenchShell shell={shell}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Knowledge Launch Command Center</h1>
        <p className="mt-2 text-slate-600">
          Production certification and institutional launch controls. The system recommends readiness — Humans approve launch.
        </p>
        <div className="mt-8">
          <KnowledgeLaunchControlCenter launch={launch} levels={levels} gates={gates} />
        </div>
      </div>
    </LearningWorkbenchShell>
  );
}
