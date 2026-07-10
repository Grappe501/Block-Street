"use client";

import psi from "../../../data/registry/platform-services-integration-bible.json";
import psa from "../../../data/registry/platform-services-architecture.json";
import api from "../../../data/registry/api-architecture-volume5.json";
import integ from "../../../data/registry/integration-architecture.json";
import evt from "../../../data/registry/event-stream-architecture.json";
import sync from "../../../data/registry/synchronization-architecture.json";
import search from "../../../data/registry/search-architecture-volume5.json";
import media from "../../../data/registry/media-architecture-volume5.json";

type ServiceReg = {
  acceptanceCriteria: string;
  status: string;
  guidingPrinciple?: string;
  corePlatformServiceCount?: number;
  servicePrincipleCount?: number;
  apiPrincipleCount?: number;
  apiCategoryCount?: number;
  integrationCategoryCount?: number;
  integrationPrincipleCount?: number;
  eventCategoryCount?: number;
  eventPrincipleCount?: number;
  institutionalEventFabric?: { abbreviation: string; fabricLayers?: { layerCount: number }; eventEnrichment?: { domainCount: number } };
  federatedSynchronizationMesh?: { abbreviation: string; federatedMeshArchitecture?: { levelCount: number }; responsibilityCount: number };
  knowledgeRetrievalFabric?: { abbreviation: string; fabricPipeline?: { stageCount: number }; knowledgeSourceCount: number };
  institutionalMemoryRepository?: { abbreviation: string; memoryPipeline?: { stageCount: number }; memoryObject?: { sectionCount: number } };
  digitalAssetCategoryCount?: number;
  mediaPrincipleCount?: number;
  searchDomainCount?: number;
  searchPrincipleCount?: number;
  searchTypeCount?: number;
  synchronizationDomainCount?: number;
  synchronizationPrincipleCount?: number;
  platformServiceMesh?: { responsibilityCount: number; abbreviation: string };
  constitutionalApiGateway?: { responsibilityCount: number; abbreviation: string; gatewayPipeline?: { stageCount: number } };
  universalConnectorFramework?: { abbreviation: string; connectorPipeline?: { stageCount: number }; connectorCertification?: { criteriaCount: number } };
  serviceArchitecture?: { layerCount: number };
  apiArchitecture?: { layerCount: number };
  integrationArchitecture?: { layerCount: number };
  eventArchitecture?: { layerCount: number };
  synchronizationArchitecture?: { layerCount: number };
  searchArchitecture?: { layerCount: number };
  mediaArchitecture?: { layerCount: number };
  localBrainCompatibility?: { localBrainFirstClassRuntime: boolean };
  localBrainFederation?: {
    explicitIntegration?: boolean;
    offlineOperationContinues?: boolean;
    everyLocalBrainSurvivesIndependently?: boolean;
    flow?: string[];
  };
  localBrainIntegration?: { someIntegrationsExecuteEntirelyInLocalBrain: boolean };
};

const FEATURED_SUBTITLES: Record<string, string> = {
  "5.1": "Platform Services",
  "5.2": "API Layer",
  "5.3": "Integrations",
  "5.4": "Event Streaming",
  "5.5": "Synchronization",
  "5.6": "Search & Discovery",
  "5.7": "Media & Assets",
};

const SERVICE_CARDS: { step: string; label: string; reg: ServiceReg; cardClass: string; metaClass: string; titleClass: string; featured?: boolean }[] = [
  { step: "5.7", label: "Institutional Memory Repository", reg: media, cardClass: "border-amber-300 bg-amber-50", metaClass: "text-amber-700", titleClass: "text-amber-950", featured: true },
  { step: "5.6", label: "Knowledge Retrieval Fabric", reg: search, cardClass: "border-orange-300 bg-orange-50", metaClass: "text-orange-700", titleClass: "text-orange-950", featured: true },
  { step: "5.5", label: "Federated Synchronization Mesh", reg: sync, cardClass: "border-gray-300 bg-gray-50", metaClass: "text-gray-700", titleClass: "text-gray-950", featured: true },
  { step: "5.4", label: "Institutional Event Fabric", reg: evt, cardClass: "border-neutral-300 bg-neutral-50", metaClass: "text-neutral-700", titleClass: "text-neutral-950", featured: true },
  { step: "5.3", label: "Universal Connector Framework", reg: integ, cardClass: "border-stone-300 bg-stone-50", metaClass: "text-stone-700", titleClass: "text-stone-950", featured: true },
  { step: "5.2", label: "Constitutional API Gateway", reg: api, cardClass: "border-zinc-300 bg-zinc-50", metaClass: "text-zinc-700", titleClass: "text-zinc-950", featured: true },
  { step: "5.1", label: "Platform Service Mesh", reg: psa, cardClass: "border-slate-300 bg-slate-50", metaClass: "text-slate-700", titleClass: "text-slate-950", featured: true },
];

