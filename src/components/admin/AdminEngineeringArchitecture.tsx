"use client";

import eab from "../../../data/registry/engineering-architecture-bible.json";
import doctrine from "../../../data/registry/engineering-doctrine.json";
import sysarch from "../../../data/registry/system-architecture.json";
import dbarch from "../../../data/registry/database-architecture.json";
import autharch from "../../../data/registry/authorization-architecture.json";
import dsarch from "../../../data/registry/domain-service-architecture.json";
import ckgarch from "../../../data/registry/community-knowledge-graph-architecture.json";
import etarch from "../../../data/registry/event-timeline-architecture.json";
import searcharch from "../../../data/registry/search-architecture.json";
import maparch from "../../../data/registry/map-geographic-architecture.json";
import commarch from "../../../data/registry/communication-architecture.json";
import aiarch from "../../../data/registry/ai-intelligence-architecture.json";
import deployarch from "../../../data/registry/deployment-testing-release-architecture.json";

export function AdminEngineeringArchitecture() {
  const doneSteps = eab.steps.filter((s) => s.status === "done").length;
  const nextStep = eab.steps.find((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <div className="card border-slate-400 bg-slate-100">
        <p className="text-xs font-semibold uppercase text-slate-800">VOLUME 1 · Engineering Architecture Bible</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{eab.productName}</h2>
        <p className="mt-2 text-sm text-slate-800">What is the software architecture?</p>
        <p className="mt-2 text-xs font-semibold text-slate-700">
          {doneSteps}/{eab.stepsTotal} steps · {eab.status.replace("_", " ")}
        </p>
      </div>

      <div className="card border-rose-300 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">VOLUME-001.14 · Deployment, Testing & Release</p>
        <h2 className="mt-1 text-lg font-bold text-rose-950">{deployarch.title}</h2>
        <p className="mt-1 text-xs text-rose-900">{deployarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-rose-800">
          {deployarch.environments.length} environments · {deployarch.testingLevels.length} test levels · {deployarch.alertTiers.length} alert tiers
        </p>
        <p className="mt-1 text-xs text-rose-700">Companion: Community Readiness Command Center [CRCC-001] · OLB-001</p>
      </div>

      <div className="card border-violet-300 bg-violet-50">
        <p className="text-xs font-semibold uppercase text-violet-800">VOLUME-001.13 · AI & Intelligence</p>
        <h2 className="mt-1 text-lg font-bold text-violet-950">{aiarch.title}</h2>
        <p className="mt-1 text-xs text-violet-900">{aiarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-violet-800">
          {aiarch.specializedAgents.length} agents · {aiarch.memoryLayers.length} memory layers
        </p>
        <p className="mt-1 text-xs text-violet-700">Companion: Community Intelligence Fabric [CIF-001] · Volume 4 [AIB-001]</p>
      </div>

      <div className="card border-orange-300 bg-orange-50">
        <p className="text-xs font-semibold uppercase text-orange-800">VOLUME-001.12 · Notification & Communication</p>
        <h2 className="mt-1 text-lg font-bold text-orange-950">{commarch.title}</h2>
        <p className="mt-1 text-xs text-orange-900">{commarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-orange-800">
          {commarch.communicationLayers.length} layers · {commarch.priorities.length} priority levels
        </p>
        <p className="mt-1 text-xs text-orange-700">Companion: Attention Management Engine [AME-001] · CAM-001</p>
      </div>

      <div className="card border-lime-300 bg-lime-50">
        <p className="text-xs font-semibold uppercase text-lime-800">VOLUME-001.11 · Map & Geographic Architecture</p>
        <h2 className="mt-1 text-lg font-bold text-lime-950">{maparch.title}</h2>
        <p className="mt-1 text-xs text-lime-900">{maparch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-lime-800">
          {maparch.coreMaps.length} core maps · {maparch.geoHierarchy.length}-level geo hierarchy
        </p>
        <p className="mt-1 text-xs text-lime-700">Companion: Arkansas Digital Twin [ADT-002] · builds on [ADT-001]</p>
      </div>

      <div className="card border-cyan-300 bg-cyan-50">
        <p className="text-xs font-semibold uppercase text-cyan-800">VOLUME-001.10 · Search & Discovery</p>
        <h2 className="mt-1 text-lg font-bold text-cyan-950">{searcharch.title}</h2>
        <p className="mt-1 text-xs text-cyan-900">{searcharch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-cyan-800">
          {searcharch.searchLayers.length} search layers · {searcharch.searchableEntityTypes.length} entity types
        </p>
        <p className="mt-1 text-xs text-cyan-700">Companion: Discovery Engine [DGE-001]</p>
      </div>

      <div className="card border-amber-300 bg-amber-50">
        <p className="text-xs font-semibold uppercase text-amber-800">VOLUME-001.9 · Event & Timeline Architecture</p>
        <h2 className="mt-1 text-lg font-bold text-amber-950">{etarch.title}</h2>
        <p className="mt-1 text-xs text-amber-900">{etarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-amber-800">
          {etarch.entityTimelines.length} entity timelines · {etarch.eventCategories.length} event categories
        </p>
        <p className="mt-1 text-xs text-amber-700">Companion: Living History Engine [LHE-001]</p>
      </div>

      <div className="card border-indigo-300 bg-indigo-50">
        <p className="text-xs font-semibold uppercase text-indigo-800">VOLUME-001.8 · Community Knowledge Graph</p>
        <h2 className="mt-1 text-lg font-bold text-indigo-950">{ckgarch.title}</h2>
        <p className="mt-1 text-xs text-indigo-900">{ckgarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-indigo-800">
          {ckgarch.nodeCategories.length} node categories · {ckgarch.signatureGraphs.length} signature graphs
        </p>
        <p className="mt-1 text-xs text-indigo-700">Companion: Living Digital Twin [LDT-001]</p>
      </div>

      <div className="card border-teal-300 bg-teal-50">
        <p className="text-xs font-semibold uppercase text-teal-800">VOLUME-001.7 · Domain Service Architecture</p>
        <h2 className="mt-1 text-lg font-bold text-teal-950">{dsarch.title}</h2>
        <p className="mt-1 text-xs text-teal-900">{dsarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-teal-800">
          {dsarch.serviceCount} domain services · {dsarch.refinementFromEng002}
        </p>
        <p className="mt-1 text-xs text-teal-700">Companion: Service Registry [SRG-001]</p>
      </div>

      <div className="card border-rose-300 bg-rose-50">
        <p className="text-xs font-semibold uppercase text-rose-800">VOLUME-001.6 · Authentication & Authorization</p>
        <h2 className="mt-1 text-lg font-bold text-rose-950">{autharch.title}</h2>
        <p className="mt-1 text-xs text-rose-900">{autharch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-rose-800">
          {autharch.architecturalLayers.length} layers · {autharch.platformRoles.length} platform roles
        </p>
        <p className="mt-1 text-xs text-rose-700">Companion: Permission Resolution Engine [PRE-001]</p>
      </div>

      <div className="card border-purple-300 bg-purple-50">
        <p className="text-xs font-semibold uppercase text-purple-800">VOLUME-001.4 · Database Architecture</p>
        <h2 className="mt-1 text-lg font-bold text-purple-950">{dbarch.title}</h2>
        <p className="mt-1 text-xs text-purple-900">{dbarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-purple-800">
          {dbarch.primaryEngine} · {dbarch.domains.length} domains · {dbarch.graphStrategy.replace("_", " ")} graph
        </p>
        <p className="mt-1 text-xs text-purple-700">Companion: Digital Constitution Layer [DCL-001]</p>
      </div>

      <div className="card border-blue-300 bg-blue-50">
        <p className="text-xs font-semibold uppercase text-blue-800">VOLUME-001.2 · System Architecture</p>
        <h2 className="mt-1 text-lg font-bold text-blue-950">{sysarch.title}</h2>
        <p className="mt-1 text-xs text-blue-900">{sysarch.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-blue-800">Platform Kernel · {sysarch.platformKernel.capabilities.length} capabilities</p>
        <p className="mt-1 text-xs text-blue-700">{sysarch.layers.length} layers · {sysarch.domainServices.length} domain services</p>
      </div>

      <div className="card border-green-300 bg-green-50">
        <p className="text-xs font-semibold uppercase text-green-800">VOLUME-001.1 · Engineering Doctrine</p>
        <h2 className="mt-1 text-lg font-bold text-green-950">{doctrine.title}</h2>
        <p className="mt-1 text-xs font-medium text-green-900">{doctrine.guidingPrinciple}</p>
        <p className="mt-2 text-xs italic text-green-800">{doctrine.engineeringMotto}</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Volume 1 Step Sequence</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {eab.steps.map((step) => (
            <li key={step.id} className="flex items-center gap-2 text-slate-800">
              <span className={step.status === "done" ? "text-green-600" : "text-slate-300"}>
                {step.status === "done" ? "✓" : "○"}
              </span>
              <span className="font-mono text-xs text-slate-500">{step.id}</span>
              <span>{step.name}</span>
              <span className="text-xs text-slate-400">[{step.requirement}]</span>
            </li>
          ))}
        </ul>
      </div>

      {nextStep && (
        <div className="card border-amber-200 bg-amber-50/50">
          <h2 className="text-sm font-bold text-amber-950">Next Step</h2>
          <p className="mt-1 text-xs text-amber-900">
            {nextStep.id} — {nextStep.name} [{nextStep.requirement}]
          </p>
        </div>
      )}
    </div>
  );
}
