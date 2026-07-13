/**
 * CAE-11.12-W4 — Learning UX facade (KNW-UX-001)
 */
export * from "./view-models";
export * from "./locale";
export * from "./human-messages";
export * from "./experience-context";
export * from "./ui-actions";
export * from "./assemble-workbench-shell";
export * from "./assemble-home";
export * from "./assemble-knowledge-reader";
export * from "./assemble-learning-workspace";
export * from "./assemble-competency-workspace";
export * from "./assemble-certification-workspace";
export * from "./assemble-universal-search";
export * from "./assemble-ai-command-bar";
export * from "./assemble-mission-workspace";
export * from "./assemble-notification-center";
export * from "./assemble-calendar-panel";

import type { KnowledgeExperienceContext } from "./experience-context";
import { assembleHomeDashboard } from "./assemble-home";
import { assembleLearningWorkspace } from "./assemble-learning-workspace";
import { assembleCompetencyWorkspace } from "./assemble-competency-workspace";
import { assembleCertificationWorkspace } from "./assemble-certification-workspace";
import { assembleMissionWorkspace } from "./assemble-mission-workspace";
import { assembleNotificationCenter } from "./assemble-notification-center";
import { assembleCalendarPanel } from "./assemble-calendar-panel";
import { assembleAICommandBar } from "./assemble-ai-command-bar";

export const knowledgeExperienceService = {
  getHome: (ctx: KnowledgeExperienceContext) => assembleHomeDashboard(ctx),
  getLearning: (ctx: KnowledgeExperienceContext) => assembleLearningWorkspace(ctx),
  getCompetencies: (ctx: KnowledgeExperienceContext) => assembleCompetencyWorkspace(ctx),
  getCertifications: (ctx: KnowledgeExperienceContext) => assembleCertificationWorkspace(ctx),
  getMissions: (ctx: KnowledgeExperienceContext, missionId: string) => assembleMissionWorkspace(ctx, missionId),
  getNotifications: (ctx: KnowledgeExperienceContext) => assembleNotificationCenter(ctx),
  getCalendar: (ctx: KnowledgeExperienceContext) => assembleCalendarPanel(ctx),
  getAICommandBar: () => assembleAICommandBar(),
};