export function AdminPlatformServices() {
  const pendingSteps = psi.steps.filter((s) => s.status === "pending").length;
  const featuredStepIds = new Set(SERVICE_CARDS.map((c) => c.step));

  return (
    <div className="space-y-6">
      <div className="card border-slate-400 bg-slate-100">
        <p className="text-xs font-semibold uppercase text-slate-900">VOLUME 5 · Platform Services</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{psi.productName}</h2>
        <p className="mt-2 text-sm text-slate-900">{psi.coreQuestion}</p>
        <p className="mt-1 text-xs italic text-slate-900">&ldquo;{psi.guidingPrinciple}&rdquo;</p>
        <p className="mt-2 text-xs font-semibold text-slate-800">
          {psi.stepsComplete}/{psi.stepsTotal} platform layers · {psi.platformServiceCount} core services · {psi.status}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SERVICE_CARDS.map(({ step, label, reg, cardClass, metaClass, titleClass, featured }) => (
          <div key={step} className={`card ${cardClass}`}>
            <p className={`text-xs font-semibold uppercase ${metaClass}`}>
              VOLUME-00{step.replace(".", "-")} · {featured ? FEATURED_SUBTITLES[step] ?? label : label}
            </p>
            <h3 className={`mt-1 text-sm font-bold ${titleClass}`}>{label}</h3>
            {reg.guidingPrinciple ? (
              <p className={`mt-1 text-xs italic ${metaClass}`}>&ldquo;{reg.guidingPrinciple}&rdquo;</p>
            ) : null}
            <p className={`mt-2 text-xs ${metaClass}`}>
              {reg.acceptanceCriteria} · {reg.status}
            </p>
            {reg.institutionalMemoryRepository ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.digitalAssetCategoryCount ?? 0} asset categories · {reg.mediaPrincipleCount ?? 0} principles · {reg.mediaArchitecture?.layerCount ?? 0} media layers · {reg.institutionalMemoryRepository.memoryPipeline?.stageCount ?? 0} IMR pipeline stages · {reg.institutionalMemoryRepository.memoryObject?.sectionCount ?? 0} Memory Object sections · Living Collections
              </p>
            ) : reg.knowledgeRetrievalFabric ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.searchDomainCount ?? 0} search domains · {reg.searchTypeCount ?? 0} search types · {reg.searchPrincipleCount ?? 0} principles · {reg.searchArchitecture?.layerCount ?? 0} search layers · {reg.knowledgeRetrievalFabric.fabricPipeline?.stageCount ?? 0} KRF pipeline stages · {reg.knowledgeRetrievalFabric.knowledgeSourceCount} knowledge sources · Knowledge Bundles
              </p>
            ) : reg.federatedSynchronizationMesh ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.synchronizationDomainCount ?? 0} sync domains · {reg.synchronizationPrincipleCount ?? 0} principles · {reg.synchronizationArchitecture?.layerCount ?? 0} sync layers · {reg.federatedSynchronizationMesh.federatedMeshArchitecture?.levelCount ?? 0} federation levels · {reg.federatedSynchronizationMesh.responsibilityCount} {reg.federatedSynchronizationMesh.abbreviation} responsibilities · Operational Time Machine
              </p>
            ) : reg.institutionalEventFabric ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.eventCategoryCount ?? 0} event categories · {reg.eventPrincipleCount ?? 0} principles · {reg.eventArchitecture?.layerCount ?? 0} event layers · {reg.institutionalEventFabric.fabricLayers?.layerCount ?? 0} IEF fabric layers · {reg.institutionalEventFabric.eventEnrichment?.domainCount ?? 0} enrichment domains · Event Time Machine
              </p>
            ) : reg.universalConnectorFramework ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.integrationCategoryCount ?? 0} integration categories · {reg.integrationPrincipleCount ?? 0} principles · {reg.integrationArchitecture?.layerCount ?? 0} integration layers · {reg.universalConnectorFramework.connectorPipeline?.stageCount ?? 0} UCF pipeline stages · {reg.universalConnectorFramework.connectorCertification?.criteriaCount ?? 0} certification criteria
                {reg.localBrainIntegration?.someIntegrationsExecuteEntirelyInLocalBrain ? " · LocalBrain integrations" : ""}
              </p>
            ) : reg.constitutionalApiGateway ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.apiCategoryCount ?? 0} API categories · {reg.apiPrincipleCount ?? 0} principles · {reg.apiArchitecture?.layerCount ?? 0} request layers · {reg.constitutionalApiGateway.gatewayPipeline?.stageCount ?? 0} gateway stages · {reg.constitutionalApiGateway.responsibilityCount} {reg.constitutionalApiGateway.abbreviation} responsibilities
                {reg.localBrainFederation?.explicitIntegration ? " · LocalBrain explicit" : ""}
              </p>
            ) : reg.platformServiceMesh ? (
              <p className={`mt-1 text-xs ${metaClass}`}>
                {reg.corePlatformServiceCount ?? 0} core services · {reg.servicePrincipleCount ?? 0} principles · {reg.serviceArchitecture?.layerCount ?? 0} pipeline layers · {reg.platformServiceMesh.responsibilityCount} {reg.platformServiceMesh.abbreviation} responsibilities
                {reg.localBrainCompatibility?.localBrainFirstClassRuntime ? " · LocalBrain first-class" : ""}
              </p>
            ) : null}
          </div>
        ))}

        {psi.steps
          .filter((s) => !featuredStepIds.has(s.id))
          .map((s) => (
            <div key={s.id} className="card border-slate-200 bg-white opacity-75">
              <p className="text-xs font-semibold uppercase text-slate-500">VOLUME-00{s.id.replace(".", "-")}</p>
              <h3 className="mt-1 text-sm font-bold text-slate-700">{s.name}</h3>
              <p className="mt-2 text-xs text-slate-500">
                {s.requirement} · {s.status}
              </p>
            </div>
          ))}
      </div>

      {pendingSteps > 0 ? (
        <p className="text-xs text-slate-600">
          {pendingSteps} platform layer{pendingSteps === 1 ? "" : "s"} pending · LocalBrain woven throughout Volume 5
        </p>
      ) : null}
    </div>
  );
}
