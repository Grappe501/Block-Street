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

let livingDataSeeded = false;

function ensureLivingDataSeeded() {
  if (livingDataSeeded) return;
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
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
}

export const livingIntelligenceApplicationService = new LivingIntelligenceApplicationService();
