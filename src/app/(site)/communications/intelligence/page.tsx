import { communicationIntelligenceService } from "@/lib/civic-action/builds/11.7/intelligence";
import {
  assembleCommunicationsHome,
  DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT,
} from "@/lib/civic-action/builds/11.7/ux";
import { CollaborationWorkbenchShell } from "@/features/communications/components/CollaborationWorkbenchShell";
import { CommunicationIntelligenceDashboard } from "@/features/communications/components/CommunicationIntelligenceDashboard";
import { CommunicationCopilot } from "@/features/communications/components/CommunicationCopilot";
import { DecisionTimelinePanel } from "@/features/communications/components/DecisionTimelinePanel";
import { MeetingIntelligencePanel } from "@/features/communications/components/MeetingIntelligencePanel";
import { RelationshipExplorer } from "@/features/communications/components/RelationshipExplorer";
import { InstitutionMemoryBrowser } from "@/features/communications/components/InstitutionMemoryBrowser";

const ctx = DEFAULT_COMMUNICATION_EXPERIENCE_CONTEXT;
const intelCtx = { actor_human_id: ctx.actor_human_id, institution_id: ctx.institution_id };

export default function CommunicationsIntelligencePage() {
  const home = assembleCommunicationsHome(ctx);
  const recommendations = communicationIntelligenceService.getRecommendations(intelCtx);
  const portfolio = communicationIntelligenceService.getPortfolio(intelCtx);
  const health = communicationIntelligenceService.getHealth(intelCtx);
  const brief = communicationIntelligenceService.getBriefing(intelCtx);
  const decisions = communicationIntelligenceService.getDecisions(ctx.institution_id);
  const meetings = communicationIntelligenceService.getMeetings(ctx.institution_id);
  const relationships = communicationIntelligenceService.getRelationships(ctx.institution_id);
  const memory = communicationIntelligenceService.getInstitutionalMemory(ctx.institution_id);

  return (
    <CollaborationWorkbenchShell shell={home.shell}>
      <CommunicationIntelligenceDashboard
        recommendations={recommendations}
        portfolio={portfolio}
        health={health}
        brief={brief}
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DecisionTimelinePanel decisions={decisions} />
        <MeetingIntelligencePanel meetings={meetings} />
        <RelationshipExplorer nodes={relationships.nodes} edges={relationships.edges} />
        <InstitutionMemoryBrowser artifacts={memory} />
      </div>
      <div className="mt-8">
        <CommunicationCopilot />
      </div>
    </CollaborationWorkbenchShell>
  );
}
