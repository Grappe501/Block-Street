import { communicationOptimizationService } from "@/lib/civic-action/builds/11.7/optimization";
import { assembleCommunicationsHome, DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT } from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { CommunicationOptimizationCenter } from "@/features/communications/components/CommunicationOptimizationCenter";
import { TemplateEvolutionTimeline } from "@/features/communications/components/TemplateEvolutionTimeline";
import { PlaybookLibrary } from "@/features/communications/components/PlaybookLibrary";
import { KnowledgeStewardConsole } from "@/features/communications/components/KnowledgeStewardConsole";
import { CommunicationTrendsDashboard } from "@/features/communications/components/CommunicationTrendsDashboard";
import { SimulationWorkspaceRemote } from "@/features/communications/components/SimulationWorkspaceRemote";
import { InstitutionMemoryHealthPanel } from "@/features/communications/components/InstitutionMemoryHealthPanel";

const ctx = DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT;
const optCtx = { actor_human_id: ctx.actor_human_id, institution_id: ctx.institution_id };

export default function CommunicationsOptimizationPage() {
  const home = assembleCommunicationsHome(ctx);
  const overview = communicationOptimizationService.getOverview(optCtx);
  const templates = communicationOptimizationService.getTemplates(ctx.institution_id);
  const playbooks = communicationOptimizationService.getPlaybooks(ctx.institution_id);
  const stewardship = communicationOptimizationService.getKnowledgeHealth(ctx.institution_id);
  const brief = communicationOptimizationService.buildExecutiveBrief(ctx.institution_id);

  return (
    <CollaborationWorkbenchShell shell={home.shell}>
      <CommunicationOptimizationCenter
        optimizations={overview.optimizations}
        maturity={overview.maturity}
        health={overview.health_summary}
        brief={brief}
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <CommunicationTrendsDashboard health={overview.health_summary} />
        <InstitutionMemoryHealthPanel governance={overview.memory_governance} />
        <TemplateEvolutionTimeline templates={templates} />
        <PlaybookLibrary playbooks={playbooks} />
        <KnowledgeStewardConsole recommendations={stewardship} />
        <SimulationWorkspaceRemote institutionId={ctx.institution_id} />
      </div>
    </CollaborationWorkbenchShell>
  );
}
