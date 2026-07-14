/**
 * CAE-11.7-W1 — Living Intelligence application facade
 */
import { localBrainRuntime } from "./localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "./localbrain/services/seed";
import { contextIntelligenceRuntime } from "./context/services/context-intelligence-service";
import { seedContextIfEmpty } from "./context/services/seed";
import { executiveAssistantRuntime } from "./executive-assistant/services/executive-assistant-service";
import { seedExecutiveIfEmpty } from "./executive-assistant/services/seed";
import { organizerRuntime } from "./organizer/services/organizer-service";
import { seedOrganizerIfEmpty } from "./organizer/services/seed";
import { researchRuntime } from "./research/services/research-network-service";
import { seedResearchIfEmpty } from "./research/services/seed";
import { conversationRuntime } from "./conversation/services/conversation-service";
import { seedConversationIfEmpty } from "./conversation/services/seed";
import { learningRuntime } from "./learning/services/learning-service";
import { seedLearningIfEmpty } from "./learning/services/seed";
import { predictionRuntime } from "./prediction/services/prediction-service";
import { seedPredictionIfEmpty } from "./prediction/services/seed";
import { agentRuntime } from "./agents/services/agent-service";
import { seedAgentsIfEmpty } from "./agents/services/seed";
import { partnershipRuntime } from "./partnership/services/partnership-service";
import { seedPartnershipIfEmpty } from "./partnership/services/seed";
import { federationRuntime } from "./federation/services/federation-service";
import { seedFederationIfEmpty } from "./federation/services/seed";
import { automationRuntime } from "./automation/services/automation-service";
import { seedAutomationIfEmpty } from "./automation/services/seed";
import { factoryRuntime } from "./factory/services/factory-service";
import { seedFactoryIfEmpty } from "./factory/services/seed";
import { twinRuntime } from "./twin/services/twin-service";
import { seedTwinIfEmpty } from "./twin/services/seed";

let livingDataSeeded = false;

function ensureLivingDataSeeded() {
  if (livingDataSeeded) return;
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
  seedPredictionIfEmpty();
  seedAgentsIfEmpty();
  seedPartnershipIfEmpty();
  seedFederationIfEmpty();
  seedAutomationIfEmpty();
  seedFactoryIfEmpty();
  seedTwinIfEmpty();
  livingDataSeeded = true;
}

export class LivingIntelligenceApplicationService {
  private boot() {
    ensureLivingDataSeeded();
  }

  getLocalBrain(humanId: string) {
    this.boot();
    return localBrainRuntime.localBrain.getByHuman(humanId);
  }

  provisionLocalBrain(humanId: string) {
    this.boot();
    return localBrainRuntime.localBrain.provision(humanId);
  }

  getLocalBrainContext(input: Parameters<typeof localBrainRuntime.context.resolve>[0]) {
    this.boot();
    return localBrainRuntime.context.resolve(input);
  }

  listLocalBrainMemory(humanId: string, tier?: Parameters<typeof localBrainRuntime.memory.list>[1]) {
    this.boot();
    return localBrainRuntime.memory.list(humanId, tier);
  }

  createLocalBrainMemory(input: Parameters<typeof localBrainRuntime.memory.create>[0]) {
    this.boot();
    return localBrainRuntime.memory.create(input);
  }

  promoteLocalBrainMemory(
    memoryId: string,
    humanId: string,
    approvedBy: string,
    targetTier: Parameters<typeof localBrainRuntime.memory.promote>[3]
  ) {
    this.boot();
    return localBrainRuntime.memory.promote(memoryId, humanId, approvedBy, targetTier);
  }

  getLocalBrainTimeline(humanId: string) {
    this.boot();
    return localBrainRuntime.timeline.list(humanId);
  }

  getLocalBrainPreferences(humanId: string) {
    this.boot();
    return localBrainRuntime.preferences.get(humanId);
  }

  updateLocalBrainPreferences(input: Parameters<typeof localBrainRuntime.preferences.update>[0]) {
    this.boot();
    return localBrainRuntime.preferences.update(input);
  }

  updateLocalBrainContext(input: Parameters<typeof localBrainRuntime.context.resolve>[0]) {
    this.boot();
    return localBrainRuntime.context.resolve(input);
  }

  getLocalBrainAnalytics(humanId: string) {
    this.boot();
    return localBrainRuntime.analytics.compute(humanId);
  }

  assembleContextIntelligence(input: { human_id: string; institution_id?: string }) {
    this.boot();
    return contextIntelligenceRuntime.assemble(input);
  }

