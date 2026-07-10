"use client";

import pba from "../../../data/registry/platform-behavior-bible.json";
import bre from "../../../data/registry/business-rule-engine.json";
import wor from "../../../data/registry/workflow-engine.json";
import idl from "../../../data/registry/identity-lifecycle-engine.json";
import clo from "../../../data/registry/community-lifecycle-engine.json";
import mex from "../../../data/registry/mission-execution-engine.json";
import vxe from "../../../data/registry/volunteer-experience-engine.json";
import lde from "../../../data/registry/leadership-development-engine.json";
import cie from "../../../data/registry/community-intelligence-engine.json";
import aut from "../../../data/registry/automation-engine.json";
import att from "../../../data/registry/attention-engine.json";
import gov from "../../../data/registry/governance-engine.json";
import kge from "../../../data/registry/knowledge-growth-engine.json";
import oie from "../../../data/registry/operational-intelligence-engine.json";
import cos from "../../../data/registry/community-os-orchestrator.json";

type EngineReg = {
  defines?: string[];
  acceptanceCriteria: string;
  status: string;
  guidingPrinciple?: string;
  ruleCategoryCount?: number;
  workflowCategoryCount?: number;
  communityProcessOrchestrator?: { coordinateCount: number; communityLaunchExampleStepCount: number };
  policyDecisionPoint?: { evaluationStepCount: number; exampleRequestCount: number };
  personalOperatingSystem?: { domainCount: number };
  communityOperatingManual?: { domainCount: number };
  missionOperationsCenter?: { domainCount: number };
  volunteerSuccessCenter?: { domainCount: number };
  leadershipAcademy?: { domainCount: number };
  intelligenceDomainCount?: number;
  communityIntelligenceCommandCenter?: { domainCount: number };
  intelligenceArchitectureLayerCount?: number;
  lifecycleStageCount?: number;
  runtimePipelineLayerCount?: number;
};

const FEATURED_SUBTITLES: Record<string, string> = {
  "3.1": "Business Rules",
  "3.2": "Workflow",
  "3.3": "Identity & Lifecycle",
  "3.4": "Community Lifecycle",
  "3.5": "Mission Execution",
  "3.6": "Volunteer Experience",
  "3.7": "Leadership Development",
  "3.8": "Community Intelligence",
};

const ENGINE_CARDS: { step: string; label: string; reg: EngineReg; cardClass: string; metaClass: string; titleClass: string; featured?: boolean }[] = [
  { step: "3.1", label: "Policy Decision Point", reg: bre, cardClass: "border-violet-300 bg-violet-50", metaClass: "text-violet-700", titleClass: "text-violet-950", featured: true },
  { step: "3.2", label: "Community Process Orchestrator", reg: wor, cardClass: "border-purple-300 bg-purple-50", metaClass: "text-purple-700", titleClass: "text-purple-950", featured: true },
  { step: "3.3", label: "Personal Operating System", reg: idl, cardClass: "border-fuchsia-300 bg-fuchsia-50", metaClass: "text-fuchsia-700", titleClass: "text-fuchsia-950", featured: true },
  { step: "3.4", label: "Community Operating Manual", reg: clo, cardClass: "border-pink-300 bg-pink-50", metaClass: "text-pink-700", titleClass: "text-pink-950", featured: true },
  { step: "3.5", label: "Mission Operations Center", reg: mex, cardClass: "border-rose-300 bg-rose-50", metaClass: "text-rose-700", titleClass: "text-rose-950", featured: true },
  { step: "3.6", label: "Volunteer Success Center", reg: vxe, cardClass: "border-red-300 bg-red-50", metaClass: "text-red-700", titleClass: "text-red-950", featured: true },
  { step: "3.7", label: "Leadership Academy", reg: lde, cardClass: "border-orange-300 bg-orange-50", metaClass: "text-orange-700", titleClass: "text-orange-950", featured: true },
  { step: "3.8", label: "Community Intelligence Command Center", reg: cie, cardClass: "border-amber-300 bg-amber-50", metaClass: "text-amber-700", titleClass: "text-amber-950", featured: true },
  { step: "3.9", label: "Automation", reg: aut, cardClass: "border-yellow-300 bg-yellow-50", metaClass: "text-yellow-700", titleClass: "text-yellow-950" },
  { step: "3.10", label: "Attention", reg: att, cardClass: "border-lime-300 bg-lime-50", metaClass: "text-lime-700", titleClass: "text-lime-950" },
  { step: "3.11", label: "Governance", reg: gov, cardClass: "border-green-300 bg-green-50", metaClass: "text-green-700", titleClass: "text-green-950" },
  { step: "3.12", label: "Knowledge Growth", reg: kge, cardClass: "border-emerald-300 bg-emerald-50", metaClass: "text-emerald-700", titleClass: "text-emerald-950" },
  { step: "3.13", label: "Operational Intelligence", reg: oie, cardClass: "border-teal-300 bg-teal-50", metaClass: "text-teal-700", titleClass: "text-teal-950" },
  { step: "3.14", label: "COS Orchestrator", reg: cos, cardClass: "border-cyan-300 bg-cyan-50", metaClass: "text-cyan-700", titleClass: "text-cyan-950" },
];

