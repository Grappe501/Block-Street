"use client";

import eab from "../../../data/registry/experience-architecture-bible.json";
import eds from "../../../data/registry/experience-design-system.json";
import nav from "../../../data/registry/experience-navigation-architecture.json";
import dash from "../../../data/registry/dashboard-architecture.json";
import journey from "../../../data/registry/user-journey-architecture.json";
import dls from "../../../data/registry/design-language-system.json";
import comp from "../../../data/registry/experience-component-architecture.json";
import work from "../../../data/registry/workspace-architecture.json";
import collab from "../../../data/registry/collaboration-architecture.json";
import mobile from "../../../data/registry/mobile-experience-architecture.json";
import aiexp from "../../../data/registry/ai-experience-architecture.json";
import engage from "../../../data/registry/engagement-architecture.json";
import trust from "../../../data/registry/trust-architecture.json";
import inst from "../../../data/registry/institutional-experience-architecture.json";
import orch from "../../../data/registry/experience-orchestrator.json";

type ExperienceReg = {
  defines?: string[];
  topicCount?: number;
  acceptanceCriteria: string;
  status: string;
  guidingPrinciple?: string;
  coreExperiencePrincipleCount?: number;
  experienceQualityEngine?: { domainCount: number };
  navigationLevelCount?: number;
  intentNavigationEngine?: { exampleIntentCount: number };
  adaptiveWorkspaceEngine?: { compositionLayerCount: number };
  workspaceTypeCount?: number;
  universalDashboardPanelCount?: number;
  livingDesignSystem?: { designTokenCategoryCount: number; componentCategoryCount: number };
  designPrincipleCount?: number;
  semanticColorCount?: number;
  typographyLevelCount?: number;
  livingOperationalComponentRegistry?: { definitionDomainCount: number };
  componentHierarchyLevelCount?: number;
  operationalComponentCount?: number;
  universalComponentStructure?: { layerCount: number };
  unifiedWorkspaceManager?: { coordinationDomainCount: number };
  universalWorkspaceZoneCount?: number;
  workspacePrincipleCount?: number;
  collaborativeIntelligenceNetwork?: { layerCount: number; continuousQuestionCount: number };
  collaborationDomainCount?: number;
  collaborationPrincipleCount?: number;
  fieldOperationsCommandLayer?: { assemblyDomainCount: number; deviceRoleCount: number };
  fieldOperationModeCount?: number;
  mobilePrincipleCount?: number;
};

const FEATURED_SUBTITLES: Record<string, string> = {
  "4.1": "Experience Design",
  "4.2": "Navigation",
  "4.3": "Dashboard & Workspace",
  "4.5": "Design Language",
  "4.6": "Components",
  "4.7": "Workspaces",
  "4.8": "Collaboration",
  "4.9": "Field Operations",
};

const EXPERIENCE_CARDS: { step: string; label: string; reg: ExperienceReg; cardClass: string; metaClass: string; titleClass: string; featured?: boolean }[] = [
  { step: "4.1", label: "Experience Quality Engine", reg: eds, cardClass: "border-sky-300 bg-sky-50", metaClass: "text-sky-700", titleClass: "text-sky-950", featured: true },
  { step: "4.2", label: "Intent Navigation Engine", reg: nav, cardClass: "border-blue-300 bg-blue-50", metaClass: "text-blue-700", titleClass: "text-blue-950", featured: true },
  { step: "4.3", label: "Adaptive Workspace Engine", reg: dash, cardClass: "border-indigo-300 bg-indigo-50", metaClass: "text-indigo-700", titleClass: "text-indigo-950", featured: true },
  { step: "4.4", label: "User Journey Architecture", reg: journey, cardClass: "border-violet-300 bg-violet-50", metaClass: "text-violet-700", titleClass: "text-violet-950" },
  { step: "4.5", label: "Living Design System", reg: dls, cardClass: "border-purple-300 bg-purple-50", metaClass: "text-purple-700", titleClass: "text-purple-950", featured: true },
  { step: "4.6", label: "Living Operational Component Registry", reg: comp, cardClass: "border-fuchsia-300 bg-fuchsia-50", metaClass: "text-fuchsia-700", titleClass: "text-fuchsia-950", featured: true },
  { step: "4.7", label: "Unified Workspace Manager", reg: work, cardClass: "border-pink-300 bg-pink-50", metaClass: "text-pink-700", titleClass: "text-pink-950", featured: true },
  { step: "4.8", label: "Collaborative Intelligence Network", reg: collab, cardClass: "border-rose-300 bg-rose-50", metaClass: "text-rose-700", titleClass: "text-rose-950", featured: true },
  { step: "4.9", label: "Field Operations Command Layer", reg: mobile, cardClass: "border-red-300 bg-red-50", metaClass: "text-red-700", titleClass: "text-red-950", featured: true },
  { step: "4.10", label: "AI Experience", reg: aiexp, cardClass: "border-orange-300 bg-orange-50", metaClass: "text-orange-700", titleClass: "text-orange-950" },
  { step: "4.11", label: "Engagement & Gamification", reg: engage, cardClass: "border-amber-300 bg-amber-50", metaClass: "text-amber-700", titleClass: "text-amber-950" },
  { step: "4.12", label: "Trust & Transparency", reg: trust, cardClass: "border-yellow-300 bg-yellow-50", metaClass: "text-yellow-700", titleClass: "text-yellow-950" },
  { step: "4.13", label: "Institutional Experience", reg: inst, cardClass: "border-lime-300 bg-lime-50", metaClass: "text-lime-700", titleClass: "text-lime-950" },
  { step: "4.14", label: "Experience Orchestrator", reg: orch, cardClass: "border-green-300 bg-green-50", metaClass: "text-green-700", titleClass: "text-green-950" },
];