  resolveContextIntelligence(input: Parameters<typeof contextIntelligenceRuntime.resolution.resolve>[0]) {
    this.boot();
    return contextIntelligenceRuntime.resolution.resolve(input);
  }

  selectActiveContext(input: Parameters<typeof contextIntelligenceRuntime.active.select>[0]) {
    this.boot();
    return contextIntelligenceRuntime.active.select(input);
  }

  confirmActiveContext(humanId: string, contextId: string) {
    this.boot();
    return contextIntelligenceRuntime.confirmation.confirm(humanId, contextId);
  }

  correctActiveContext(input: Parameters<typeof contextIntelligenceRuntime.correction.correct>[0]) {
    this.boot();
    return contextIntelligenceRuntime.correction.correct(input);
  }

  pauseContextInference(humanId: string) {
    this.boot();
    return contextIntelligenceRuntime.correction.pauseInference(humanId);
  }

  switchInstitutionContext(input: Parameters<typeof contextIntelligenceRuntime.institution.switchTo>[0]) {
    this.boot();
    return contextIntelligenceRuntime.institution.switchTo(input);
  }

  getAttentionItems(input: Parameters<typeof contextIntelligenceRuntime.attention.evaluate>[0]) {
    this.boot();
    return contextIntelligenceRuntime.attention.evaluate(input);
  }

  startFocusSession(input: Parameters<typeof contextIntelligenceRuntime.focus.start>[0]) {
    this.boot();
    return contextIntelligenceRuntime.focus.start(input);
  }

  listNextActions(humanId: string) {
    this.boot();
    return contextIntelligenceRuntime.nextAction.list(humanId);
  }

  dismissNextAction(nextActionId: string, humanId: string) {
    this.boot();
    return contextIntelligenceRuntime.nextAction.dismiss(nextActionId, humanId);
  }

  getContextSignals(humanId: string) {
    this.boot();
    return contextIntelligenceRuntime.signals.list(humanId);
  }

  getContextPrivacyCenter(humanId: string) {
    this.boot();
    return contextIntelligenceRuntime.privacy.controlCenter(humanId);
  }

  getExecutiveAssistantHome(input: { human_id: string; institution_id: string }) {
    this.boot();
    return executiveAssistantRuntime.orchestrator.home(input);
  }

  generateExecutiveBriefing(input: Parameters<typeof executiveAssistantRuntime.briefing.generate>[0]) {
    this.boot();
    return executiveAssistantRuntime.briefing.generate(input);
  }

  listExecutiveBriefings(humanId: string) {
    this.boot();
    return executiveAssistantRuntime.briefing.list(humanId);
  }

  getExecutiveBriefing(briefingId: string) {
    this.boot();
    return executiveAssistantRuntime.briefing.get(briefingId);
  }

  prepareMeeting(input: Parameters<typeof executiveAssistantRuntime.meeting.prepare>[0]) {
    this.boot();
    return executiveAssistantRuntime.meeting.prepare(input);
  }

  listDecisionPackages(humanId: string) {
    this.boot();
    return executiveAssistantRuntime.decision.list(humanId);
  }

  prepareDecisionPackage(input: Parameters<typeof executiveAssistantRuntime.decision.prepare>[0]) {
    this.boot();
    return executiveAssistantRuntime.decision.prepare(input);
  }

  listExecutiveCommitments(humanId: string) {
    this.boot();
    return executiveAssistantRuntime.commitment.list(humanId);
  }

  confirmExecutiveCommitment(commitmentId: string, humanId: string, edits?: { due_at?: string; commitment_text?: string }) {
    this.boot();
    return executiveAssistantRuntime.commitment.confirm(commitmentId, humanId, edits);
  }

  prepareExecutiveDraft(input: Parameters<typeof executiveAssistantRuntime.drafting.prepare>[0]) {
    this.boot();
    return executiveAssistantRuntime.drafting.prepare(input);
  }

  prepareDelegation(input: Parameters<typeof executiveAssistantRuntime.delegation.prepare>[0]) {
    this.boot();
    return executiveAssistantRuntime.delegation.prepare(input);
  }

  answerExecutiveInquiry(input: Parameters<typeof executiveAssistantRuntime.inquiry.answer>[0]) {
    this.boot();
    return executiveAssistantRuntime.inquiry.answer(input);
  }