export function AdminPlatformBehavior() {
  const pendingSteps = pba.steps.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="card border-violet-400 bg-violet-100">
        <p className="text-xs font-semibold uppercase text-violet-900">VOLUME 3 · Platform Behavior</p>
        <h2 className="mt-1 text-xl font-bold text-violet-950">{pba.productName}</h2>
        <p className="mt-2 text-sm text-violet-900">{pba.coreQuestion}</p>
        <p className="mt-1 text-xs italic text-violet-900">&ldquo;{pba.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-violet-800">
          {pba.stepsComplete}/{pba.stepsTotal} engines · {pba.engineCount} operational engines · {pba.status}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ENGINE_CARDS.map(({ step, label, reg, cardClass, metaClass, titleClass, featured }) => (
          <div key={step} className={`card ${cardClass}`}>
            <p className={`text-xs font-semibold uppercase ${metaClass}`}>VOLUME-00{step.replace(".", "-")} · {featured ? FEATURED_SUBTITLES[step] ?? label : label}</p>
            <h3 className={`mt-1 text-sm font-bold ${titleClass}`}>{label}</h3>
            {reg.guidingPrinciple ? (
              <p className={`mt-1 text-xs italic ${metaClass}`}>&ldquo;{reg.guidingPrinciple}&rdquo;</p>
            ) : null}
            <p className={`mt-2 text-xs ${metaClass}`}>
              {reg.workflowCategoryCount ? `${reg.workflowCategoryCount} workflow categories · ` : reg.ruleCategoryCount ? `${reg.ruleCategoryCount} rule categories · ` : reg.defines ? `${reg.defines.length} behaviors · ` : ""}
              {reg.acceptanceCriteria} · {reg.status}
            </p>
            {reg.communityProcessOrchestrator ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.communityProcessOrchestrator.coordinateCount} orchestration coordinates · {reg.communityProcessOrchestrator.communityLaunchExampleStepCount} launch steps
              </p>
            ) : null}
            {reg.policyDecisionPoint ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.policyDecisionPoint.evaluationStepCount} PDP steps · {reg.policyDecisionPoint.exampleRequestCount} example requests
              </p>
            ) : null}
            {reg.communityIntelligenceCommandCenter ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.intelligenceDomainCount ?? 0} intelligence domains · {reg.communityIntelligenceCommandCenter.domainCount} CICC domains
              </p>
            ) : reg.leadershipAcademy ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.leadershipAcademy.domainCount} Academy domains · {reg.lifecycleStageCount ?? 0} lifecycle stages
              </p>
            ) : reg.volunteerSuccessCenter ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.volunteerSuccessCenter.domainCount} VSC domains · {reg.lifecycleStageCount ?? 0} lifecycle stages
              </p>
            ) : reg.missionOperationsCenter ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.missionOperationsCenter.domainCount} MOC domains · {reg.lifecycleStageCount ?? 0} lifecycle stages
              </p>
            ) : reg.communityOperatingManual ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.communityOperatingManual.domainCount} Operating Manual domains · {reg.lifecycleStageCount ?? 0} lifecycle stages
              </p>
            ) : reg.personalOperatingSystem ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.personalOperatingSystem.domainCount} Personal OS domains · {reg.lifecycleStageCount ?? 0} lifecycle stages
              </p>
            ) : reg.lifecycleStageCount ? (
              <p className={`mt-1 text-xs ${metaClass}`}>{reg.lifecycleStageCount} lifecycle stages</p>
            ) : null}
            {reg.runtimePipelineLayerCount ? (
              <p className={`mt-1 text-xs ${metaClass}`}>{reg.runtimePipelineLayerCount} pipeline layers · runtime orchestrator</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="card border-slate-300 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-900">Foundation Stack</h3>
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          {pba.foundationStack.map((v) => (
            <li key={v.volume}>
              <span className="font-semibold">Volume {v.volume}</span> — {v.defines}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">{pendingSteps} engines pending · {pba.masterSequencePath}</p>
      </div>
    </div>
  );
}