export function AdminUserExperience() {
  const pendingSteps = eab.steps.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="card border-sky-400 bg-sky-100">
        <p className="text-xs font-semibold uppercase text-sky-900">VOLUME 4 · User Experience</p>
        <h2 className="mt-1 text-xl font-bold text-sky-950">{eab.productName}</h2>
        <p className="mt-2 text-sm text-sky-900">{eab.coreQuestion}</p>
        <p className="mt-1 text-xs italic text-sky-900">&ldquo;{eab.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-sky-800">
          {eab.stepsComplete}/{eab.stepsTotal} experience layers · {eab.experienceLayerCount} layers · {eab.status}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {EXPERIENCE_CARDS.map(({ step, label, reg, cardClass, metaClass, titleClass, featured }) => (
          <div key={step} className={`card ${cardClass}`}>
            <p className={`text-xs font-semibold uppercase ${metaClass}`}>VOLUME-00{step.replace(".", "-")} · {featured ? FEATURED_SUBTITLES[step] ?? label : label}</p>
            <h3 className={`mt-1 text-sm font-bold ${titleClass}`}>{label}</h3>
            {reg.guidingPrinciple ? (
              <p className={`mt-1 text-xs italic ${metaClass}`}>&ldquo;{reg.guidingPrinciple}&rdquo;</p>
            ) : null}
            <p className={`mt-2 text-xs ${metaClass}`}>
              {reg.acceptanceCriteria} · {reg.status}
            </p>
            {reg.fieldOperationsCommandLayer ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.fieldOperationModeCount ?? 0} field modes · {reg.mobilePrincipleCount ?? 0} mobile principles · {reg.fieldOperationsCommandLayer.assemblyDomainCount} FOCL domains · {reg.fieldOperationsCommandLayer.deviceRoleCount} device roles
              </p>
            ) : reg.collaborativeIntelligenceNetwork ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.collaborationDomainCount ?? 0} collaboration domains · {reg.collaborationPrincipleCount ?? 0} principles · {reg.collaborativeIntelligenceNetwork.layerCount} CIN layers · {reg.collaborativeIntelligenceNetwork.continuousQuestionCount} intelligence questions
              </p>
            ) : reg.unifiedWorkspaceManager ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.workspaceTypeCount ?? 0} workspace types · {reg.universalWorkspaceZoneCount ?? 0} framework zones · {reg.workspacePrincipleCount ?? 0} principles · {reg.unifiedWorkspaceManager.coordinationDomainCount} UWM domains
              </p>
            ) : reg.livingOperationalComponentRegistry ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.componentHierarchyLevelCount ?? 0} hierarchy levels · {reg.operationalComponentCount ?? 0} operational components · {reg.universalComponentStructure?.layerCount ?? 0} universal structure layers · {reg.livingOperationalComponentRegistry.definitionDomainCount} LOCR domains
              </p>
            ) : reg.livingDesignSystem ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.designPrincipleCount ?? 0} design principles · {reg.semanticColorCount ?? 0} semantic colors · {reg.livingDesignSystem.designTokenCategoryCount} LDS token categories · {reg.livingDesignSystem.componentCategoryCount} component categories
              </p>
            ) : reg.adaptiveWorkspaceEngine ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.workspaceTypeCount ?? 0} workspace types · {reg.universalDashboardPanelCount ?? 0} dashboard panels · {reg.adaptiveWorkspaceEngine.compositionLayerCount} AWE layers
              </p>
            ) : reg.intentNavigationEngine ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.navigationLevelCount ?? 0} navigation levels · {reg.intentNavigationEngine.exampleIntentCount} INE intent examples
              </p>
            ) : reg.experienceQualityEngine ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.coreExperiencePrincipleCount ?? 0} experience principles · {reg.experienceQualityEngine.domainCount} EQE domains
              </p>
            ) : reg.topicCount ? (
              <p className={`mt-1 text-xs ${metaClass}`}>{reg.topicCount} topics</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="card border-slate-300 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-900">Foundation Stack</h3>
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          {eab.foundationStack.map((v) => (
            <li key={v.volume}>
              <span className="font-semibold">Volume {v.volume}</span> — {v.defines}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">{pendingSteps} experience layers pending · {eab.masterSequencePath}</p>
      </div>
    </div>
  );
}