  reportExecutiveOutputProblem(input: Parameters<typeof executiveAssistantRuntime.audit.reportProblem>[0]) {
    this.boot();
    return executiveAssistantRuntime.audit.reportProblem(input);
  }

  routeExecutiveRequest(input: Parameters<typeof executiveAssistantRuntime.orchestrator.route>[0]) {
    this.boot();
    return executiveAssistantRuntime.orchestrator.route(input);
  }

  getOrganizerDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return organizerRuntime.organizer.dashboard(input);
  }

  getDailyPlan(humanId: string) {
    this.boot();
    return organizerRuntime.dailyPlanning.list(humanId);
  }

  createDailyPlan(input: Parameters<typeof organizerRuntime.dailyPlanning.create>[0]) {
    this.boot();
    return organizerRuntime.dailyPlanning.create(input);
  }

  getMissionPlan(input: Parameters<typeof organizerRuntime.mission.coordinate>[0]) {
    this.boot();
    return organizerRuntime.mission.coordinate(input);
  }

  getTeamStatus(institutionId: string, missionId?: string) {
    this.boot();
    return organizerRuntime.team.snapshot({ institution_id: institutionId, mission_id: missionId });
  }

  getDependencies(humanId: string) {
    this.boot();
    return organizerRuntime.dependency.list(humanId);
  }

  getTravelPlan(input: Parameters<typeof organizerRuntime.travel.prepare>[0]) {
    this.boot();
    return organizerRuntime.travel.prepare(input);
  }

  getResourceStatus(institutionId: string) {
    this.boot();
    return organizerRuntime.resource.snapshot(institutionId);
  }

  completeDailyReview(input: Parameters<typeof organizerRuntime.review.complete>[0]) {
    this.boot();
    return organizerRuntime.review.complete(input);
  }

  createOrganizerRecommendation(input: Parameters<typeof organizerRuntime.organizer.recommend>[0]) {
    this.boot();
    return organizerRuntime.organizer.recommend(input);
  }

  getResearchDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return researchRuntime.research.dashboard(input);
  }

  listResearchItems(humanId: string) {
    this.boot();
    return researchRuntime.acquisition.list(humanId);
  }

  listResearchSources() {
    this.boot();
    return researchRuntime.sources.list();
  }

  searchResearch(input: Parameters<typeof researchRuntime.acquisition.search>[0]) {
    this.boot();
    return researchRuntime.acquisition.search(input);
  }

  listResearchBriefs(humanId: string) {
    this.boot();
    return researchRuntime.briefs.list(humanId);
  }

  generateResearchBrief(input: Parameters<typeof researchRuntime.briefs.generate>[0]) {
    this.boot();
    return researchRuntime.briefs.generate(input);
  }

  listResearchChanges(institutionId: string) {
    this.boot();
    return researchRuntime.changes.list(institutionId);
  }

  listResearchOpportunities(institutionId: string) {
    this.boot();
    return researchRuntime.opportunities.list(institutionId);
  }

  listResearchThreats(institutionId: string) {
    this.boot();
    return researchRuntime.threats.list(institutionId);
  }

  startResearchMonitor(input: Parameters<typeof researchRuntime.monitoring.start>[0]) {
    this.boot();
    return researchRuntime.monitoring.start(input);
  }

  requestResearchPromotion(input: Parameters<typeof researchRuntime.promotion.request>[0]) {
    this.boot();
    return researchRuntime.promotion.request(input);
  }

  getConversationDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return conversationRuntime.conversation.dashboard(input);
  }

  listConversations(humanId: string) {
    this.boot();
    return conversationRuntime.conversations.list(humanId);
  }

  importConversation(input: Parameters<typeof conversationRuntime.conversations.import>[0]) {
    this.boot();
    return conversationRuntime.conversations.import(input);
  }

  listMeetingMemory(humanId: string) {
    this.boot();
    return conversationRuntime.meetings.list(humanId);
  }

  listTranscripts(humanId: string, conversationId?: string) {
    this.boot();
    if (!conversationId) {
      return conversationRuntime.conversations.list(humanId).flatMap((c) =>
        conversationRuntime.transcription.list(c.conversation_id)
      );
    }
    return conversationRuntime.transcription.list(conversationId);
  }

  transcribeConversation(input: Parameters<typeof conversationRuntime.transcription.generate>[0]) {
    this.boot();
    return conversationRuntime.transcription.generate(input);
  }

  listConversationDecisions(institutionId: string) {
    this.boot();
    return conversationRuntime.decisions.list(institutionId);
  }

  listConversationCommitments(humanId: string) {
    this.boot();
    return conversationRuntime.commitments.list(humanId);
  }

  getDialogueGraph(institutionId: string) {
    this.boot();
    return conversationRuntime.dialogue.list(institutionId);
  }

  searchConversations(input: Parameters<typeof conversationRuntime.search.search>[0]) {
    this.boot();
    return conversationRuntime.search.search(input);
  }

  summarizeConversation(conversationId: string, humanId: string) {
    this.boot();
    return conversationRuntime.conversation.summarize(conversationId, humanId);
  }

  promoteConversation(input: Parameters<typeof conversationRuntime.conversation.promote>[0]) {
    this.boot();
    return conversationRuntime.conversation.promote(input);
  }

  getLearningDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return learningRuntime.learning.dashboard(input);
  }

  listLearningCourses(institutionId: string) {
    this.boot();
    return learningRuntime.curriculum.listCourses(institutionId);
  }

  createLearningCourse(input: Parameters<typeof learningRuntime.curriculum.createCourse>[0]) {
    this.boot();
    return learningRuntime.curriculum.createCourse(input);
  }

  listLearningCurriculum(institutionId: string) {
    this.boot();
    return learningRuntime.curriculum.listCurricula(institutionId);
  }

  listCompetencies(institutionId: string) {
    this.boot();
    return learningRuntime.competencies.list(institutionId);
  }

  listLearningCertifications(humanId: string) {
    this.boot();
    return learningRuntime.certifications.list(humanId);
  }

  listMentorRecommendations(humanId: string) {
    this.boot();
    return learningRuntime.mentors.list(humanId);
  }

  getLearningAnalytics(input: { institution_id: string; human_id?: string }) {
    this.boot();
    return learningRuntime.analytics.compute(input);
  }

  createLearningPlan(input: Parameters<typeof learningRuntime.plans.create>[0]) {
    this.boot();
    return learningRuntime.plans.create(input);
  }

  submitLearningAssessment(input: Parameters<typeof learningRuntime.governance.assess>[0]) {
    this.boot();
    return learningRuntime.governance.assess(input);
  }

  startLearningSimulation(input: Parameters<typeof learningRuntime.simulations.start>[0]) {
    this.boot();
    return learningRuntime.simulations.start(input);
  }

  promoteLearningExperience(input: Parameters<typeof learningRuntime.learning.promote>[0]) {
    this.boot();
    return learningRuntime.learning.promote(input);
  }

  getPredictionDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return predictionRuntime.prediction.dashboard(input);
  }

  listForecasts(humanId: string) {
    this.boot();
    return predictionRuntime.forecasts.list(humanId);
  }

  runForecast(input: Parameters<typeof predictionRuntime.forecasts.run>[0]) {
    this.boot();
    return predictionRuntime.forecasts.run(input);
  }

  listScenarios(humanId: string) {
    this.boot();
    return predictionRuntime.scenarios.list(humanId);
  }

  createScenario(input: Parameters<typeof predictionRuntime.scenarios.create>[0]) {
    this.boot();
    return predictionRuntime.scenarios.create(input);
  }

  listPredictionTrends(institutionId: string) {
    this.boot();
    return predictionRuntime.trends.list(institutionId);
  }

  listPredictionRisks(institutionId: string) {
    this.boot();
    return predictionRuntime.risks.list(institutionId);
  }

  listPredictionOpportunities(institutionId: string) {
    this.boot();
    return predictionRuntime.opportunities.list(institutionId);
  }

  listStrategicPlanning(institutionId: string) {
    this.boot();
    return predictionRuntime.planning.list(institutionId);
  }

  updatePredictionAssumption(input: Parameters<typeof predictionRuntime.assumptions.update>[0]) {
    this.boot();
    return predictionRuntime.assumptions.update(input);
  }

  runPredictionSimulation(input: Parameters<typeof predictionRuntime.simulations.run>[0]) {
    this.boot();
    return predictionRuntime.simulations.run(input);
  }

  getAgentDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return agentRuntime.agents.dashboard(input);
  }

  listAgentRegistry(institutionId: string) {
    this.boot();
    return agentRuntime.registry.list(institutionId);
  }

  listAgentTasks(humanId: string) {
    this.boot();
    return agentRuntime.orchestrator.listTasks(humanId);
  }

  listAgentEvidence(taskId?: string) {
    this.boot();
    return agentRuntime.evidence.list(taskId);
  }

  listAgentConflicts(institutionId: string) {
    this.boot();
    return agentRuntime.conflicts.list(institutionId);
  }

  runAgentOrchestration(input: Parameters<typeof agentRuntime.orchestrator.run>[0]) {
    this.boot();
    return agentRuntime.orchestrator.run(input);
  }

  installAgent(input: Parameters<typeof agentRuntime.marketplace.install>[0]) {
    this.boot();
    return agentRuntime.marketplace.install(input);
  }

  retireAgent(agentId: string) {
    this.boot();
    return agentRuntime.registry.retire(agentId);
  }

  determineAgentConsensus(input: Parameters<typeof agentRuntime.consensus.determine>[0]) {
    this.boot();
    return agentRuntime.consensus.determine(input);
  }

  getPartnershipDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return partnershipRuntime.partnership.dashboard(input);
  }

  getLivingInstitution(input: { human_id: string; institution_id: string }) {
    this.boot();
    const dashboard = partnershipRuntime.partnership.dashboard(input);
    const health = partnershipRuntime.health.measure(input.institution_id);
    const wisdom = partnershipRuntime.wisdom.list(input.institution_id);
    return { ...dashboard, health: health.health, wisdom_count: wisdom.length, living_institution: true };
  }

  listTrustCalibrations(institutionId: string) {
    this.boot();
    return partnershipRuntime.trust.list(institutionId);
  }

  recalculateTrust(input: Parameters<typeof partnershipRuntime.trust.recalculate>[0]) {
    this.boot();
    return partnershipRuntime.trust.recalculate(input);
  }

  listInstitutionalWisdom(institutionId: string) {
    this.boot();
    return partnershipRuntime.wisdom.list(institutionId);
  }

  listPartnershipFeedback(humanId: string) {
    this.boot();
    return partnershipRuntime.feedback.list(humanId);
  }

  submitPartnershipFeedback(input: Parameters<typeof partnershipRuntime.feedback.submit>[0]) {
    this.boot();
    return partnershipRuntime.feedback.submit(input);
  }

  listDecisionOutcomes(institutionId: string) {
    this.boot();
    return partnershipRuntime.outcomes.list(institutionId);
  }

  recordDecisionOutcome(input: Parameters<typeof partnershipRuntime.outcomes.record>[0]) {
    this.boot();
    return partnershipRuntime.outcomes.record(input);
  }

  recordInstitutionalReflection(input: Parameters<typeof partnershipRuntime.learning.recordReflection>[0]) {
    this.boot();
    return partnershipRuntime.learning.recordReflection(input);
  }

  getFederationDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return federationRuntime.federation.dashboard(input);
  }

  listFederationInstitutions() {
    this.boot();
    return federationRuntime.institutions.list();
  }

  listFederationCoalitions() {
    this.boot();
    return federationRuntime.coalitions.list();
  }

  listSharedMissions() {
    this.boot();
    return federationRuntime.missions.list();
  }

  listSharedKnowledge(ownerInstitutionId?: string) {
    this.boot();
    return federationRuntime.knowledge.list(ownerInstitutionId);
  }

  listFederationPartners(institutionId: string) {
    this.boot();
    return federationRuntime.trust.listPartners(institutionId);
  }

  joinFederation(input: Parameters<typeof federationRuntime.federation.join>[0]) {
    this.boot();
    return federationRuntime.federation.join(input);
  }

  shareFederationResource(input: Parameters<typeof federationRuntime.resources.share>[0]) {
    this.boot();
    return federationRuntime.resources.share(input);
  }

  createFederationCoalition(input: Parameters<typeof federationRuntime.coalitions.create>[0]) {
    this.boot();
    return federationRuntime.coalitions.create(input);
  }

  updateFederationTrust(input: Parameters<typeof federationRuntime.trust.update>[0]) {
    this.boot();
    return federationRuntime.trust.update(input);
  }

  publishFederationKnowledge(input: Parameters<typeof federationRuntime.knowledge.publish>[0]) {
    this.boot();
    return federationRuntime.knowledge.publish(input);
  }

  getAutomationDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return automationRuntime.automation.dashboard(input);
  }

  listAutomationWorkflows(institutionId: string) {
    this.boot();
    return automationRuntime.registry.list(institutionId);
  }

  listAutomationApprovals(institutionId: string) {
    this.boot();
    return automationRuntime.approvals.list(institutionId);
  }

  listAutomationOperations(institutionId: string) {
    this.boot();
    return automationRuntime.engine.listRuns(institutionId);
  }

  listAutomationPlaybooks(institutionId: string) {
    this.boot();
    return automationRuntime.playbooks.list(institutionId);
  }

  startWorkflow(input: Parameters<typeof automationRuntime.engine.start>[0]) {
    this.boot();
    return automationRuntime.engine.start(input);
  }

  pauseWorkflow(runId: string, institutionId: string, humanId: string) {
    this.boot();
    return automationRuntime.engine.pause(runId, institutionId, humanId);
  }

  resumeWorkflow(runId: string, institutionId: string, humanId: string) {
    this.boot();
    return automationRuntime.engine.resume(runId, institutionId, humanId);
  }

  cancelWorkflow(runId: string, institutionId: string, humanId: string) {
    this.boot();
    return automationRuntime.engine.cancel(runId, institutionId, humanId);
  }

  approveWorkflow(approvalId: string, institutionId: string, humanId: string) {
    this.boot();
    return automationRuntime.approvals.grant(approvalId, institutionId, humanId);
  }

  getFactoryDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return factoryRuntime.factory.dashboard(input);
  }

  listFactoryCapabilities(institutionId: string) {
    this.boot();
    return factoryRuntime.registry.list(institutionId);
  }

  listFactoryExtensions(institutionId: string) {
    this.boot();
    return factoryRuntime.marketplace.list(institutionId);
  }

  listFactoryDeployments(institutionId: string) {
    this.boot();
    return factoryRuntime.deployment.list(institutionId);
  }

  getFactoryObservatory(institutionId: string) {
    this.boot();
    const records = factoryRuntime.observatory.list(institutionId);
    return records.length > 0 ? records[records.length - 1] : factoryRuntime.observatory.measure({ institution_id: institutionId }).observatory;
  }

  proposeCapability(input: Parameters<typeof factoryRuntime.registry.register>[0]) {
    this.boot();
    return factoryRuntime.registry.register(input);
  }

  buildCapability(input: Parameters<typeof factoryRuntime.build.build>[0]) {
    this.boot();
    return factoryRuntime.build.build(input);
  }

  startDeployment(input: Parameters<typeof factoryRuntime.deployment.start>[0]) {
    this.boot();
    return factoryRuntime.deployment.start(input);
  }

  rollbackDeployment(input: Parameters<typeof factoryRuntime.rollback.execute>[0]) {
    this.boot();
    return factoryRuntime.rollback.execute(input);
  }

  publishExtension(input: Parameters<typeof factoryRuntime.marketplace.publish>[0]) {
    this.boot();
    return factoryRuntime.marketplace.publish(input);
  }

  getTwinDashboard(input: { human_id: string; institution_id: string }) {
    this.boot();
    return twinRuntime.twin.dashboard(input);
  }

  listTwinSimulations(institutionId: string) {
    this.boot();
    return twinRuntime.simulation.list(institutionId);
  }

  listTwinExperiments(institutionId: string) {
    this.boot();
    return twinRuntime.experiments.list(institutionId);
  }

  listTwinScenarios(institutionId: string) {
    this.boot();
    return twinRuntime.scenarios.list(institutionId);
  }

  getTwinObservatory(institutionId: string) {
    this.boot();
    const records = twinRuntime.observatory.list(institutionId);
    if (records.length > 0) return records[records.length - 1];
    const twins = twinRuntime.digitalTwin.list(institutionId);
    if (twins.length === 0) return null;
    return twinRuntime.observatory.measure({
      institution_id: institutionId,
      twin_id: twins[twins.length - 1].twin_id,
    }).observatory;
  }

  runSimulation(input: Parameters<typeof twinRuntime.simulation.run>[0]) {
    this.boot();
    return twinRuntime.simulation.run(input);
  }

  createExperiment(input: Parameters<typeof twinRuntime.experiments.create>[0]) {
    this.boot();
    return twinRuntime.experiments.create(input);
  }

  compareScenarios(input: Parameters<typeof twinRuntime.scenarios.compare>[0]) {
    this.boot();
    return twinRuntime.scenarios.compare(input);
  }

  synchronizeTwin(input: Parameters<typeof twinRuntime.sync.synchronize>[0]) {
    this.boot();
    return twinRuntime.sync.synchronize(input);
  }

  resetTwinSandbox(input: Parameters<typeof twinRuntime.digitalTwin.resetSandbox>[0]) {
    this.boot();
    return twinRuntime.digitalTwin.resetSandbox(input);
  }
}

export const livingIntelligenceApplicationService = new LivingIntelligenceApplicationService();
